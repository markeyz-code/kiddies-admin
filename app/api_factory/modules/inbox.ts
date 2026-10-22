import { GATEWAY_ENDPOINT_WITH_AUTH } from '../axios.config';

export const inboxApi = {
  getMessages() {
    return GATEWAY_ENDPOINT_WITH_AUTH.get('/contact');
  },
  getSubscribers() {
    return GATEWAY_ENDPOINT_WITH_AUTH.get('/subscribers');
  }
};
