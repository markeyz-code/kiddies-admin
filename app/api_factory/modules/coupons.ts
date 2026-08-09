import { GATEWAY_ENDPOINT } from '../axios.config';

export const couponsApi = {
    getCoupons() {
        return GATEWAY_ENDPOINT.get('/coupons');
    },
    createCoupon(data: any) {
        return GATEWAY_ENDPOINT.post('/coupons', data);
    },
    deleteCoupon(id: string) {
        return GATEWAY_ENDPOINT.delete(`/coupons/${id}`);
    }
};
