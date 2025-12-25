import { IsString, IsNotEmpty, IsNumber, IsOptional, IsBoolean, IsArray, IsUUID, Min } from 'class-validator';
import { Type } from 'class-transformer';

export class CreateProductDto {
  @IsString()
  @IsNotEmpty()
  title: string;

  @IsString()
  @IsOptional()
  slug?: string;

  @IsString()
  @IsOptional()
  description?: string;

  @IsString()
  @IsOptional()
  shortDescription?: string;

  @IsNumber()
  @Type(() => Number)
  @Min(0)
  price: number;

  @IsNumber()
  @Type(() => Number)
  @IsOptional()
  @Min(0)
  oldPrice?: number;

  @IsNumber()
  @Type(() => Number)
  @IsOptional()
  discount?: number;

  @IsUUID()
  @IsNotEmpty()
  categoryId: string;

  @IsString()
  @IsOptional()
  brand?: string;

  @IsString()
  @IsOptional()
  sku?: string;

  @IsArray()
  @IsString({ each: true })
  @IsOptional()
  images?: string[];

  @IsOptional()
  attributes?: any;

  @IsArray()
  @IsString({ each: true })
  @IsOptional()
  tags?: string[];

  @IsBoolean()
  @IsOptional()
  isActive?: boolean;

  @IsBoolean()
  @IsOptional()
  inStock?: boolean;

  @IsNumber()
  @Type(() => Number)
  @IsOptional()
  @Min(0)
  stockQuantity?: number;

  @IsBoolean()
  @IsOptional()
  featured?: boolean;

  @IsBoolean()
  @IsOptional()
  popular?: boolean;

  @IsNumber()
  @Type(() => Number)
  @IsOptional()
  @Min(0)
  weight?: number;

  @IsOptional()
  dimensions?: any;
}


