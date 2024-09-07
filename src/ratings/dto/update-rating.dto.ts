import { RequestStatus } from "@prisma/client";
import { IsDate, IsNotEmpty, IsString } from "class-validator";

export class UpdateRatingDto {
  @IsString()
  @IsNotEmpty()
  readonly trainee_id: string;

  @IsString()
  @IsNotEmpty()
  readonly personal_id: string;

  @IsNotEmpty()
  readonly rating: number;

  @IsString()
  @IsNotEmpty()
  readonly request: RequestStatus;

  @IsString()
  @IsNotEmpty()
  readonly comment: string;

  @IsDate()
  @IsNotEmpty()
  readonly userResponseAt: Date;
}
