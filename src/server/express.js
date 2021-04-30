const express = require('express');
const session = require('express-session');
const bodyParser = require('body-parser');
const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const { getLocations, getLocale, prepareUser, prepareUserFromService } = require('./services');

const remote = require('./remote');

const SETTINGS = require('./settings');
const variables = require('./variables');

module.exports = (app) => {
  app.set('view engine', 'ejs');
  app.set('views', 'dist');

  app.use(bodyParser.urlencoded({ extended: true, limit: '50mb', parameterLimit: 50000 }));
  app.use(bodyParser.json({ limit: '50mb' }));

  // express session middleware setup
  app.use(session({
    secret: SETTINGS.SECRET,
    resave: false,
    saveUninitialized: false
  }));

  app.use(passport.initialize());
  app.use(passport.session());

  passport.use(new LocalStrategy(
    async (userName, password, done) => {
      try {
        const response = await remote().request({
          method: 'POST',
          url: '/v1/authenticate',
          data: { userName, password },
        });

        const { data } = response;
        const user = prepareUserFromService(data);
        if (!data.accessToken) {
          return done(null, false, { message: 'Internal error!' });
        }
        return done(null, user);
      } catch (e) {
        return done(null, false, e.data);
      }
    }
  ));

  passport.serializeUser((user, done) => {
    done(null, user);
  });

  passport.deserializeUser((user, done) => {
    done(null, user);
  });

  const cacheTime = 2592000000;

  app.use(express.static('dist', {
    maxAge: cacheTime,
  }));

  app.use('/assets', express.static('assets', {
    maxAge: cacheTime,
  }));

  const routes = require('./routes');
  app.use('/api', routes);

  app.use('/favicon.ico', express.static('assets/img/icons/favicon.ico', {
    maxAge: cacheTime,
  }));

  app.get('*', async (req, res) => {
    const { user = {} } = req;
    const userProfile = {
      loggedIn: req.isAuthenticated(),
      data: prepareUser(user),
    };
    const locations = await getLocations(req);
    const userLocations = {
      error: false,
      items: locations && locations.locations ? locations.locations : [],
      total: locations.numberOfLocations,
    };
    // Prepare client preferred language data
    const { locale, data = [] } = await getLocale(req);
    const localeReducer = (acc, [key, value]) => ({ ...acc, [key]: value });
    const localeDataMap = data.reduce(localeReducer, {});
    // Produce index.hml and send it back to client
    res.render('index', {
      ...variables,
      userProfile,
      userLocations,
      translations: { locale, data: localeDataMap },
    });
  });

  app.listen(SETTINGS.PORT, () => {
    console.log(`App prod listening to ${SETTINGS.PORT}....`); // eslint-disable-line no-console
    console.log('Press Ctrl+C to quit.'); // eslint-disable-line no-console
  });
};
