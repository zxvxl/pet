export class CreateFeedbackDto {
  orderId: number;
  type: string[];
  description: string;
  images: string[];
  contact?: string;
}
