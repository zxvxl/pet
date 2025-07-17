import { Test } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ServiceOrdersService } from '../service-orders.service';
import { ServiceOrder } from '../entities/service-order.entity';
import { TrackingGateway } from '../../tracking/tracking.gateway';
import { WxTemplateService } from '../../tracking/wx-template.service';
import { ServiceStatus } from '../status.enum';

describe('ServiceOrdersService status flow', () => {
  let service: ServiceOrdersService;
  const repo: any = {
    update: jest.fn(),
    findOne: jest.fn(),
  };
  const gateway: any = { notifyStatus: jest.fn() };
  const wx: any = { send: jest.fn(), logger: { error: jest.fn() } };

  beforeEach(async () => {
    const module = await Test.createTestingModule({
      providers: [
        ServiceOrdersService,
        { provide: getRepositoryToken(ServiceOrder), useValue: repo },
        { provide: TrackingGateway, useValue: gateway },
        { provide: WxTemplateService, useValue: wx },
      ],
    }).compile();
    service = module.get(ServiceOrdersService);
    jest.clearAllMocks();
    repo.findOne.mockResolvedValue({ id: 1, order: { id: 2, user: { openid: 'o' } } });
    repo.update.mockResolvedValue({ affected: 1 });
  });

  it('should notify status and send template on sign in', async () => {
    await service.signIn(1, { lat: 1, lng: 2 });
    expect(gateway.notifyStatus).toHaveBeenCalledWith(1, ServiceStatus.SIGNED_IN);
    expect(repo.update).toHaveBeenCalled();
    expect(wx.send).toHaveBeenCalledWith('o', 'signin_tpl', { status: ServiceStatus.SIGNED_IN }, '/pages/orders/detail?id=2');
  });

  it('should notify status on complete', async () => {
    await service.complete(1, { description: 'done', images: [] });
    expect(gateway.notifyStatus).toHaveBeenCalledWith(1, ServiceStatus.COMPLETED);
    expect(wx.send).toHaveBeenCalledWith('o', 'complete_tpl', { status: ServiceStatus.COMPLETED }, '/pages/orders/detail?id=2');
  });
});
