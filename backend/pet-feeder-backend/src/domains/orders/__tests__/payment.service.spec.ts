import { Test } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { OrdersService } from '../orders.service';
import { Order } from '../entities/order.entity';
import { Feeder } from '../../feeders/entities/feeder.entity';
import { WxPayService } from '../wx-pay.service';
import { PayOrderDto } from '../dto/pay-order.dto';

describe('OrdersService payment', () => {
  let service: OrdersService;
  const orderRepo = { findOne: jest.fn(), update: jest.fn() } as unknown as Repository<Order>;
  const feederRepo = {} as Repository<Feeder>;
  const wxPay: any = { createJsapiTransaction: jest.fn(), handleNotify: jest.fn() };

  beforeEach(async () => {
    const module = await Test.createTestingModule({
      providers: [
        OrdersService,
        { provide: getRepositoryToken(Order), useValue: orderRepo },
        { provide: getRepositoryToken(Feeder), useValue: feederRepo },
        { provide: WxPayService, useValue: wxPay },
      ],
    }).compile();
    service = module.get(OrdersService);
    jest.clearAllMocks();
  });

  it('creates prepay', async () => {
    orderRepo.findOne = jest.fn().mockResolvedValue({ id: 1 });
    wxPay.createJsapiTransaction.mockResolvedValue({ prepay_id: 'p' });

    const res = await service.createPrepay({ orderId: '1', openid: 'o' });
    expect(wxPay.createJsapiTransaction).toBeCalledWith('o', 1, '1');
    expect(res).toEqual({ prepay_id: 'p' });
  });

  it('updates status on notify', async () => {
    wxPay.handleNotify.mockResolvedValue({ out_trade_no: '2' });
    orderRepo.update = jest.fn().mockResolvedValue({});
    await service.handlePayNotify({}, {});
    expect(orderRepo.update).toBeCalledWith(2, { status: 'paid' });
  });
});
