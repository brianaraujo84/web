import axios from 'axios';

export const BASE_URL = '/api';

const timezone = Intl && Intl.DateTimeFormat().resolvedOptions().timeZone;

export default () => {
  const instance = axios.create({
    baseURL: BASE_URL
  });

  instance.interceptors.request.use(function (config) {
    const headers = { ...config.headers };
    headers.timezone = timezone;
    config.headers = headers;
    return Promise.resolve(config);
  });

  instance.interceptors.response.use(function (response) {
    return response;
  }, function (error) {
    if (error.response.status === 401) {
      window.location.replace(`/login/${encodeURIComponent(window.location.pathname)}`);
    }
    return Promise.reject(error.response);
  });

  return instance;
};
