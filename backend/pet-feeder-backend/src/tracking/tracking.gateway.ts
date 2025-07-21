import { WebSocketGateway, WebSocketServer, OnGatewayConnection } from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { ServiceStatus } from '../service-orders/status.enum';
import { FeederLocation } from './entities/feeder-location.entity';

// The namespace isolates service order tracking events from other gateways
@WebSocketGateway({ namespace: 'service', cors: true })
export class TrackingGateway implements OnGatewayConnection {
  @WebSocketServer()
  server: Server;

  handleConnection(client: Socket) {
    const { orderId } = client.handshake.query;
    if (orderId) {
      client.join(String(orderId));
    }
  }

  notifyStatus(orderId: number, status: ServiceStatus) {
    this.server.to(String(orderId)).emit('status', { orderId, status });
  }

  notifyLocation(orderId: number, location: FeederLocation) {
    this.server
      .to(String(orderId))
      .emit('location', {
        orderId,
        lat: location.lat,
        lng: location.lng,
        time: location.createTime,
      });
  }
}
