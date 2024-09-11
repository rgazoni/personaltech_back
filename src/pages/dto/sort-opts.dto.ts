import { IsNotEmpty, IsString } from "class-validator";

export class SortOptsDto {
  @IsString()
  @IsNotEmpty()
  personal_id: string;

  @IsString()
  @IsNotEmpty()
  comments_sort: 'time_desc' | 'rate_desc';
}
