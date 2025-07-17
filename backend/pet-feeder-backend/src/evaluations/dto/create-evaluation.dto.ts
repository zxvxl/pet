export class CreateEvaluationDto {
  orderId: number;
  star: number;
  tags: string[];
  content?: string;
  images?: string[];
}
