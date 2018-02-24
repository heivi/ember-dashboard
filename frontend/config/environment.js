'use strict';

module.exports = function(environment) {
  let ENV = {
    modulePrefix: 'dashboard',
    environment,
    rootURL: '/',
    locationType: 'auto',
    EmberENV: {
      FEATURES: {
        // Here you can enable experimental features on an ember canary build
        // e.g. 'with-controller': true
      },
      EXTEND_PROTOTYPES: {
        // Prevent Ember Data from overriding Date.parse.
        Date: false
      }
    },

    APP: {
      // Here you can pass flags/options to your application instance
      // when it is created
    },
    
    // TODO: set proper CSP
    contentSecurityPolicy: {
      'default-src': "*",
      'script-src': "'self' 'unsafe-inline' 'unsafe-eval' *",
      'font-src': "'self' *",
      'connect-src': "'self' *",
      'img-src': "'self' *",
      'report-uri':"'localhost' *",
      'style-src': "'self' 'unsafe-inline' *",
      'frame-src': "*"
    },
    
    'simple-auth': {
      authorizer: 'simple-auth-authorizer:oauth2-bearer',
      authenticationRoute: '/login',
      routeAfterAuthentication: 'index',
      crossOriginWhitelist: [
        "http://localhost:1337"
      ]
    },

    'simple-auth-oauth2': {
      serverTokenEndpoint: "http://localhost:1337/api/auth/facebook"
    },

    host: 'http://localhost:1337',
    
    torii: {
      sessionServiceName: 'session',
      providers: {
        'facebook-connect': {
          appId: process.env.FACEBOOK_APP_ID,
          scope: 'email',
          version: 'v2.12'
        }
      }
    }
  };

  if (environment === 'development') {
    // ENV.APP.LOG_RESOLVER = true;
    // ENV.APP.LOG_ACTIVE_GENERATION = true;
    // ENV.APP.LOG_TRANSITIONS = true;
    // ENV.APP.LOG_TRANSITIONS_INTERNAL = true;
    // ENV.APP.LOG_VIEW_LOOKUPS = true;
  }

  if (environment === 'test') {
    // Testem prefers this...
    ENV.locationType = 'none';

    // keep test console output quieter
    ENV.APP.LOG_ACTIVE_GENERATION = false;
    ENV.APP.LOG_VIEW_LOOKUPS = false;

    ENV.APP.rootElement = '#ember-testing';
    ENV.APP.autoboot = false;
  }

  if (environment === 'production') {
    // here you can enable a production-specific feature
  }

  return ENV;
};
