import { ResponseStatus } from '@/enums/responseStatus';

export type ApiResponse<T = any> = {
  status: ResponseStatus;
  message?: string;
  data?: T;
};
