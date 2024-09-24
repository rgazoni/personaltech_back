import { RequestStatus } from "@prisma/client";
import { IsDate, IsNotEmpty, IsString } from "class-validator";

export class UpdateRatingDto {
  @IsString()
  @IsNotEmpty()
  readonly id: string;

  @IsNotEmpty()
  readonly rating: number;

  @IsString()
  @IsNotEmpty()
  readonly request: RequestStatus;

  @IsString()
  readonly comment: string;

  @IsDate()
  @IsNotEmpty()
  readonly userResponseAt: Date;
}
