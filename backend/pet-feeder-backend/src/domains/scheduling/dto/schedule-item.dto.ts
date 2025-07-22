import { IsInt, IsOptional, IsString, Max, Min } from 'class-validator';

/**
 * Single schedule time range DTO.
 */
export class ScheduleItemDto {
  @IsInt()
  @Min(0)
  @Max(6)
  weekday: number;

  @IsString()
  startTime: string;

  @IsString()
  endTime: string;

  @IsOptional()
  @IsInt()
  enabled?: number;
}
