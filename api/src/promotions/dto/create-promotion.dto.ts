import { IsString, IsNotEmpty, IsOptional, IsEnum, IsNumber, IsBoolean, IsArray, IsUUID, Min, IsDateString } from 'class-validator';
import { PromotionType } from '@prisma/client';
import { Type } from 'class-transformer';

export class CreatePromotionDto {
  @IsString()
  @IsNotEmpty()
  name: string;

  @IsString()
  @IsOptional()
  description?: string;

  @IsString()
  @IsOptional()
  code?: string;

  @IsEnum(PromotionType)
  @IsNotEmpty()
  type: PromotionType;

  @IsNumber()
  @Type(() => Number)
  @Min(0)
  value: number;

  @IsNumber()
  @Type(() => Number)
  @IsOptional()
  @Min(0)
  minOrderAmount?: number;

  @IsNumber()
  @Type(() => Number)
  @IsOptional()
  @Min(0)
  maxUsage?: number;

  @IsBoolean()
  @IsOptional()
  isActive?: boolean;

  @IsDateString()
  @IsOptional()
  startDate?: string;

  @IsDateString()
  @IsOptional()
  endDate?: string;

  @IsArray()
  @IsUUID(undefined, { each: true })
  @IsOptional()
  productIds?: string[];
}


