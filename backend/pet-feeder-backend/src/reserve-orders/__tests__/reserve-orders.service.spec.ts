import { Test } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ReserveOrdersService } from '../reserve-orders.service';
import { OrderEntity } from '../entities/order.entity';
import { OrderServiceItem } from '../entities/order-service-item.entity';
import { ServiceType } from '../../service-types/entities/service-type.entity';
import { Pet } from '../../pets/entities/pet.entity';

const createRepo = () => ({ create: jest.fn(), save: jest.fn(), findOne: jest.fn(), find: jest.fn() });

describe('ReserveOrdersService create', () => {
  let service: ReserveOrdersService;
  const orderRepo = createRepo() as unknown as Repository<OrderEntity>;
  const itemRepo = createRepo() as unknown as Repository<OrderServiceItem>;
  const serviceRepo = createRepo() as unknown as Repository<ServiceType>;
  const petRepo = createRepo() as unknown as Repository<Pet>;

  beforeEach(async () => {
    const module = await Test.createTestingModule({
      providers: [
        ReserveOrdersService,
        { provide: getRepositoryToken(OrderEntity), useValue: orderRepo },
        { provide: getRepositoryToken(OrderServiceItem), useValue: itemRepo },
        { provide: getRepositoryToken(ServiceType), useValue: serviceRepo },
        { provide: getRepositoryToken(Pet), useValue: petRepo },
      ],
    }).compile();
    service = module.get(ReserveOrdersService);
    jest.clearAllMocks();
  });

  it('calculates total', async () => {
    serviceRepo.findOne = jest.fn().mockResolvedValue({ id: 1, name: 'wash', price: 10 });
    petRepo.findOne = jest.fn().mockResolvedValue({ id: 2, user: { id: 1 } });
    orderRepo.manager = {
      transaction: async (cb: any) => cb({
        getRepository: () => orderRepo,
      }),
    } as any;
    orderRepo.create = jest.fn().mockReturnValue({});
    orderRepo.save = jest.fn().mockResolvedValue({ id: 1, totalAmount: 10 });

    const res = await service.create(
      {
        reserveTime: new Date(Date.now() + 1000).toISOString() as any,
        address: 'a',
        items: [{ serviceId: 1, petId: 2 }],
      },
      1,
    );
    expect(res.totalAmount).toBe(10);
  });
});
