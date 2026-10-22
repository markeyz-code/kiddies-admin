import { GATEWAY_ENDPOINT, GATEWAY_ENDPOINT_WITH_AUTH } from '../axios.config';

export const policiesApi = {
  getPolicies() {
    return GATEWAY_ENDPOINT.get('/product-policies');
  },
  createPolicy(payload: any) {
    return GATEWAY_ENDPOINT_WITH_AUTH.post('/product-policies', payload);
  },
  updatePolicy(id: string, payload: any) {
    return GATEWAY_ENDPOINT_WITH_AUTH.patch(`/product-policies/${id}`, payload);
  },
  deletePolicy(id: string) {
    return GATEWAY_ENDPOINT_WITH_AUTH.delete(`/product-policies/${id}`);
  }
};
