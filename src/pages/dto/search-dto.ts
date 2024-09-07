import { IsOptional } from 'class-validator';

export class SearchDto {
  @IsOptional()
  expertises?: string[];
  @IsOptional()
  name?: string;
  @IsOptional()
  city?: string;
  @IsOptional()
  state?: string;
  @IsOptional()
  gender?: string;
  @IsOptional()
  rate?: string;
}
