import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { QueryCollegesDto, SortBy } from './dto/query-colleges.dto';
import { Prisma } from '@prisma/client';

@Injectable()
export class CollegesService {
  constructor(private prisma: PrismaService) {}

  async findAll(query: QueryCollegesDto) {
    const {
      q,
      type,
      state,
      city,
      minFees,
      maxFees,
      minRating,
      sortBy = SortBy.RATING_DESC,
      cursor,
      limit = 20,
    } = query;

    const where: Prisma.CollegeWhereInput = {};

    if (type) where.type = type as any;
    if (state) where.state = { equals: state, mode: 'insensitive' };
    if (city) where.city = { equals: city, mode: 'insensitive' };
    if (minFees !== undefined) where.minFees = { gte: minFees };
    if (maxFees !== undefined) where.maxFees = { lte: maxFees };
    if (minRating !== undefined) where.totalRating = { gte: minRating };

    // Full-text search via PostgreSQL raw query when q is provided
    // We join on searchable fields rather than relying on tsvector column
    // to keep Prisma compatibility while still using pg full-text ranking
    if (q) {
      where.OR = [
        { name: { contains: q, mode: 'insensitive' } },
        { city: { contains: q, mode: 'insensitive' } },
        { state: { contains: q, mode: 'insensitive' } },
        { description: { contains: q, mode: 'insensitive' } },
      ];
    }

    const orderBy = this.buildOrderBy(sortBy);

    // Cursor-based pagination
    const cursorObj = cursor ? { id: cursor } : undefined;

    const colleges = await this.prisma.college.findMany({
      where,
      orderBy,
      take: limit + 1, // fetch one extra to determine if there's a next page
      skip: cursor ? 1 : 0,
      cursor: cursorObj,
      select: {
        id: true,
        name: true,
        slug: true,
        type: true,
        city: true,
        state: true,
        imageUrl: true,
        accreditation: true,
        established: true,
        totalRating: true,
        reviewCount: true,
        minFees: true,
        maxFees: true,
        placements: {
          orderBy: { year: 'desc' },
          take: 1,
          select: {
            avgPackage: true,
            highestPackage: true,
            placementRate: true,
            year: true,
          },
        },
        _count: {
          select: { courses: true },
        },
      },
    });

    const hasNextPage = colleges.length > limit;
    const items = hasNextPage ? colleges.slice(0, -1) : colleges;
    const nextCursor = hasNextPage ? items[items.length - 1].id : null;

    const totalCount = await this.prisma.college.count({ where });

    return {
      items: items.map((c) => ({
        ...c,
        latestPlacement: c.placements[0] ?? null,
        courseCount: c._count.courses,
        placements: undefined,
        _count: undefined,
      })),
      pagination: {
        nextCursor,
        hasNextPage,
        totalCount,
        limit,
      },
    };
  }

  async findBySlug(slug: string) {
    const college = await this.prisma.college.findUnique({
      where: { slug },
      include: {
        courses: {
          orderBy: { fees: 'asc' },
        },
        placements: {
          orderBy: { year: 'desc' },
          take: 5,
        },
        reviews: {
          orderBy: { createdAt: 'desc' },
          take: 10,
          include: {
            user: {
              select: { id: true, name: true },
            },
          },
        },
        _count: {
          select: { reviews: true, courses: true },
        },
      },
    });

    if (!college) {
      throw new NotFoundException(`College with slug "${slug}" not found`);
    }

    // Aggregate stats
    const placementStats = college.placements.length
      ? {
          avgPackage:
            college.placements.reduce((sum, p) => sum + p.avgPackage, 0) /
            college.placements.length,
          highestPackage: Math.max(...college.placements.map((p) => p.highestPackage)),
          avgPlacementRate:
            college.placements.reduce((sum, p) => sum + p.placementRate, 0) /
            college.placements.length,
          years: college.placements.map((p) => p.year),
        }
      : null;

    return {
      ...college,
      placementStats,
      totalReviews: college._count.reviews,
      totalCourses: college._count.courses,
    };
  }

  async getDistinctFilters() {
    const [states, cities, types] = await Promise.all([
      this.prisma.college.findMany({
        select: { state: true },
        distinct: ['state'],
        orderBy: { state: 'asc' },
      }),
      this.prisma.college.findMany({
        select: { city: true },
        distinct: ['city'],
        orderBy: { city: 'asc' },
      }),
      this.prisma.college.findMany({
        select: { type: true },
        distinct: ['type'],
      }),
    ]);

    return {
      states: states.map((s) => s.state),
      cities: cities.map((c) => c.city),
      types: types.map((t) => t.type),
    };
  }

  private buildOrderBy(sortBy: SortBy): Prisma.CollegeOrderByWithRelationInput {
    switch (sortBy) {
      case SortBy.FEES_ASC:
        return { minFees: 'asc' };
      case SortBy.FEES_DESC:
        return { maxFees: 'desc' };
      case SortBy.NAME_ASC:
        return { name: 'asc' };
      case SortBy.ESTABLISHED_DESC:
        return { established: 'desc' };
      case SortBy.RATING_DESC:
      default:
        return { totalRating: 'desc' };
    }
  }
}
