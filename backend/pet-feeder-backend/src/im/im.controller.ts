import {
  Controller,
  Body,
  Post,
  Get,
  Query,
  UseGuards,
  Req,
} from '@nestjs/common';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { ImService } from './im.service';
import { SendMessageDto } from './dto/send-message.dto';

@Controller('im')
@UseGuards(JwtAuthGuard)
export class ImController {
  constructor(private readonly imService: ImService) {}

  @Post('send')
  send(@Req() req, @Body() dto: SendMessageDto) {
    return this.imService.send(req.user.id, dto);
  }

  @Get('history')
  history(@Query('orderId') orderId: number, @Query('before') before?: number) {
    return this.imService.history(
      Number(orderId),
      20,
      before ? Number(before) : undefined,
    );
  }

  @Post('emergency')
  emergency(@Req() req, @Body('orderId') orderId?: number) {
    return { message: 'recorded' };
  }
}
