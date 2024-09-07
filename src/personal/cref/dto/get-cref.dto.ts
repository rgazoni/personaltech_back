import { IsString } from "class-validator";

export class GetCrefDto {
  @IsString()
  readonly cref: string;
}
