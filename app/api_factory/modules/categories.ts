import { GATEWAY_ENDPOINT, GATEWAY_ENDPOINT_WITH_AUTH } from '../axios.config';

export const categoriesApi = {
  getCategories() {
    return GATEWAY_ENDPOINT.get('/categories');
  },
  createCategory(payload: any) {
    return GATEWAY_ENDPOINT_WITH_AUTH.post('/categories', payload);
  },
  updateCategory(id: string, payload: any) {
    return GATEWAY_ENDPOINT_WITH_AUTH.patch(`/categories/${id}`, payload);
  },
  deleteCategory(id: string) {
    return GATEWAY_ENDPOINT_WITH_AUTH.delete(`/categories/${id}`);
  }
};
