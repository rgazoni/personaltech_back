import { IsDate, IsNotEmpty, IsString } from "class-validator";

export class CreateTraineeDto {
  @IsString()
  @IsNotEmpty()
  readonly email: string;

  @IsString()
  @IsNotEmpty()
  readonly full_name: string;

  @IsString()
  @IsNotEmpty()
  readonly password: string;

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
