import { IsNotEmpty, IsString } from "class-validator";

export class CreateBookingDto {
  @IsString()
  @IsNotEmpty()
  personal_id: string;

  @IsString()
  @IsNotEmpty()
  trainee_id: string;

  @IsString()
  @IsNotEmpty()
  startDatetime: string;
}

