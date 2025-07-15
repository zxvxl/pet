import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { RolesGuard } from '../common/guards/roles.guard';
import { Roles } from '../common/decorators/roles.decorator';
import { PetsService } from './pets.service';
import { CreatePetDto } from './dto/create-pet.dto';
import { UpdatePetDto } from './dto/update-pet.dto';

@Controller('pets')
@UseGuards(JwtAuthGuard, RolesGuard)
export class PetsController {
  constructor(private readonly petsService: PetsService) {}

  @Post()
  @Roles('user', 'admin')
  create(@Body() createPetDto: CreatePetDto) {
    return this.petsService.create(createPetDto);
  }

  @Get()
  @Roles('admin')
  findAll() {
    return this.petsService.findAll();
  }

  @Get(':id')
  @Roles('user', 'admin')
  findOne(@Param('id') id: string) {
    return this.petsService.findOne(+id);
  }

  @Patch(':id')
  @Roles('user', 'admin')
  update(@Param('id') id: string, @Body() updatePetDto: UpdatePetDto) {
    return this.petsService.update(+id, updatePetDto);
  }

  @Delete(':id')
  @Roles('user', 'admin')
  remove(@Param('id') id: string) {
    return this.petsService.remove(+id);
  }
}
