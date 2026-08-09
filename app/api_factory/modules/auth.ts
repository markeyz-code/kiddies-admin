import { GATEWAY_ENDPOINT, GATEWAY_ENDPOINT_WITH_AUTH } from '../axios.config';

export const authApi = {
    login(payload: any) {
        return GATEWAY_ENDPOINT.post('/auth/login', payload);
    },
    getProfile() {
        return GATEWAY_ENDPOINT_WITH_AUTH.get('/auth/admin/profile');
    },
    forgotPassword(payload: any) {
        return GATEWAY_ENDPOINT.post('/auth/forgot-password', payload);
    },
    resetPassword(payload: any) {
        return GATEWAY_ENDPOINT.post('/auth/reset-password', payload);
    }
};
