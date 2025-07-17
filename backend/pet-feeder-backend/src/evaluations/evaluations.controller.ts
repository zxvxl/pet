import { Body, Controller, Post, UseGuards, Req } from '@nestjs/common';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { Roles } from '../common/decorators/roles.decorator';
import { RolesGuard } from '../common/guards/roles.guard';
import { EvaluationsService } from './evaluations.service';
import { CreateEvaluationDto } from './dto/create-evaluation.dto';
import { CreateAnonymousEvaluationDto } from './dto/create-anonymous-evaluation.dto';

@Controller('evaluation')
@UseGuards(JwtAuthGuard, RolesGuard)
export class EvaluationsController {
  constructor(private readonly service: EvaluationsService) {}

  @Post()
  @Roles('user')
  create(@Req() req, @Body() dto: CreateEvaluationDto) {
    return this.service.createByUser(req.user.id, dto);
  }

  @Post('anonymous')
  @Roles('feeder')
  createAnonymous(@Req() req, @Body() dto: CreateAnonymousEvaluationDto) {
    return this.service.createAnonymous(req.user.id, dto);
  }
}
