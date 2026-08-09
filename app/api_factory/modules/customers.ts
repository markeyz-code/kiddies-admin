import { GATEWAY_ENDPOINT_WITH_AUTH } from '../axios.config';

export const customersApi = {
    getCustomers(params: any = {}) {
        return GATEWAY_ENDPOINT_WITH_AUTH.get('/auth/users', { params });
    }
};
