import { GATEWAY_ENDPOINT, GATEWAY_ENDPOINT_WITH_AUTH } from '../axios.config';

export const promotionsApi = {
  getPromotions(params: any = {}) {
    return GATEWAY_ENDPOINT.get('/promotions', { params });
  },
  createPromotion(payload: any) {
    return GATEWAY_ENDPOINT_WITH_AUTH.post('/promotions', payload);
  },
  updatePromotion(id: string, payload: any) {
    return GATEWAY_ENDPOINT_WITH_AUTH.put(`/promotions/${id}`, payload);
  },
  deletePromotion(id: string) {
    return GATEWAY_ENDPOINT_WITH_AUTH.delete(`/promotions/${id}`);
  }
};
