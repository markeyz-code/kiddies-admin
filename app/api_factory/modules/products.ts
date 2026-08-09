import { GATEWAY_ENDPOINT_WITH_AUTH } from '../axios.config';

export const productsApi = {
    getProducts(params: any = {}) {
        return GATEWAY_ENDPOINT_WITH_AUTH.get('/products', { params });
    },
    createProduct(payload: any) {
        return GATEWAY_ENDPOINT_WITH_AUTH.post('/products', payload);
    },
    updateProduct(id: string, payload: any) {
        return GATEWAY_ENDPOINT_WITH_AUTH.put(`/products/${id}`, payload);
    },
    deleteProduct(id: string) {
        return GATEWAY_ENDPOINT_WITH_AUTH.delete(`/products/${id}`);
    }
};
