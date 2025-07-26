// backend/pet-feeder-backend/src/domains/feeders/feeders.controller.ts
// 喂养员管理接口控制器

import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Body,
  Param,
  Query,
  Req,
  UseGuards,
} from '@nestjs/common';
import { FeedersService } from './feeders.service';
import { AdminJwtGuard } from '../admin/admin-jwt.guard';
import { RolesGuard } from '../../common/guards/roles.guard';
import { Roles } from '../../common/decorators/roles.decorator';
import { CreateFeederDto } from './dto/create-feeder.dto';
import { UpdateFeederDto } from './dto/update-feeder.dto';
import { FeederListDto } from './dto/feeder-list.dto';
import { AuditFeederDto } from './dto/audit-feeder.dto';
import { BatchUpdateDto } from './dto/batch-update.dto';
// 若仍找不到模块，请检查路径是否正确，或确认 dto/batch-update.dto 文件是否存在并包含 BatchUpdateDto 定义

@Controller('admin/feeders')
@UseGuards(AdminJwtGuard, RolesGuard)
export class FeedersController {
  constructor(private readonly feedersService: FeedersService) {}

  /**
   * 获取喂养员列表
   * GET /admin/feeders
   */
  @Get()
  @Roles('super', 'feeder_manager')
  async getFeederList(@Query() query: FeederListDto) {
    return this.feedersService.findAll(query);
  }

  /**
   * 获取喂养员详情
   * GET /admin/feeders/:id
   */
  @Get(':id')
  @Roles('super', 'feeder_manager')
  async getFeederDetail(@Param('id') id: string) {
    return this.feedersService.findOne(+id);
  }

  /**
   * 创建喂养员
   * POST /admin/feeders
   */
  @Post()
  @Roles('super', 'feeder_manager')
  async createFeeder(@Body() createFeederDto: CreateFeederDto, @Req() req) {
    return this.feedersService.create(createFeederDto, req.user.id);
  }

  /**
   * 更新喂养员信息
   * PUT /admin/feeders/:id
   */
  @Put(':id')
  @Roles('super', 'feeder_manager')
  async updateFeeder(
    @Param('id') id: string,
    @Body() updateFeederDto: UpdateFeederDto,
    @Req() req,
  ) {
    return this.feedersService.update(+id, updateFeederDto, req.user.id);
  }

  /**
   * 删除喂养员
   * DELETE /admin/feeders/:id
   */
  @Delete(':id')
  @Roles('super')
  async deleteFeeder(@Param('id') id: string, @Req() req) {
    return this.feedersService.remove(+id, req.user.id);
  }

  /**
   * 更新喂养员状态
   * PUT /admin/feeders/:id/status
   */
  @Put(':id/status')
  @Roles('super', 'feeder_manager')
  async updateFeederStatus(
    @Param('id') id: string,
    @Body() body: { status: number },
    @Req() req,
  ) {
    return this.feedersService.updateStatus(+id, body.status, req.user.id);
  }

  /**
   * 审核喂养员
   * POST /admin/feeders/:id/audit
   */
  @Post(':id/audit')
  @Roles('super', 'feeder_manager')
  async auditFeeder(
    @Param('id') id: string,
    @Body() auditDto: AuditFeederDto,
    @Req() req,
  ) {
    return this.feedersService.audit(+id, auditDto, req.user.id);
  }

  /**
   * 获取喂养员统计数据
   * GET /admin/feeders/stats
   */
  @Get('stats')
  @Roles('super', 'feeder_manager')
  async getFeederStats() {
    return this.feedersService.getStats();
  }

  /**
   * 获取喂养员审核列表
   * GET /admin/feeders/audit-list
   */
  @Get('audit-list')
  @Roles('super', 'feeder_manager')
  async getFeederAuditList(@Query() query: FeederListDto) {
    return this.feedersService.findAuditList(query);
  }

  /**
   * 获取喂养员服务记录
   * GET /admin/feeders/:id/service-records
   */
  @Get(':id/service-records')
  @Roles('super', 'feeder_manager')
  async getFeederServiceRecords(
    @Param('id') id: string,
    @Query() query: { page?: number; pageSize?: number },
  ) {
    return this.feedersService.getServiceRecords(+id, query);
  }

  /**
   * 获取喂养员签到记录
   * GET /admin/feeders/:id/checkins
   */
  @Get(':id/checkins')
  @Roles('super', 'feeder_manager')
  async getFeederCheckins(
    @Param('id') id: string,
    @Query() query: { page?: number; pageSize?: number },
  ) {
    return this.feedersService.getCheckins(+id, query);
  }

  /**
   * 批量操作喂养员
   * POST /admin/feeders/batch
   */
  @Post('batch')
  @Roles('super', 'feeder_manager')
  async batchUpdateFeeders(@Body() batchDto: BatchUpdateDto, @Req() req) {
    return this.feedersService.batchUpdate(batchDto, req.user.id);
  }

  /**
   * 导出喂养员数据
   * GET /admin/feeders/export
   */
  @Get('export')
  @Roles('super', 'feeder_manager')
  async exportFeeders(@Query() query: FeederListDto, @Req() req) {
    return this.feedersService.exportData(query, req.user.id);
  }

  /**
   * 获取喂养员地理分布统计
   * GET /admin/feeders/location-stats
   */
  @Get('location-stats')
  @Roles('super', 'feeder_manager')
  async getLocationStats() {
    return this.feedersService.getLocationStats();
  }

  /**
   * 获取喂养员评分统计
   * GET /admin/feeders/rating-stats
   */
  @Get('rating-stats')
  @Roles('super', 'feeder_manager')
  async getRatingStats() {
    return this.feedersService.getRatingStats();
  }
}