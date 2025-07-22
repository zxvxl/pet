import { ServiceStatus } from '../service-orders/status.enum';

export interface ServiceStatusResponse {
  orderId: number;
  status: ServiceStatus;
  signInTime?: string;
  completeTime?: string;
}

export interface LocationReport {
  orderId: number;
  lat: number;
  lng: number;
  time: string;
}
