// backend/pet-feeder-backend/src/domains/feeders/feeders.service.ts

import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, Like, Between } from 'typeorm';
import { Feeder } from './entities/feeder.entity';
import { FeederServiceRecord } from './entities/feeder-service-record.entity';
import { FeederCheckin } from './entities/feeder-checkin.entity';
import { CreateFeederDto } from './dto/create-feeder.dto';
import { UpdateFeederDto } from './dto/update-feeder.dto';
import { FeederListDto } from './dto/feeder-list.dto';
import { AuditFeederDto } from './dto/audit-feeder.dto';
import { BatchUpdateDto } from './dto/batch-update.dto';
import * as XLSX from 'xlsx';

@Injectable()
export class FeedersService {
  constructor(
    @InjectRepository(Feeder)
    private readonly feederRepository: Repository<Feeder>,
    @InjectRepository(FeederServiceRecord)
    private readonly serviceRecordRepository: Repository<FeederServiceRecord>,
    @InjectRepository(FeederCheckin)
    private readonly checkinRepository: Repository<FeederCheckin>,
  ) {}

  /**
   * 获取喂养员列表
   */
  async findAll(query: FeederListDto) {
    const { page = 1, pageSize = 20, keyword, status, dateRange } = query;
    const skip = (page - 1) * pageSize;

    const queryBuilder = this.feederRepository
      .createQueryBuilder('feeder')
      .where('feeder.is_deleted = :isDeleted', { isDeleted: false });

    // 关键词搜索
    if (keyword) {
      queryBuilder.andWhere(
        '(feeder.name LIKE :keyword OR feeder.phone LIKE :keyword)',
        { keyword: `%${keyword}%` }
      );
    }

    // 状态筛选
    if (status !== undefined) {
      queryBuilder.andWhere('feeder.status = :status', { status });
    }

    // 日期范围筛选
    if (dateRange && dateRange.length === 2) {
      queryBuilder.andWhere('feeder.created_at BETWEEN :startDate AND :endDate', {
        startDate: new Date(dateRange[0]),
        endDate: new Date(dateRange[1] + ' 23:59:59'),
      });
    }

    // 排序
    queryBuilder.orderBy('feeder.created_at', 'DESC');

    // 分页
    const [list, total] = await queryBuilder
      .skip(skip)
      .take(pageSize)
      .getManyAndCount();

    return {
      code: 0,
      message: 'success',
      data: {
        list,
        total,
        page,
        pageSize,
      },
    };
  }

  /**
   * 获取喂养员详情
   */
  async findOne(id: number) {
    const feeder = await this.feederRepository.findOne({
      where: { id, is_deleted: false },
    });

    if (!feeder) {
      throw new NotFoundException('喂养员不存在');
    }

    return {
      code: 0,
      message: 'success',
      data: feeder,
    };
  }

  /**
   * 根据用户ID查找喂养员
   */
  async findByUserId(userId: number) {
    return this.feederRepository.findOne({
      where: { user_id: userId, is_deleted: false },
    });
  }

  /**
   * 创建喂养员
   */
  async create(createFeederDto: CreateFeederDto, operatorId: number) {
    // 检查手机号是否已存在
    const existingFeeder = await this.feederRepository.findOne({
      where: { phone: createFeederDto.phone, is_deleted: false },
    });

    if (existingFeeder) {
      throw new BadRequestException('该手机号已注册');
    }

    const feeder = this.feederRepository.create(createFeederDto);
    const savedFeeder = await this.feederRepository.save(feeder);

    // 记录操作日志
    await this.logOperation(operatorId, 'create', savedFeeder.id, 'feeder', '创建喂养员');

    return {
      code: 0,
      message: '创建成功',
      data: savedFeeder,
    };
  }

  /**
   * 更新喂养员信息
   */
  async update(id: number, updateFeederDto: UpdateFeederDto, operatorId: number) {
    const feeder = await this.findOne(id);

    // 如果更新手机号，检查是否重复
    if (updateFeederDto.phone && updateFeederDto.phone !== feeder.data.phone) {
      const existingFeeder = await this.feederRepository.findOne({
        where: { phone: updateFeederDto.phone, is_deleted: false },
      });

      if (existingFeeder && existingFeeder.id !== id) {
        throw new BadRequestException('该手机号已被使用');
      }
    }

    await this.feederRepository.update(id, {
      ...updateFeederDto,
      updated_at: new Date(),
    });

    // 记录操作日志
    await this.logOperation(operatorId, 'update', id, 'feeder', '更新喂养员信息');

    const updatedFeeder = await this.findOne(id);
    return {
      code: 0,
      message: '更新成功',
      data: updatedFeeder.data,
    };
  }

