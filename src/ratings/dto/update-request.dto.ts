import { RequestStatus } from "@prisma/client";
import { IsNotEmpty, IsString } from "class-validator";

export class UpdateRequestDto {
  @IsString()
  @IsNotEmpty()
  readonly trainee_id: string;

  @IsString()
  @IsNotEmpty()
  readonly personal_id: string;

  @IsString()
  @IsNotEmpty()
  readonly request: RequestStatus;
}
