var passport = require('passport');
var BearerStrategy = require('passport-http-bearer').Strategy;

var config = require(__base + 'libs/config');

var User = require(__base + 'app/model/user');

var AccessToken = require(__base + 'app/model/accessToken');

passport.use(new BearerStrategy(
  // ...url...?access_token=<accessToken>
  function(access_token, done) {
    console.log("Finding token: "+access_token);
    AccessToken.findOne({ token: access_token }).populate('userId').exec(function(err, token) {

      console.log("Found: "+JSON.stringify(token));
      if (err) {
        return done(err);
      }

      if (!token) {
        return done(null, false);
      }

      if( Math.round((Date.now()-token.created)/1000) > config.get('security:tokenLife') ) {

        AccessToken.remove({ token: access_token }, function (err) {
          if (err) {
            return done(err);
          }
        });

        return done(null, false, { message: 'Token expired' });
      }

      if (token.userId != null) {
        if (token.userId.scope != null) {
          done(null, token.userId, {scope: token.userId.scope});
        } else {
          done(null, token.userId, {scope: 'basic'});
        }
      } else {
        return done(null, false, {message: "Unknown user"});
      }

    });
  }
));
