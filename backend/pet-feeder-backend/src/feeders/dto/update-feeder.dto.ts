import { PartialType } from '@nestjs/mapped-types';
import { CreateFeederDto } from './create-feeder.dto';

export class UpdateFeederDto extends PartialType(CreateFeederDto) {}
