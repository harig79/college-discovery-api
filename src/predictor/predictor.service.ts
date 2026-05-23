import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { Category, ExamType, PredictDto } from './dto/predict.dto';

type AdmissionChance = 'HIGH' | 'MEDIUM' | 'LOW' | 'REACH';

@Injectable()
export class PredictorService {
  constructor(private prisma: PrismaService) {}

  async predict(dto: PredictDto) {
    const { exam, rank, category = Category.GENERAL, limit = 20 } = dto;

    // Find all cutoffs where the closing rank >= user's rank
    // (closing rank is the worst rank admitted, so if your rank is better, you qualify)
    const cutoffs = await this.prisma.examCutoff.findMany({
      where: {
        exam: exam as any,
        category: category as any,
        closingRank: { gte: rank },
      },
      include: {
        college: {
          select: {
            id: true,
            name: true,
            slug: true,
            type: true,
            city: true,
            state: true,
            imageUrl: true,
            totalRating: true,
            minFees: true,
            maxFees: true,
            placements: {
              orderBy: { year: 'desc' },
              take: 1,
              select: {
                avgPackage: true,
                placementRate: true,
              },
            },
          },
        },
        course: {
          select: { name: true, degreeType: true, fees: true },
        },
      },
      orderBy: [
        { closingRank: 'asc' }, // tightest cutoffs first (most prestigious)
        { openingRank: 'desc' },
      ],
      take: limit * 3, // fetch extra to deduplicate colleges
    });

    // Deduplicate: keep best (tightest) cutoff per college
    const seen = new Map<number, (typeof cutoffs)[0]>();
    for (const cutoff of cutoffs) {
      const existing = seen.get(cutoff.collegeId);
      if (!existing || cutoff.closingRank < existing.closingRank) {
        seen.set(cutoff.collegeId, cutoff);
      }
    }

    const results = [...seen.values()].slice(0, limit);

    return {
      exam,
      rank,
      category,
      year: new Date().getFullYear() - 1, // based on previous year data
      totalMatches: seen.size,
      predictions: results.map((c) => ({
        college: {
          id: c.college.id,
          name: c.college.name,
          slug: c.college.slug,
          type: c.college.type,
          city: c.college.city,
          state: c.college.state,
          imageUrl: c.college.imageUrl,
          rating: c.college.totalRating,
          fees: { min: c.college.minFees, max: c.college.maxFees },
          latestPlacement: c.college.placements[0] ?? null,
        },
        course: c.course,
        cutoff: {
          openingRank: c.openingRank,
          closingRank: c.closingRank,
          year: c.year,
        },
        admissionChance: this.calculateChance(rank, c.openingRank, c.closingRank),
      })),
    };
  }

  private calculateChance(
    userRank: number,
    openingRank: number,
    closingRank: number,
  ): AdmissionChance {
    const range = closingRank - openingRank;
    const distanceFromClosing = closingRank - userRank;

    if (distanceFromClosing > range * 0.5) return 'HIGH';
    if (distanceFromClosing > range * 0.2) return 'MEDIUM';
    if (distanceFromClosing > 0) return 'LOW';
    return 'REACH';
  }
}
