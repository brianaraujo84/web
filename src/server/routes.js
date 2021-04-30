const express = require('express');
const passport = require('passport');
const axios = require('axios');

const {
  standardService,
  call,
  isLoggedIn,
  call: serviceCall,
  prepareUser,
  prepareUserFromService,
} = require('./services');


const { uploadFile } = require('./dropbox-services');

const Paths = require('./paths');
const variables = require('./variables');
const filesRoutes = require('./files-routes');

const router = express.Router();
router.use('/files', filesRoutes);

// const isLoggedIn = (req, res, next) => {
//   if (req.isAuthenticated()) {
//     return next();
//   } else {
//     return res.status(401).json({ message: 'Not Authenticated!' });
//   }
// };

//////////////// AUTH SERVICES /////////////////////

router.post('/login', (req, res, next) => {
  passport.authenticate('local', (err, user, data) => {
    if (err) { return next(err); }

    if (!user) {
      return res.status(403).json(data);
    }
    req.logIn(user, (err) => {
      if (err) {
        return next(err);
      }
      const responseData = {
        message: 'Logged in successfull',
      };
      return res.json(responseData);
    });
  })(req, res, next);
});

router.get('/get-user-data', isLoggedIn, (req, res) => {
  const { user } = req;
  res.json({ ...user });
});

router.post('/v1/logout', (req, res) => {
  const ret = standardService(req, res);
  req.logout();
  return ret;
});
router.post('/v1/confidence/user', async (req, res) => {
  const { body: rawBody = {}, user = {} } = req;
  const { img, ...body } = rawBody;
  const { username } = user;
  const { firstName, lastName, email } = body;
  const newReq = { ...req, body };
  const ret = await standardService(newReq, res);

  req.session.passport.user.firstName = firstName;
  req.session.passport.user.lastName = lastName;
  req.session.passport.user.email = email;
  req.session.save();
  if (img) {
    const { extension, content } = img;
    const folder = Paths.profile(username);
    const fileName = `image.${extension}`;
    const path = `${folder}/${fileName}`;
    try {
      await uploadFile(path, Buffer.from(content, 'base64'));
    } catch (error) {
      return res.status(400).send({ error });
    }
  }
  return ret;
});
router.get('/v1/confidence/user', async (req, res) => {
  const { url, method, body, user = {}, headers = {} } = req;
  const { accessToken, username, languagePreference } = user;
  try {
    const response = await call(url, method, body, accessToken, username, languagePreference, undefined, headers);

    const { status, data } = response;
    const user = prepareUserFromService(data);
    for (const [key, value] of Object.entries(user)) {
      if (value !== undefined) {
        req.session.passport.user[key] = value;
      }
    }
    req.session.save();
    return res.status(status).json(prepareUser(user));

  } catch (error) {
    const { status, data } = error;
    if (status === 404) {
      return res.status(status).json({ message: 'Unknown API!' });
    }
    return res.status(status).send(data);
  }
});

router.get('/get-location-by-zip', async (req, res) => {
  const { zip } = req.query;
  const url = `https://maps.googleapis.com/maps/api/geocode/json?components=postal_code:${zip}&key=${variables.google_api_key}`;
  try {
    const { data } = await axios.get(url);
    if (data.status === 'OK') {
      const { location } = data.results[0].geometry;
      res.json(location);
    }
    res.status(400).json({ message: 'Unable to find!' });
  } catch (e) {
    res.status(400).json({ message: 'Unable to connect!' });
  }
});

const openServices = [
  // '/v1/confidence/manage/user',
  // '/v1/confidence/manage/user',
  '/v1/validatePasscode',
  '/v1/user/forgotpassword',
  '/v1/user/confirmforgotpassword',
  '/v1/confidence/usertype',
  '/localization/v1/content/static',
];

router.post('/v1/confidence/manage/user', async (req, res) => {
  const { url, method, body, headers = {} } = req;

  const { img, ...reqBody } = body;

  try {
    const response = await serviceCall(url, method, reqBody, null, null, true, headers);
    // const response = { status: 200, data: {} };
    const { status, data } = response;
    if (img && data && data.userName) {
      const { extension, content } = img;
      const folder = Paths.profile(data.userName);
      const fileName = `image.${extension}`;
      const path = `${folder}/${fileName}`;
      try {
        await uploadFile(path, Buffer.from(content, 'base64'));
      } catch (error) {
        return res.status(400).send({ error });
      }
    }

    return res.status(status).json(data);
  } catch (error) {
    const { status, data } = error;
    if (status === 404) {
      return res.status(status).json({ message: 'Unknown API!' });
    }
    return res.status(status).send(data);
  }

});

router.all(openServices, async (req, res) => {
  return standardService(req, res, true);
});

router.all('/*', isLoggedIn, async (req, res) => {
  return standardService(req, res);
});

module.exports = router;
