import { IsNotEmpty, IsString } from 'class-validator';

export class UpdatePageDto {
  @IsString()
  @IsNotEmpty()
  readonly token: string;

  @IsString()
  @IsNotEmpty()
  readonly about_you: string;

  @IsString()
  @IsNotEmpty()
  readonly background_color: string;

  @IsString()
  @IsNotEmpty()
  readonly profession: string;

  @IsString()
  @IsNotEmpty()
  readonly page_name: string;

  @IsString()
  @IsNotEmpty()
  readonly service_value: string;

  @IsString()
  readonly whatsapp: string;

  @IsString()
  readonly instagram: string;

  @IsNotEmpty()
  readonly is_published: boolean;

  @IsString()
  readonly presentation_video: string;

  @IsNotEmpty()
  @IsString({ each: true })
  readonly expertises: string[];

  @IsString()
  readonly tiktok: string;

  @IsString()
  readonly city: string;

  @IsString()
  readonly state: string;
}