  /**
   * 删除喂养员（软删除）
   */
  async remove(id: number, operatorId: number) {
    const feeder = await this.findOne(id);

    await this.feederRepository.update(id, {
      is_deleted: true,
      updated_at: new Date(),
    });

    // 记录操作日志
    await this.logOperation(operatorId, 'delete', id, 'feeder', '删除喂养员');

    return {
      code: 0,
      message: '删除成功',
    };
  }

  /**
   * 更新喂养员状态
   */
  async updateStatus(id: number, status: number, operatorId: number) {
    const feeder = await this.findOne(id);

    await this.feederRepository.update(id, {
      status,
      updated_at: new Date(),
    });

    // 记录操作日志
    const statusText = this.getStatusText(status);
    await this.logOperation(operatorId, 'status_change', id, 'feeder', `修改状态为：${statusText}`);

    return {
      code: 0,
      message: '状态更新成功',
    };
  }

  /**
   * 审核喂养员
   */
  async audit(id: number, auditDto: AuditFeederDto, operatorId: number) {
    const feeder = await this.findOne(id);

    if (feeder.data.status !== 0) {
      throw new BadRequestException('只能审核待审核状态的申请');
    }

    const updateData: any = {
      status: auditDto.action === 'approve' ? 1 : 2,
      updated_at: new Date(),
    };

    if (auditDto.action === 'reject' && auditDto.rejection_reason) {
      updateData.rejection_reason = auditDto.rejection_reason;
    }

    await this.feederRepository.update(id, updateData);

    // 记录操作日志
    const action = auditDto.action === 'approve' ? '通过' : '拒绝';
    await this.logOperation(operatorId, 'audit', id, 'feeder', `审核${action}`);

    return {
      code: 0,
      message: '审核成功',
    };
  }

  /**
   * 获取统计数据
   */
  async getStats() {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);

    // 待审核数量
    const pending = await this.feederRepository.count({
      where: { status: 0, is_deleted: false },
    });

    // 今日审核数量
    const todayAudit = await this.feederRepository.count({
      where: {
        status: [1, 2],
        updated_at: Between(today, tomorrow),
        is_deleted: false,
      },
    });

    // 计算通过率（最近30天）
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

    const recentAudited = await this.feederRepository.count({
      where: {
        status: [1, 2],
        updated_at: Between(thirtyDaysAgo, new Date()),
        is_deleted: false,
      },
    });

    const recentApproved = await this.feederRepository.count({
      where: {
        status: 1,
        updated_at: Between(thirtyDaysAgo, new Date()),
        is_deleted: false,
      },
    });

    const passRate = recentAudited > 0 ? Math.round((recentApproved / recentAudited) * 100) : 0;

    // 平均审核时长（小时）
    const avgAuditTime = await this.calculateAvgAuditTime();

