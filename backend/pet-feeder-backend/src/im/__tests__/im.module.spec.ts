import { Test } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { ImService } from '../im.service';
import { ImGateway } from '../im.gateway';
import { Message } from '../entities/message.entity';
import { MessageType } from '../message-type.enum';

const repo = {
  create: jest.fn(),
  save: jest.fn(),
  createQueryBuilder: jest.fn(),
};

const mockServer = { to: jest.fn().mockReturnThis(), emit: jest.fn() } as any;

const buildQb = () => ({
  where: jest.fn().mockReturnThis(),
  orderBy: jest.fn().mockReturnThis(),
  take: jest.fn().mockReturnThis(),
  andWhere: jest.fn().mockReturnThis(),
  getMany: jest.fn(),
});

describe('IM module', () => {
  let service: ImService;
  let gateway: ImGateway;

  beforeEach(async () => {
    const module = await Test.createTestingModule({
      providers: [
        ImService,
        ImGateway,
        { provide: getRepositoryToken(Message), useValue: repo },
      ],
    }).compile();
    service = module.get(ImService);
    gateway = module.get(ImGateway);
    (gateway as any).server = mockServer;
    jest.clearAllMocks();
  });

  it('should join room on connection', () => {
    const socket: any = {
      handshake: { query: { orderId: 5 } },
      join: jest.fn(),
    };
    gateway.handleConnection(socket);
    expect(socket.join).toHaveBeenCalledWith('5');
  });

  const dtoBase = { receiverId: 2, orderId: 5, payload: {} };
  const types = [
    MessageType.TEXT,
    MessageType.IMAGE,
    MessageType.VOICE,
    MessageType.LOCATION,
  ];

  it.each(types)('should store %s message', async (type) => {
    repo.create.mockImplementation((d: any) => d as Message);
    repo.save.mockResolvedValue({ id: 1, senderId: 1, type });
    const dto = { ...dtoBase, type } as any;
    const msg = await service.send(1, dto);
    expect(repo.save).toHaveBeenCalledWith(expect.objectContaining({ type }));
    await gateway.handleMessage(5, msg);
    expect(mockServer.emit).toHaveBeenCalledWith('message', msg);
  });

  it('should query history', async () => {
    const qb = buildQb();
    repo.createQueryBuilder.mockReturnValue(qb);
    qb.getMany.mockResolvedValue([]);
    await service.history(5);
    expect(qb.where).toHaveBeenCalled();
    expect(qb.getMany).toHaveBeenCalled();
  });
});
