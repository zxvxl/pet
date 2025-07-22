export class CreateServiceTypeDto {
  name: string;
  price: number;
  memberPrice: number;
  description?: string;
  supportedSpecies?: string;
  coverUrl?: string;
}