    return {
      code: 0,
      message: 'success',
      data: {
        pending,
        todayAudit,
        passRate,
        avgAuditTime,
      },
    };
  }

  /**
   * 获取审核列表
   */
  async findAuditList(query: FeederListDto) {
    const result = await this.findAll(query);
    const stats = await this.getStats();

    return {
      ...result,
      data: {
        ...result.data,
        stats: stats.data,
      },
    };
  }

  /**
   * 获取服务记录
   */
  async getServiceRecords(feederId: number, query: { page?: number; pageSize?: number }) {
    const { page = 1, pageSize = 20 } = query;
    const skip = (page - 1) * pageSize;

    const [list, total] = await this.serviceRecordRepository.findAndCount({
      where: { feeder_id: feederId },
      order: { created_at: 'DESC' },
      skip,
      take: pageSize,
    });

    return {
      code: 0,
      message: 'success',
      data: {
        list,
        total,
        page,
        pageSize,
      },
    };
  }

  /**
   * 获取签到记录
   */
  async getCheckins(feederId: number, query: { page?: number; pageSize?: number }) {
    const { page = 1, pageSize = 20 } = query;
    const skip = (page - 1) * pageSize;

    const [list, total] = await this.checkinRepository.findAndCount({
      where: { feeder_id: feederId },
      order: { created_at: 'DESC' },
      skip,
      take: pageSize,
    });

    return {
      code: 0,
      message: 'success',
      data: {
        list,
        total,
        page,
        pageSize,
      },
    };
  }

  /**
   * 批量更新
   */
  async batchUpdate(batchDto: BatchUpdateDto, operatorId: number) {
    const { ids, action } = batchDto;

    if (!ids.length) {
      throw new BadRequestException('请选择要操作的数据');
    }

    let updateData: any = {};
    let logMessage = '';

    switch (action) {
      case 'audit':
        if (batchDto.action === 'approve') {
          updateData = { status: 1 };
          logMessage = '批量审核通过';
        } else if (batchDto.action === 'reject') {
          updateData = { 
            status: 2,
            rejection_reason: batchDto.rejection_reason || '批量拒绝'
          };
          logMessage = '批量审核拒绝';
        }
        break;
      case 'enable':
        updateData = { status: 1 };
        logMessage = '批量启用';
        break;
      case 'disable':
        updateData = { status: 3 };
        logMessage = '批量禁用';
        break;
      case 'delete':
        updateData = { is_deleted: true };
        logMessage = '批量删除';
        break;
      default:
        throw new BadRequestException('不支持的操作类型');
    }

    updateData.updated_at = new Date();

    await this.feederRepository.update(ids, updateData);

    // 记录操作日志
    for (const id of ids) {
      await this.logOperation(operatorId, action, id, 'feeder', logMessage);
    }

    return {
      code: 0,
      message: '批量操作成功',
    };
  }

  /**
   * 导出数据
   */
  async exportData(query: FeederListDto, operatorId: number) {
    // 获取所有数据（不分页）
    const { data } = await this.findAll({ ...query, pageSize: 10000 });

    // 构建Excel数据
    const excelData = data.list.map((feeder, index) => ({
      序号: index + 1,
      姓名: feeder.name,
      手机号: feeder.phone,
      身份证号: feeder.id_card || '',
      地址: feeder.address || '',
      状态: this.getStatusText(feeder.status),
      评分: feeder.rating,
      完成订单: feeder.order_count,
      注册时间: this.formatDate(feeder.created_at),
      最后登录: feeder.last_login_at ? this.formatDate(feeder.last_login_at) : '',
    }));

    // 创建工作簿
    const workbook = XLSX.utils.book_new();
    const worksheet = XLSX.utils.json_to_sheet(excelData);

    // 设置列宽
    const colWidths = [
      { wch: 8 },  // 序号
      { wch: 12 }, // 姓名
      { wch: 15 }, // 手机号
      { wch: 20 }, // 身份证号
      { wch: 30 }, // 地址
      { wch: 10 }, // 状态
      { wch: 8 },  // 评分
      { wch: 12 }, // 完成订单
      { wch: 20 }, // 注册时间
      { wch: 20 }, // 最后登录
    ];
    worksheet['!cols'] = colWidths;

    XLSX.utils.book_append_sheet(workbook, worksheet, '喂养员列表');

    // 生成Excel文件
    const buffer = XLSX.write(workbook, { type: 'buffer', bookType: 'xlsx' });

    // 记录操作日志
    await this.logOperation(operatorId, 'export', 0, 'feeder', '导出喂养员数据');

    return buffer;
  }

  /**
   * 获取地理分布统计
   */
  async getLocationStats() {
    const queryBuilder = this.feederRepository
      .createQueryBuilder('feeder')
      .select('feeder.address', 'address')
      .addSelect('COUNT(*)', 'count')
      .where('feeder.is_deleted = :isDeleted', { isDeleted: false })
      .andWhere('feeder.address IS NOT NULL')
      .groupBy('feeder.address')
      .orderBy('count', 'DESC')
      .limit(20);

    const result = await queryBuilder.getRawMany();

    return {
      code: 0,
      message: 'success',
      data: result,
    };
  }

  /**
   * 获取评分统计
   */
  async getRatingStats() {
    const queryBuilder = this.feederRepository
      .createQueryBuilder('feeder')
      .select('FLOOR(feeder.rating)', 'rating')
      .addSelect('COUNT(*)', 'count')
      .where('feeder.is_deleted = :isDeleted', { isDeleted: false })
      .groupBy('FLOOR(feeder.rating)')
      .orderBy('rating', 'ASC');

    const result = await queryBuilder.getRawMany();

    return {
      code: 0,
      message: 'success',
      data: result,
    };
  }

  /**
   * 计算平均审核时长
   */
  private async calculateAvgAuditTime(): Promise<number> {
    // 简化实现，实际应该基于审核日志计算
    return 2.5; // 默认2.5小时
  }

  /**
   * 获取状态文本
   */
  private getStatusText(status: number): string {
    const statusMap = {
      0: '待审核',
      1: '已通过',
      2: '已拒绝',
      3: '已禁用',
    };
    return statusMap[status] || '未知';
  }

  /**
   * 格式化日期
   */
  private formatDate(date: Date): string {
    return new Date(date).toLocaleString('zh-CN', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
    });
  }

  /**
   * 记录操作日志
   */
  private async logOperation(
    userId: number,
    action: string,
    targetId: number,
    targetType: string,
    detail: string,
  ) {
    // 这里应该调用日志服务记录操作日志
    // await this.logService.create({
    //   user_id: userId,
    //   action,
    //   target_id: targetId,
    //   target_type: targetType,
    //   detail,
    // });
    console.log(`操作日志: 用户${userId} ${action} ${targetType}:${targetId} - ${detail}`);
  }
}