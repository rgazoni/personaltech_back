import { IsDate, IsNotEmpty, IsString } from "class-validator";

export class UpdateTraineeDto {
  @IsString()
  @IsNotEmpty()
  readonly email: string;

  @IsString()
  @IsNotEmpty()
  readonly full_name: string;

  @IsDate()
  @IsNotEmpty()
  readonly birthdate: Date;

  @IsString()
  @IsNotEmpty()
  readonly city: string;

  @IsString()
  @IsNotEmpty()
  readonly state: string;
}
