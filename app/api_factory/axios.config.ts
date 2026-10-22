import axios from "axios";

export const rawBaseUrl = (import.meta.env.VITE_BASE_URL as string)
  || (import.meta.env.NUXT_PUBLIC_API_BASE as string)
  || "http://localhost:3005";

// Remove /api/v1 if it exists in the base url
const $GATEWAY_ENDPOINT_WITHOUT_VERSION = rawBaseUrl.replace(/\/api\/v1\/?$/, '').replace(/\/+$/, '');
const $GATEWAY_ENDPOINT = $GATEWAY_ENDPOINT_WITHOUT_VERSION;

export const GATEWAY_ENDPOINT = axios.create({
  baseURL: $GATEWAY_ENDPOINT,
  withCredentials: true,
  timeout: 15000,
});

export const GATEWAY_ENDPOINT_WITH_AUTH = axios.create({
  baseURL: $GATEWAY_ENDPOINT,
  withCredentials: true,
});

export const GATEWAY_ENDPOINT_WITH_AUTH_FORM_DATA = axios.create({
  baseURL: $GATEWAY_ENDPOINT,
  withCredentials: true,
  headers: {
    'Content-Type': 'multipart/form-data'
  }
});

let isRefreshing = false;
let failedQueue: any[] = [];

const processQueue = (error: any, token = null) => {
  failedQueue.forEach(prom => {
    if (error) {
      prom.reject(error);
    } else {
      prom.resolve(token);
    }
  });
  failedQueue = [];
};

const getCookie = (name: string) => {
  if (typeof document === 'undefined') return null;
  const value = `; ${document.cookie}`;
  const parts = value.split(`; ${name}=`);
  if (parts.length === 2) {
    const token = parts.pop()?.split(';').shift();
    if (token) return token;
  }
  try {
    return localStorage.getItem(name);
  } catch {
    return null;
  }
};

const setCookie = (name: string, value: string, maxAgeDays: number) => {
  if (typeof document === 'undefined') return;
  document.cookie = `${name}=${value}; path=/; max-age=${maxAgeDays * 86400}; SameSite=Lax`;
  try {
    localStorage.setItem(name, value);
  } catch {}
};

const clearAdminSession = () => {
  if (typeof document === 'undefined') return;
  document.cookie = 'adminAccessToken=; Max-Age=0; path=/';
  document.cookie = 'adminRefreshToken=; Max-Age=0; path=/';
  try {
    localStorage.removeItem('adminAccessToken');
    localStorage.removeItem('adminRefreshToken');
  } catch {}
};

// Add request interceptor to inject token
GATEWAY_ENDPOINT_WITH_AUTH.interceptors.request.use(
  (config) => {
    const token = getCookie('adminAccessToken');
    if (token && config.headers) {
      config.headers['Authorization'] = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Add response interceptor to handle 401 and refresh token
GATEWAY_ENDPOINT_WITH_AUTH.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;
    
    if (error.response?.status === 401 && !originalRequest._retry) {
      if (isRefreshing) {
        return new Promise(function(resolve, reject) {
          failedQueue.push({ resolve, reject });
        }).then(token => {
          originalRequest.headers['Authorization'] = 'Bearer ' + token;
          return GATEWAY_ENDPOINT_WITH_AUTH(originalRequest);
        }).catch(err => {
          return Promise.reject(err);
        });
      }

      originalRequest._retry = true;
      isRefreshing = true;

      try {
        const refreshToken = getCookie('adminRefreshToken');
        if (!refreshToken) throw new Error('No refresh token');

        const refreshResponse = await axios.post(
          `${$GATEWAY_ENDPOINT}/auth/refresh`,
          { refreshToken },
          { headers: { 'x-refresh-token': refreshToken } }
        );
        const newAccessToken = refreshResponse.data?.accessToken;
        if (!newAccessToken) throw new Error('No access token returned');

        setCookie('adminAccessToken', newAccessToken, 7);
        if (refreshResponse.data?.refreshToken) {
          setCookie('adminRefreshToken', refreshResponse.data.refreshToken, 30);
        }

        processQueue(null, newAccessToken);
        originalRequest.headers = originalRequest.headers || {};
        originalRequest.headers['Authorization'] = 'Bearer ' + newAccessToken;
        return GATEWAY_ENDPOINT_WITH_AUTH(originalRequest);
      } catch (refreshError) {
        processQueue(refreshError, null);
        clearAdminSession();
        if (typeof window !== 'undefined' && !window.location.pathname.startsWith('/login')) {
          window.location.href = '/login';
        }
        return Promise.reject(refreshError);
      } finally {
        isRefreshing = false;
      }
    }
    
    return Promise.reject(error);
  }
);
