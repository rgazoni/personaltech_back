import { IsIn, IsString, Matches } from 'class-validator';
import {
  TypesCref,
  TypesCrefPossibilities,
} from '../types/validate-cref.types';

export class ValidateCrefDto {
  @IsString()
  @Matches(/^\d{6}-(G|PJ)\/[A-Z]{2}$/)
  readonly cref: string;

  @IsString()
  @IsIn(TypesCrefPossibilities)
  readonly type: TypesCref;

  @IsString()
  readonly user_id: string;
}
