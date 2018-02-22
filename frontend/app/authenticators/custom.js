import { run } from '@ember/runloop';// instead of using Ember.run
import { Promise } from 'rsvp';// instead of using Ember.RSVP.Promise
//import Oauth2 from 'simple-auth/authenticators/oauth2';
//import OAuth2Bearer from 'ember-simple-auth/authorizers/oauth2-bearer';
import OAuth2PasswordGrantAuthenticator from 'ember-simple-auth/authenticators/oauth2-password-grant';
import config from '../config/environment';

//const { getOwner } = Ember;

export default OAuth2PasswordGrantAuthenticator.extend({
  provider: 'facebook-connect',
  authenticate: function() {
    var _this = this;
    return new Promise(function(resolve, reject) {
      _this.torii.open(_this.provider).then(function(data) {
        //Ember.Logger.log(data);
        var _data = {
          facebook_auth_code: data.accessToken
        };
        // TODO: why settings not effective?
        //_this.makeRequest(_this.serverTokenEndpoint, _data).then(function(response) {
        //_this.makeRequest("http://localhost:1337/api/auth/facebook", _data).then(function(response) {
        _this.makeRequest(config['simple-auth-oauth2'].serverTokenEndpoint, _data).then(function(response) {
          run(function() {
            console.log(response);
            // still available?
            // TODO: see https://github.com/simplabs/ember-simple-auth/blob/master/addon/authenticators/oauth2-password-grant.js
            //var expiresAt = _this.absolutizeExpirationTime(response.expires_in);
            // not function
            //_this.scheduleAccessTokenRefresh(response.expires_in, expiresAt, response.refresh_token);
            /*if (!Ember.isEmpty(expiresAt)) {
              response = Ember.merge(response, {
                expires_at: 3600
              });
            }*/
            resolve(response);
          });
        }, function(xhr/*, status, error*/) {
          run(function() {
            reject(xhr.responseJSON || xhr.responseText);
          });
        });
      }, reject);
    });
  }
});