import querystring from 'querystring';
import remote from './remote';

export const _getObject = (path, qs = {}) => {
  qs = querystring.stringify(qs);
  if (qs.length) {
    qs = `?${qs}`;
  }

  return remote()
    .get(`/${path}${qs}`)
    .then(resolved => resolved.data);
};

export const _getObjectsList = (path, qs) => {
  qs = querystring.stringify(qs);
  if (qs.length) {
    qs = `?${qs}`;
  }

  return remote()
    .get(`/${path}${qs}`)
    .then(resolved => resolved.data);
};

export const _postObject = (path, data, qs = '') => {
  qs = querystring.stringify(qs);
  if (qs.length) {
    qs = `?${qs}`;
  }

  return remote()
    .post(`/${path}${qs}`, data)
    .then(resolved => resolved.data);
};

export const _postObjectsList = (path, data, qs = '') => {
  qs = querystring.stringify(qs);
  if (qs.length) {
    qs = `?${qs}`;
  }

  return remote()
    .post(`/${path}${qs}`, data)
    .then(resolved => resolved.data);
};

