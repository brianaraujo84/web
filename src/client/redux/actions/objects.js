import store from '../store';
import {
  _GET_OBJECTS_STARTED,
  _GET_OBJECTS_ENDED,
  _POST_OBJECTS_STARTED,
  _POST_OBJECTS_ENDED,
  _REMOVE_FROM_LIST,
  _ADD_TO_LIST,
  _RESET_LIST,
  _UPDATE_LIST_ITEMS
} from '../reducers/objects';

import { _getObjectsList, _postObjectsList } from '../../services/services';

export const getObjectsList = (name, path = name, listName = name, path2 = '') => (dispatch, params, queryStrings = {}, xtraPath = '', firstFetch = false) => {
  dispatch({ type: _GET_OBJECTS_STARTED(name), firstFetch });
  let xtrParams = '';
  if (params) {
    if (Array.isArray(params)) {
      xtrParams = `/${params.join('/')}`;
    } else {
      xtrParams = `/${params}`;
    }
  }
  xtraPath = path2 + xtraPath;

  return _getObjectsList(`${path}${xtrParams}${xtraPath}`, queryStrings)
    .then(response => {
      dispatch({
        type: _GET_OBJECTS_ENDED(name),
        list: response[listName],
        pagination: response.pagination,
        error: false
      });
      return response;
    }, error => {
      dispatch({
        type: _GET_OBJECTS_ENDED(name),
        list: [],
        error: true
      });
      throw error;
    });
};

export const getPostObjectsList = (name, path = name, listName = name, path2 = '', limit = undefined, totalPropertyName = undefined) => (dispatch, data, params, queryStrings = {}, xtraPath = '', firstFetch = false, append = false, prepend = false, readonly = false) => {
  dispatch({ type: _GET_OBJECTS_STARTED(name), firstFetch, readonly });
  let xtrParams = '';
  if (params) {
    if (Array.isArray(params)) {
      xtrParams = `/${params.join('/')}`;
    } else {
      xtrParams = `/${params}`;
    }
  }
  xtraPath = path2 + xtraPath;

  let newData = data;

  // For pagination
  if (limit) {
    const state = store.getState();
    const currentLength = state[name].items.length;
    // const total = state[name].total;

    // If no more records to fetch, return
    // if (Number.isInteger(total) && currentLength >= total) {
    //   return Promise.resolve();
    // }

    newData = {
      ...(data || {}),
      start: currentLength,
      limit,
    };
  }

  return _postObjectsList(`${path}${xtrParams}${xtraPath}`, newData, queryStrings)
    .then(response => {
      const payload = {
        type: _GET_OBJECTS_ENDED(name),
        list: response[listName],
        pagination: response.pagination,
        error: false
      };
      // For pagination
      if (limit) {
        const state = store.getState();
        const currentLength = state[name].items.length;

        // If the store is updated while fetching new set of records, then do not update
        if (currentLength !== newData.start) {
          return;
        }

        payload.append = true;
      }

      if (totalPropertyName) { payload.total = response[totalPropertyName]; }
      if (prepend) { payload.prepend = true; }
      if (append) { payload.append = true; }
      if (readonly) { payload.readonly = true; }

      dispatch(payload);
      return response;
    }, error => {
      dispatch({
        type: _GET_OBJECTS_ENDED(name),
        list: [],
        error: true
      });
      throw error;
    });
};

export const postObjectsList = (name, path = name, listName = name, path2 = '') => (dispatch, data, params, queryStrings = {}, xtraPath = '') => {
  dispatch({ type: _POST_OBJECTS_STARTED(name) });
  let xtrParams = '';
  if (params) {
    if (Array.isArray(params)) {
      xtrParams = `/${params.join('/')}`;
    } else {
      xtrParams = `/${params}`;
    }
  }
  xtraPath = path2 + xtraPath;
  return _postObjectsList(`${path}${xtrParams}${xtraPath}`, data, queryStrings)
    .then(response => {
      dispatch({
        type: _POST_OBJECTS_ENDED(name),
        list: response[listName],
        pagination: response.pagination,
        error: false
      });
      return response;
    }, error => {
      dispatch({
        type: _POST_OBJECTS_ENDED(name),
        list: [],
        error: true
      });
      throw error;
    });
};

export const removeFromList = (name) => (dispatch, index) => {
  dispatch({ type: _REMOVE_FROM_LIST(name), index });
};

export const addToList = (name) => (dispatch, index, task) => {
  dispatch({ type: _ADD_TO_LIST(name), index, task });
};

export const resetList = (name) => (dispatch) => {
  dispatch({ type: _RESET_LIST(name) });
};

export const updateListItems = (name) => (dispatch, items, total) => {
  dispatch({ type: _UPDATE_LIST_ITEMS(name), items, total });
};

export const getStandardObjectsList = (name, listName = name, version = 'v1', path = name, path2 = '') => {
  return getObjectsList(name, `${version}/confidence/${path}`, listName, path2);
};

export const getPostStandardObjectsList = (name, listName = name, version = 'v1', path = name, path2 = '', limit = undefined, totalPropertyName = '') => {
  return getPostObjectsList(name, `${version}/confidence/${path}`, listName, path2, limit, totalPropertyName);
};

export const postStandardObjectsList = (name, listName = name, version = 'v1', path = name, path2 = '') => {
  return postObjectsList(name, `${version}/confidence/${path}`, listName, path2);
};

export const getCommunicationObjectsList = (name, listName = name, version = 'v1', path, path2, limit = undefined, totalPropertyName = '') => {
  return getPostObjectsList(name, `communication/${version}/${path}`, listName, path2, limit, totalPropertyName);
};
