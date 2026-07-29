import axios from 'axios';
import keycloak from '../keycloak';

const BASE_URL = import.meta.env.VITE_API_URL ?? 'http://localhost:2222/api/v1';

const client = axios.create({
  baseURL: BASE_URL,
});

client.interceptors.request.use((config) => {
  config.headers['beaver'] = '1';
  if (keycloak.token) {
    config.headers.Authorization = `Bearer ${keycloak.token}`;
  }
  return config;
});

client.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;
    const requestUrl = originalRequest?.url ?? '';

    if (
      error.response?.status === 401 &&
      originalRequest &&
      !originalRequest._retry &&
      !requestUrl.includes('/public/auth/refresh')
    ) {
      originalRequest._retry = true;
      try {
        const refreshed = await keycloak.updateToken(30);
        if (refreshed && keycloak.token) {
          originalRequest.headers.Authorization = `Bearer ${keycloak.token}`;
        }
        return client(originalRequest);
      } catch (refreshError) {
        return Promise.reject(refreshError);
      }
    }

    return Promise.reject(error);
  },
);

export default client;
