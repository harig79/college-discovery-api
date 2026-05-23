import { ApiPropertyOptional } from '@nestjs/swagger';
import { Transform, Type } from 'class-transformer';
import {
  IsEnum,
  IsInt,
  IsNumber,
  IsOptional,
  IsString,
  Max,
  Min,
} from 'class-validator';

export enum CollegeType {
  IIT = 'IIT',
  NIT = 'NIT',
  IIIT = 'IIIT',
  DEEMED = 'DEEMED',
  PRIVATE = 'PRIVATE',
  GOVERNMENT = 'GOVERNMENT',
  CENTRAL = 'CENTRAL',
}

export enum SortBy {
  RATING_DESC = 'rating_desc',
  FEES_ASC = 'fees_asc',
  FEES_DESC = 'fees_desc',
  NAME_ASC = 'name_asc',
  ESTABLISHED_DESC = 'established_desc',
}

export class QueryCollegesDto {
  @ApiPropertyOptional({ description: 'Full-text search query' })
  @IsOptional()
  @IsString()
  q?: string;

  @ApiPropertyOptional({ enum: CollegeType })
  @IsOptional()
  @IsEnum(CollegeType)
  type?: CollegeType;

  @ApiPropertyOptional({ description: 'Filter by state' })
  @IsOptional()
  @IsString()
  state?: string;

  @ApiPropertyOptional({ description: 'Filter by city' })
  @IsOptional()
  @IsString()
  city?: string;

  @ApiPropertyOptional({ description: 'Minimum fees (LPA)' })
  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  @Min(0)
  minFees?: number;

  @ApiPropertyOptional({ description: 'Maximum fees (LPA)' })
  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  @Min(0)
  maxFees?: number;

  @ApiPropertyOptional({ description: 'Minimum rating (0-5)' })
  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  @Min(0)
  @Max(5)
  minRating?: number;

  @ApiPropertyOptional({ enum: SortBy, default: SortBy.RATING_DESC })
  @IsOptional()
  @IsEnum(SortBy)
  sortBy?: SortBy = SortBy.RATING_DESC;

  @ApiPropertyOptional({ description: 'Cursor for pagination (last college id)' })
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  cursor?: number;

  @ApiPropertyOptional({ description: 'Page size', default: 20 })
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  @Max(100)
  limit?: number = 20;
}
