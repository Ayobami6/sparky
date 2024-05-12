import { IsNotEmpty, IsOptional, IsString } from 'class-validator';
import { Banner, Category, FaqItem } from '../layout-types';

export class CreateLayoutDto {
  @IsNotEmpty()
  @IsString()
  type: string;

  @IsOptional()
  faq: FaqItem[] = [];

  @IsOptional()
  categories: Category[] = [];

  @IsOptional()
  banner: Banner;
}
