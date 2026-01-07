import { IsString, IsNotEmpty, IsOptional, IsBoolean, IsUUID, IsEnum, IsInt, Min } from 'class-validator';
import { CategoryType } from '@prisma/client';

export class CreateCategoryDto {
  @IsString()
  @IsNotEmpty()
  name: string;

  @IsString()
  @IsOptional()
  nameUk?: string;

  @IsString()
  @IsOptional()
  nameRu?: string;

  @IsString()
  @IsOptional()
  nameEn?: string;

  @IsString()
  @IsOptional()
  slug?: string;

  @IsString()
  @IsOptional()
  description?: string;

  @IsString()
  @IsOptional()
  descriptionUk?: string;

  @IsString()
  @IsOptional()
  descriptionRu?: string;

  @IsString()
  @IsOptional()
  descriptionEn?: string;

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
  metaTitleUk?: string;

  @IsString()
  @IsOptional()
  metaTitleRu?: string;

  @IsString()
  @IsOptional()
  metaTitleEn?: string;

  @IsString()
  @IsOptional()
  metaDescription?: string;

  @IsString()
  @IsOptional()
  metaDescriptionUk?: string;

  @IsString()
  @IsOptional()
  metaDescriptionRu?: string;

  @IsString()
  @IsOptional()
  metaDescriptionEn?: string;

  @IsString()
  @IsOptional()
  metaKeywords?: string;

  @IsOptional()
  filters?: any;
}


