import { IsEmail, IsIn, IsNotEmpty, IsString, Length, Matches } from 'class-validator';
import { TypesCref, TypesCrefPossibilities } from '../cref/types/validate-cref.types';

export class CreateUserDto {
  @IsEmail()
  @IsNotEmpty()
  readonly email: string;
  @IsString()
  @IsNotEmpty()
  readonly password: string;
  @IsString()
  @Matches(/^\d{6}-(G|PJ)\/[A-Z]{2}$/)
  readonly cref: string;
  @IsString()
  @IsIn(TypesCrefPossibilities)
  readonly type: TypesCref;
}
