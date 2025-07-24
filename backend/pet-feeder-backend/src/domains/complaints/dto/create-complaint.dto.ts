export class CreateComplaintDto {
  orderId: number;
  complaint_type: string;
  description: string;
  images: string[];
}
