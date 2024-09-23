import { IsNotEmpty, IsString } from "class-validator";

export class CreateClassDto {

  @IsString()
  @IsNotEmpty()
  trainee_id: string;

  @IsString()
  @IsNotEmpty()
  personal_id: string;

}
