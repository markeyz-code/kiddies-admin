import { GATEWAY_ENDPOINT_WITH_AUTH } from '../axios.config';

export const ordersApi = {
  getOrders(params: any = {}) {
    return GATEWAY_ENDPOINT_WITH_AUTH.get('/orders', { params });
  },
  getOrder(id: string) {
    return GATEWAY_ENDPOINT_WITH_AUTH.get(`/orders/${id}`);
  },
  getOrderAnalytics() {
    return GATEWAY_ENDPOINT_WITH_AUTH.get('/orders/analytics');
  },
  updateOrderStatus(id: string, status: string) {
    return GATEWAY_ENDPOINT_WITH_AUTH.patch(`/orders/${id}/status`, { status });
  },
  updatePaymentStatus(id: string, paymentStatus: string) {
    return GATEWAY_ENDPOINT_WITH_AUTH.patch(`/orders/${id}/payment`, { paymentStatus });
  }
};
