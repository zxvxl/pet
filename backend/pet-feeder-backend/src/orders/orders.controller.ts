// 👉 模块：订单管理 orders
// 控制订单的创建、查询与支付等接口
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
/**
 * 订单接口控制器
 * 提供下单、支付等 REST 接口
 */
export class OrdersController {
  constructor(private readonly ordersService: OrdersService) {}

  @Post()
  @Roles('user', 'operator', 'super')
  /**
   * 创建订单
   * 请求方式：POST
   * 请求路径：/orders
   */
  create(@Req() req, @Body() createOrderDto: CreateOrderDto) {
    if (!createOrderDto.userId) {
      createOrderDto.userId = req.user.userId;
    }
    return this.ordersService.create(createOrderDto);
  }

  @Get()
  @Roles('user')
  /**
   * 获取当前用户的订单列表
   * 请求方式：GET
   * 请求路径：/orders
   */
  findMine(@Req() req) {
    return this.ordersService.findByUser(req.user.userId);
  }

  @Get('all')
  @Roles('operator', 'super')
  /**
   * 获取全部订单
   * 请求方式：GET
   * 请求路径：/orders/all
   */
  findAll() {
    return this.ordersService.findAll();
  }

  @Get(':id')
  @Roles('user', 'operator', 'super')
  /**
   * 根据ID获取订单详情
   * 请求方式：GET
   * 请求路径：/orders/:id
   */
  findOne(@Param('id') id: string) {
    return this.ordersService.findOne(+id);
  }

  @Patch(':id')
  @Roles('user', 'operator', 'super')
  /**
   * 更新订单
   * 请求方式：PATCH
   * 请求路径：/orders/:id
   */
  update(@Param('id') id: string, @Body() updateOrderDto: UpdateOrderDto) {
    return this.ordersService.update(+id, updateOrderDto);
  }

  @Post('pay')
  @Roles('user')
  /**
   * 创建支付预订单
   * 请求方式：POST
   * 请求路径：/orders/pay
   */
  pay(@Body() dto: PayOrderDto) {
    return this.ordersService.createPrepay(dto);
  }

  @Post('pay/notify')
  @UseGuards()
  @Header('Content-Type', 'text/xml')
  /**
   * 支付结果通知回调
   * 请求方式：POST
   * 请求路径：/orders/pay/notify
   */
  async payNotify(@Req() req, @Headers() headers: Record<string, any>) {
    await this.ordersService.handlePayNotify(req.body, headers);
    return '<xml><return_code>SUCCESS</return_code></xml>';
  }

  @Delete(':id')
  @Roles('user', 'operator', 'super')
  /**
   * 删除订单
   * 请求方式：DELETE
   * 请求路径：/orders/:id
   */
  remove(@Param('id') id: string) {
    return this.ordersService.remove(+id);
  }
}
