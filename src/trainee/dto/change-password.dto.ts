import { IsNotEmpty, IsString } from "class-validator";

export class ChangePasswordDto {
  @IsString()
  @IsNotEmpty()
  trainee_id: string;

  @IsString()
  old_password: string;

  @IsString()
  new_password: string;
}
