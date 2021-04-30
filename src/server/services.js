const remote = require('./remote');
const URLS = require('../client/urls');

const getCurrentTZName = () => {
  return Intl && Intl.DateTimeFormat().resolvedOptions().timeZone;
};

const services = {
  call: (url, method, data, accessToken, username, languagePreference, noToken = false, hdrs = {}) => {
    const headers = {};
    if (hdrs.timezone) {
      headers.timezone = hdrs.timezone;
    } else {
      headers.timezone = getCurrentTZName();
    }
    if (!noToken) {
      headers.accesstoken = accessToken;
      headers.username = username;
      headers.languagepreference = languagePreference;
      headers.formatlocale = languagePreference;
    }
    return remote().request({
      method,
      url,
      data,
      headers,
    });
  },
  standardService: async (req, res, noToken = false) => {
    const { url, method, body, user = {}, headers = {} } = req;
    const { accessToken, username, languagePreference } = user;
    res.set('Cache-Control', 'no-store');

    try {
      const response = await services.call(url, method, body, accessToken, username, languagePreference, noToken, headers);

      const { status, data } = response;
      return res.status(status).json(data);

    } catch (error) {
      const { status, data } = error;
      if (status === 404) {
        return res.status(status).json({ message: 'Unknown API!' });
      }
      return res.status(status).send(data);
    }
  },
  getLocations: async (req) => {
    if (!req.user) {
      return false;
    }

    const { headers = {} } = req;
    const timezone = headers?.timezone || getCurrentTZName();

    try {
      const response = await remote().request({
        method: 'post',
        url: '/v2/confidence/locations',
        data: {
          start: 0,
          limit: 10,
        },
        headers: {
          accesstoken: req.user.accessToken,
          username: req.user.username,
          languagePreference: req.user.languagePreference,
          formatlocale: req.user.languagePreference,
          timezone: timezone,
        },
      });
      return response.data;
    } catch (error) {
      return false;
    }
  },
  getLocale: async (req) => {
    const { user = null } = req;

    const { headers = {} } = req;
    const timezone = headers?.timezone || getCurrentTZName();

    const userHeaders = user
      ? {
        accesstoken: user.accessToken,
        username: user.username,
        languagePreference: user.languagePreference,
        formatlocale: user.languagePreference,
      }
      : {};
    try {
      const response = await remote().request({
        method: 'get',
        url: '/localization/v1/content/static',
        headers: {
          ...userHeaders,
          timezone: timezone,
        },
      });
      return response.data;
    } catch (error) {
      return false;
    }
  },

  isLoggedIn: (req, res, next) => {
    if (req.isAuthenticated()) {
      return next();
    } else {
      return res.status(401).json({ message: 'Not Authenticated!' });
    }
  },

  prepareUser: (user) => {
    return {
      company: user.company,
      username: user.username,
      firstName: user.firstName,
      lastName: user.lastName,
      email: user.email,
      phone: user.phone,
      companyId: user.companyId,
      userType: user.userType,
      img: URLS.PROFILE_IMAGE(user.username),
      imgThumb: URLS.PROFILE_IMAGE_THUMB(user.username),
      isWorker: user.userType === 'Worker',
      isManager: user.userType === 'Manager',
      isOwner: user.userType === 'Owner',
    };
  },

  prepareUserFromService: (data) => {
    return {
      company: data.company,
      username: data.userName,
      firstName: data.firstName,
      lastName: data.lastName,
      email: data.email,
      phone: data.mobilePhone,
      companyId: data.companyId,
      userType: data.userType,
      accessToken: data.accessToken,
      languagePreference: data.languagePreference || 'en-US',
    };
  },
};

module.exports = services;
