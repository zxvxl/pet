import {
  WebSocketGateway,
  WebSocketServer,
  OnGatewayConnection,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { ImService } from './im.service';
import { Message } from './entities/message.entity';

@WebSocketGateway({ namespace: 'im', cors: true })
export class ImGateway implements OnGatewayConnection {
  @WebSocketServer()
  server: Server;

  constructor(private readonly imService: ImService) {}

  handleConnection(client: Socket) {
    const { orderId } = client.handshake.query;
    if (orderId) {
      client.join(String(orderId));
    }
  }

  async handleMessage(orderId: number, message: Message) {
    this.server.to(String(orderId)).emit('message', message);
  }
}
