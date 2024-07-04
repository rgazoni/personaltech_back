import { IsOptional, IsString } from "class-validator";

export class UrlDto {
  @IsString()
  @IsOptional()
  readonly url: string;
}
