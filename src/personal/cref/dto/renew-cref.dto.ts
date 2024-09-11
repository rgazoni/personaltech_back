import { IsString } from "class-validator";

export class RenewCrefDto {
  @IsString()
  readonly cref: string;
  @IsString()
  readonly personal_id: string;
  @IsString()
  readonly type: string;
}
