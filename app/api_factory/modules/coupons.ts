import { GATEWAY_ENDPOINT_WITH_AUTH } from '../axios.config';

export const couponsApi = {
  getCoupons() {
    return GATEWAY_ENDPOINT_WITH_AUTH.get('/coupons');
  },
  createCoupon(data: any) {
    return GATEWAY_ENDPOINT_WITH_AUTH.post('/coupons', data);
  },
  updateCoupon(id: string, data: any) {
    return GATEWAY_ENDPOINT_WITH_AUTH.patch(`/coupons/${id}`, data);
  },
  deleteCoupon(id: string) {
    return GATEWAY_ENDPOINT_WITH_AUTH.delete(`/coupons/${id}`);
  }
};
