import { IsNotEmpty, IsOptional, IsString } from "class-validator";

export class CreateVisitorDto {
  @IsString()
  @IsOptional()
  readonly visitor_id: string;
  @IsString()
  @IsOptional()
  readonly visitor_type: string;
  @IsString()
  @IsNotEmpty()
  readonly page_id: string;
  @IsString()
  @IsNotEmpty()
  readonly type: string;
}
