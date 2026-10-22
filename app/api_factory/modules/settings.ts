import { GATEWAY_ENDPOINT, GATEWAY_ENDPOINT_WITH_AUTH } from '../axios.config';

export const settingsApi = {
  getSettings() {
    return GATEWAY_ENDPOINT.get('/settings');
  },
  getGeneral() {
    return GATEWAY_ENDPOINT.get('/settings/general');
  },
  updateGeneral(payload: any) {
    return GATEWAY_ENDPOINT_WITH_AUTH.put('/settings/general', payload);
  },
  getStorefront() {
    return GATEWAY_ENDPOINT.get('/settings/storefront');
  },
  updateStorefront(payload: any) {
    return GATEWAY_ENDPOINT_WITH_AUTH.put('/settings/storefront', payload);
  }
};
