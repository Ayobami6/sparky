import { IsNotEmpty, IsOptional, IsString } from 'class-validator';
import { Banner, Category, FaqItem } from '../layout-types';
import { ApiProperty } from '@nestjs/swagger';

export class CreateLayoutDto {
  @IsNotEmpty()
  @IsString()
  @ApiProperty({
    type: 'string',
  })
  type: string;

  @IsOptional()
  @ApiProperty({
    type: 'array',
    items: {
      type: 'object',
      properties: { question: { type: 'string' }, answer: { type: 'string' } },
    },
    example: [
      { question: 'What is Sparky?', answer: 'Sparky is a virtual pet...' },
      {
        question: 'How can I adopt Sparky?',
        answer: 'Visit our adoption center...',
      },
    ],
  })
  faq: FaqItem[] = [];

  @IsOptional()
  @ApiProperty({
    type: 'array',
    items: { type: 'object', properties: { title: { type: 'string' } } },
    example: [{ title: 'Pets' }, { title: 'Adoption' }],
  })
  categories: Category[] = [];

  @IsOptional()
  @ApiProperty({
    type: 'object',
    properties: {
      title: { type: 'string' },
      subtitle: { type: 'string' },
      image: {
        type: 'object',
        properties: { public_id: { type: 'string' }, url: { type: 'string' } },
      },
    },
    example: {
      title: 'Welcome to Sparky',
      subtitle: 'A virtual pet for everyone',
      image: { public_id: 'image_id', url: 'https://example.com/image.jpg' },
    },
  })
  banner: Banner;
}
