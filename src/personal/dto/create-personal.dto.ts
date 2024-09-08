import {
  IsDate,
  IsEmail,
  IsIn,
  IsNotEmpty,
  IsString,
  Matches,
} from 'class-validator';
import {
  TypesCref,
  TypesCrefPossibilities,
} from '../cref/types/validate-cref.types';

export class CreatePersonalDto {
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
  @IsDate()
  readonly birthdate: Date;
  @IsString()
  @IsNotEmpty()
  readonly state: string;
  @IsString()
  @IsNotEmpty()
  readonly city: string;
  @IsString()
  @IsNotEmpty()
  readonly gender: string;
}
