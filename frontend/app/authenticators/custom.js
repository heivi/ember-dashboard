import { run } from '@ember/runloop';// instead of using Ember.run
import { Promise } from 'rsvp';// instead of using Ember.RSVP.Promise
import { isEmpty } from '@ember/utils';
import RSVP from 'rsvp';
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
        var _data = {
          facebook_auth_code: data.accessToken
        };
        _this.makeRequest(config['simple-auth-oauth2'].serverTokenEndpoint, _data).then(function(response) {
          run(function() {
            resolve(response);
          });
        }, function(xhr/*, status, error*/) {
          run(function() {
            reject(xhr.responseJSON || xhr.responseText);
          });
        });
      }, reject);
    });
  },
  invalidate(data) {
    const serverTokenRevocationEndpoint = this.get('serverTokenRevocationEndpoint');
    function success(resolve) {
      run.cancel(this._refreshTokenTimeout);
      delete this._refreshTokenTimeout;
      resolve();
    }
    return new RSVP.Promise((resolve) => {
      // logout of FB
      FB.logout((resp) => {});
      if (isEmpty(serverTokenRevocationEndpoint)) {
        success.apply(this, [resolve]);
      } else {
        const requests = [];
        A(['access_token', 'refresh_token']).forEach((tokenType) => {
          const token = data[tokenType];
          if (!isEmpty(token)) {
            requests.push(this.makeRequest(serverTokenRevocationEndpoint, {
              'token_type_hint': tokenType, token
            }));
          }
        });
        const succeed = () => {
          success.apply(this, [resolve]);
        };
        RSVP.all(requests).then(succeed, succeed);
      }
    });
  }
});