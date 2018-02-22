export default {
  name: 'torii-session-authenticators',
  after: 'torii-session',
  initialize: function(app) {
    //app.inject('authenticators', 'session', 'torii:session');
    app.inject('authenticator:custom', 'torii', 'service:torii');
  }
};