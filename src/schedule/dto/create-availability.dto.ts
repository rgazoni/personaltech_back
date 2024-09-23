import { ArrayNotEmpty, IsArray, IsInt, IsString } from "class-validator";

export class CreateAvailabilityDto {
  @IsString()
  personal_id: string;
  @IsString()
  startTime: string;
  @IsString()
  endTime: string;
  @IsArray()
  @ArrayNotEmpty()
  @IsInt({ each: true })
  daysOfWeek: number[];
}
