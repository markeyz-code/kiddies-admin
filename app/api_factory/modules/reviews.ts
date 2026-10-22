import { GATEWAY_ENDPOINT, GATEWAY_ENDPOINT_WITH_AUTH } from '../axios.config';

export const reviewsApi = {
  getReviews() {
    return GATEWAY_ENDPOINT_WITH_AUTH.get('/reviews');
  },
  deleteReview(id: string) {
    return GATEWAY_ENDPOINT_WITH_AUTH.delete(`/reviews/${id}`);
  },
  getProductReviews(productId: string) {
    return GATEWAY_ENDPOINT.get(`/reviews/product/${productId}`);
  }
};
