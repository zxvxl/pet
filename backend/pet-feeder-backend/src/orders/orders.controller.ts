import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Req,
  UseGuards,
  Headers,
  Header,
} from '@nestjs/common';
import { OrdersService } from './orders.service';
import { CreateOrderDto } from './dto/create-order.dto';
import { UpdateOrderDto } from './dto/update-order.dto';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { RolesGuard } from '../common/guards/roles.guard';
import { Roles } from '../common/decorators/roles.decorator';
import { PayOrderDto } from './dto/pay-order.dto';

@Controller('orders')
@UseGuards(JwtAuthGuard, RolesGuard)
export class OrdersController {
  constructor(private readonly ordersService: OrdersService) {}

  @Post()
  @Roles('user', 'operator', 'super')
  create(@Req() req, @Body() createOrderDto: CreateOrderDto) {
    if (!createOrderDto.userId) {
      createOrderDto.userId = req.user.userId;
    }
    return this.ordersService.create(createOrderDto);
  }

  @Get()
  @Roles('user')
  findMine(@Req() req) {
    return this.ordersService.findByUser(req.user.userId);
  }

  @Get('all')
  @Roles('operator', 'super')
  findAll() {
    return this.ordersService.findAll();
  }

  @Get(':id')
  @Roles('user', 'operator', 'super')
  findOne(@Param('id') id: string) {
    return this.ordersService.findOne(+id);
  }

  @Patch(':id')
  @Roles('user', 'operator', 'super')
  update(@Param('id') id: string, @Body() updateOrderDto: UpdateOrderDto) {
    return this.ordersService.update(+id, updateOrderDto);
  }

  @Post('pay')
  @Roles('user')
  pay(@Body() dto: PayOrderDto) {
    return this.ordersService.createPrepay(dto);
  }

  @Post('pay/notify')
  @UseGuards()
  @Header('Content-Type', 'text/xml')
  async payNotify(@Req() req, @Headers() headers: Record<string, any>) {
    await this.ordersService.handlePayNotify(req.body, headers);
    return '<xml><return_code>SUCCESS</return_code></xml>';
  }

  @Delete(':id')
  @Roles('user', 'operator', 'super')
  remove(@Param('id') id: string) {
    return this.ordersService.remove(+id);
  }
}
