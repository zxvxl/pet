import { Repository } from 'typeorm';
import { TrackingGateway } from '../../domains/tracking/tracking.gateway';
import { WxTemplateService } from '../../domains/tracking/wx-template.service';

/**
 * Create a reusable status update function for order-like entities.
 * It handles status persistence, real-time notifications and wx template push.
 */
import { ObjectLiteral } from 'typeorm';
export function createStatusUpdater<T extends ObjectLiteral>(
  repository: Repository<T>,
  gateway: TrackingGateway,
  wxService: WxTemplateService,
  templateMap: Record<any, string>,
  findDetail: (id: number) => Promise<any>,
) {
  return async function updateStatus(
    id: number,
    status: any,
    extra: Record<string, any> = {},
  ) {
    gateway.notifyStatus(id, status);
    const res = await repository.update(id as any, { status, ...extra } as any);
    const tpl = templateMap[status];
    if (tpl) {
      const detail = await findDetail(id);
      const openId =
        detail?.user?.openId ?? detail?.baseOrder?.user?.openId;
      const orderId = detail?.baseOrder?.id ?? detail?.id;
      if (openId && orderId) {
        wxService.send(openId, tpl, { status }, `/pages/orders/detail?id=${orderId}`);
      }
    }
    return res;
  };
}
