import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsEnum, IsInt, IsOptional, Max, Min } from 'class-validator';

export enum ExamType {
  JEE_MAIN = 'JEE_MAIN',
  JEE_ADVANCED = 'JEE_ADVANCED',
  NEET = 'NEET',
  CAT = 'CAT',
  GATE = 'GATE',
  XAT = 'XAT',
  CLAT = 'CLAT',
}

export enum Category {
  GENERAL = 'GENERAL',
  OBC = 'OBC',
  SC = 'SC',
  ST = 'ST',
  EWS = 'EWS',
}

export class PredictDto {
  @ApiProperty({ enum: ExamType, example: ExamType.JEE_MAIN })
  @IsEnum(ExamType)
  exam: ExamType;

  @ApiProperty({ description: 'Your rank in the exam', example: 5000 })
  @Type(() => Number)
  @IsInt()
  @Min(1)
  rank: number;

  @ApiPropertyOptional({ enum: Category, default: Category.GENERAL })
  @IsOptional()
  @IsEnum(Category)
  category?: Category = Category.GENERAL;

  @ApiPropertyOptional({ description: 'Max results to return', default: 20 })
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  @Max(50)
  limit?: number = 20;
}
