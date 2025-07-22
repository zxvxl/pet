import { Repository } from 'typeorm';
import { TrackingGateway } from '../../tracking/tracking.gateway';
import { WxTemplateService } from '../../tracking/wx-template.service';

/**
 * Create a reusable status update function for order-like entities.
 * It handles status persistence, real-time notifications and wx template push.
 */
export function createStatusUpdater<T>(
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
      const openid =
        detail?.user?.openid ?? detail?.baseOrder?.user?.openid;
      const orderId = detail?.baseOrder?.id ?? detail?.id;
      if (openid && orderId) {
        wxService.send(openid, tpl, { status }, `/pages/orders/detail?id=${orderId}`);
      }
    }
    return res;
  };
}
