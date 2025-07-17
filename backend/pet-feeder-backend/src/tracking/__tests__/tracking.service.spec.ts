import { TrackingService } from '../tracking.service';
import { TrackingGateway } from '../tracking.gateway';
import { Repository } from 'typeorm';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Test } from '@nestjs/testing';
import { ServiceOrder } from '../../service-orders/entities/service-order.entity';
import { FeederLocation } from '../entities/feeder-location.entity';

describe('TrackingService', () => {
  let service: TrackingService;
  const orders: any = { findOne: jest.fn() };
  const locations: any = { create: jest.fn(), save: jest.fn() };
  const gateway: any = { notifyLocation: jest.fn() };

  beforeEach(async () => {
    const module = await Test.createTestingModule({
      providers: [
        TrackingService,
        { provide: getRepositoryToken(ServiceOrder), useValue: orders },
        { provide: getRepositoryToken(FeederLocation), useValue: locations },
        { provide: TrackingGateway, useValue: gateway },
      ],
    }).compile();
    service = module.get(TrackingService);
    jest.clearAllMocks();
    locations.create.mockImplementation((d) => d);
    locations.save.mockImplementation((d) => Promise.resolve({ id: 1, ...d, createTime: new Date() }));
  });

  it('should save location and notify gateway', async () => {
    await service.reportLocation(5, { lat: 1, lng: 2 });
    expect(locations.create).toHaveBeenCalled();
    expect(locations.save).toHaveBeenCalled();
    expect(gateway.notifyLocation).toHaveBeenCalledWith(5, expect.objectContaining({ lat: 1, lng: 2 }));
  });
});
