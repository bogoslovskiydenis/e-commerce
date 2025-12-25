import { IsString, IsNotEmpty, IsOptional, IsBoolean, IsUUID, IsEnum, IsInt, Min } from 'class-validator';
import { CategoryType } from '@prisma/client';

export class CreateCategoryDto {
  @IsString()
  @IsNotEmpty()
  name: string;

  @IsString()
  @IsOptional()
  slug?: string;

  @IsString()
  @IsOptional()
  description?: string;

  @IsEnum(CategoryType)
  @IsOptional()
  type?: CategoryType;

  @IsUUID()
  @IsOptional()
  parentId?: string;

  @IsString()
  @IsOptional()
  imageUrl?: string;

  @IsString()
  @IsOptional()
  bannerUrl?: string;

  @IsBoolean()
  @IsOptional()
  isActive?: boolean;

  @IsBoolean()
  @IsOptional()
  showInNavigation?: boolean;

  @IsBoolean()
  @IsOptional()
  showOnHomepage?: boolean;

  @IsInt()
  @IsOptional()
  @Min(0)
  sortOrder?: number;

  @IsString()
  @IsOptional()
  metaTitle?: string;

  @IsString()
  @IsOptional()
  metaDescription?: string;

  @IsString()
  @IsOptional()
  metaKeywords?: string;

  @IsOptional()
  filters?: any;
}


