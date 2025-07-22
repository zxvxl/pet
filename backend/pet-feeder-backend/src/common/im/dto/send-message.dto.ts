import { MessageType } from '../message-type.enum';

export class SendMessageDto {
  type: MessageType;
  receiverId: number;
  orderId?: number;
  payload: any;
}
