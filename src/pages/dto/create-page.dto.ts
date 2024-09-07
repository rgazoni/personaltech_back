import { IsNotEmpty, IsString } from 'class-validator';

export class CreatePageDto {
  @IsString()
  @IsNotEmpty()
  readonly personal_id: string;

  @IsString()
  @IsNotEmpty()
  //TODO: Add validation for URL, without special characters
  readonly url: string;

  @IsString()
  @IsNotEmpty()
  readonly page_name: string;
}
