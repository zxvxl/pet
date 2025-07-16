import { Controller, Get, Param, Post, Body } from '@nestjs/common';
import { TrackingService } from './tracking.service';
import { UpdateLocationDto } from './dto/update-location.dto';

@Controller('service')
export class TrackingController {
  constructor(private readonly service: TrackingService) {}

  @Get(':id/status')
  getStatus(@Param('id') id: string) {
    return this.service.getStatus(+id);
  }

  @Post(':id/location')
  reportLocation(@Param('id') id: string, @Body() dto: UpdateLocationDto) {
    return this.service.reportLocation(+id, dto);
  }
}
