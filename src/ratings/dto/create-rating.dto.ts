import { IsNotEmpty, IsString } from "class-validator";

export class CreateRatingDto {

  @IsString()
  @IsNotEmpty()
  trainee_id: string;

  @IsString()
  @IsNotEmpty()
  personal_id: string;

}
