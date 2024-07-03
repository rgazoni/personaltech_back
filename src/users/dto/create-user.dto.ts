import { IsEmail, IsNotEmpty, IsString, Length } from 'class-validator';

export class CreateUserDto {
  @IsEmail()
  @IsNotEmpty()
  readonly email: string;
  @IsString()
  @IsNotEmpty()
  readonly password: string;
  @IsString()
  @IsNotEmpty()
  @Length(11, 11)
  readonly cref: string;
  @IsString()
  @IsNotEmpty()
  readonly name: string;
}
