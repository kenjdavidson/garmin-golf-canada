import axios, { type AxiosInstance } from 'axios';

interface ApiClientOptions {
  baseURL?: string;
  getAccessToken?: () => string | undefined;
}

export const GOLF_CANADA_BASE_URL = 'https://scg.golfcanada.ca';

export const createApiClient = ({
  baseURL = GOLF_CANADA_BASE_URL,
  getAccessToken,
}: ApiClientOptions = {}): AxiosInstance => {
  const client = axios.create({
    baseURL,
    timeout: 15000,
  });

  client.interceptors.request.use((config) => {
    if (!config.headers?.Authorization) {
      const token = getAccessToken?.();
      if (token) {
        config.headers = config.headers ?? {};
        config.headers.Authorization = 'Bearer '.concat(token);
      }
    }

    return config;
  });

  return client;
};
