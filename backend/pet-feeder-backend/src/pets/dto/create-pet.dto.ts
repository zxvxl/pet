export class CreatePetDto {
  userId: number;
  name: string;
  species: string;
  age?: number;
  notes?: string;
}
