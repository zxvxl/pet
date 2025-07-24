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
      const open_id =
        detail?.user?.open_id ?? detail?.base_order?.user?.open_id;
      const orderId = detail?.base_order?.id ?? detail?.id;
      if (open_id && orderId) {
        wxService.send(open_id, tpl, { status }, `/pages/orders/detail?id=${orderId}`);
      }
    }
    return res;
  };
}
