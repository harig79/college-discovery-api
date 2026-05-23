import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class CompareService {
  constructor(private prisma: PrismaService) {}

  async compare(ids: number[]) {
    if (ids.length < 2 || ids.length > 3) {
      throw new BadRequestException('Provide between 2 and 3 college IDs to compare');
    }

    const unique = [...new Set(ids)];
    if (unique.length !== ids.length) {
      throw new BadRequestException('Duplicate college IDs are not allowed');
    }

    const colleges = await this.prisma.college.findMany({
      where: { id: { in: ids } },
      include: {
        placements: {
          orderBy: { year: 'desc' },
          take: 1,
        },
        courses: {
          orderBy: { fees: 'asc' },
        },
        _count: {
          select: { reviews: true, courses: true },
        },
      },
    });

    if (colleges.length !== ids.length) {
      const foundIds = colleges.map((c) => c.id);
      const missing = ids.filter((id) => !foundIds.includes(id));
      throw new NotFoundException(`College IDs not found: ${missing.join(', ')}`);
    }

    // Return in the same order as requested
    const ordered = ids.map((id) => colleges.find((c) => c.id === id)!);

    return {
      colleges: ordered.map((c) => this.formatForComparison(c)),
      comparisonMatrix: this.buildComparisonMatrix(ordered),
    };
  }

  private formatForComparison(college: any) {
    const latestPlacement = college.placements[0];
    return {
      id: college.id,
      name: college.name,
      slug: college.slug,
      type: college.type,
      city: college.city,
      state: college.state,
      established: college.established,
      accreditation: college.accreditation,
      imageUrl: college.imageUrl,
      rating: college.totalRating,
      reviewCount: college.reviewCount,
      fees: {
        min: college.minFees,
        max: college.maxFees,
      },
      placement: latestPlacement
        ? {
            avgPackage: latestPlacement.avgPackage,
            highestPackage: latestPlacement.highestPackage,
            placementRate: latestPlacement.placementRate,
            year: latestPlacement.year,
          }
        : null,
      courseCount: college._count.courses,
      degreeTypes: [...new Set(college.courses.map((c: any) => c.degreeType))],
    };
  }

  private buildComparisonMatrix(colleges: any[]) {
    const metrics = [
      {
        key: 'totalRating',
        label: 'Rating',
        values: colleges.map((c) => c.totalRating),
        higherIsBetter: true,
      },
      {
        key: 'minFees',
        label: 'Min Fees (₹)',
        values: colleges.map((c) => c.minFees),
        higherIsBetter: false,
      },
      {
        key: 'maxFees',
        label: 'Max Fees (₹)',
        values: colleges.map((c) => c.maxFees),
        higherIsBetter: false,
      },
      {
        key: 'avgPackage',
        label: 'Avg Package (LPA)',
        values: colleges.map((c) => c.placements[0]?.avgPackage ?? 0),
        higherIsBetter: true,
      },
      {
        key: 'highestPackage',
        label: 'Highest Package (LPA)',
        values: colleges.map((c) => c.placements[0]?.highestPackage ?? 0),
        higherIsBetter: true,
      },
      {
        key: 'placementRate',
        label: 'Placement Rate (%)',
        values: colleges.map((c) => c.placements[0]?.placementRate ?? 0),
        higherIsBetter: true,
      },
    ];

    return metrics.map((metric) => {
      const best = metric.higherIsBetter
        ? Math.max(...metric.values)
        : Math.min(...metric.values.filter((v) => v > 0));

      return {
        label: metric.label,
        values: metric.values.map((v, i) => ({
          collegeId: colleges[i].id,
          value: v,
          isBest: v === best && v !== 0,
        })),
      };
    });
  }
}
