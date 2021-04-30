const axios = require('axios');
const SETTINGS = require('./settings');

const BASE_URL = SETTINGS.SERVICES_URL;

module.exports = (config) => {
  const instance = axios.create({
    baseURL: BASE_URL,
    ...config
  });

  instance.interceptors.request.use(function (config) {
    return Promise.resolve(config);
  });

  instance.interceptors.response.use(function (response) {
    return response;
  }, function (error) {
    return Promise.reject(error.response);
  });

  return instance;
};
