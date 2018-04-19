var express = require('express');
var passport = require('passport');
var log = require(__base + 'libs/log')(module);
var router = express.Router();

var db = require(__base + 'libs/db/mongoose');
var User = require(__base + 'app/model/user');

router.get('/info', passport.authenticate('bearer', { session: false }), function(req, res) {
  // req.authInfo is set using the `info` argument supplied by
  // `BearerStrategy`.  It is typically used to indicate scope of the token,
  // and used in access control checks.  For illustrative purposes, this
  // example simply returns the scope in the response.
  res.json({
    user_id: req.user.userId,
    name: req.user.username,
    scope: req.authInfo.scope
  });
});

router.get('/', passport.authenticate('bearer', { session: false }), function (req, res) {

  var limit = req.query.limit || null;
  var offset = req.query.offset || null;

  //console.log("Getting users:");

  var count = User.find({}, '_id').count(function(err, count) {
    //console.log(count);

    // TODO: not too performant on large collections, limit by using eg. createdOn > x
    User.find({}, '_id, name').skip(offset).limit(limit).exec(function (err, users) {
      if (!err) {
        //console.log("Returning users: "+users);
        return res.json({user: users, meta: {total: count}});
      } else {
        res.statusCode = 500;

        log.error('Internal error(%d): %s',res.statusCode,err.message);

        return res.json({
          status: 'error',
          error: 'Server error'
        });
      }
    });
  });
});

router.post('/', passport.authenticate('bearer', { session: false }), function(req, res) {

  //console.log(req.authInfo);

  if (!req.authInfo || req.authInfo.scope != "*" || req.authInfo.scope != "admin") {
    console.log("No right to create user");
    res.statusCode = 401;
    res.json({error: "No permission to create user"});
    return;
  }

  var user = new User(req.body.user);

  user.save(function (err) {
    if (!err) {
      log.info("New user created with id: %s", user.id);
      return res.json({
        status: 'OK',
        user: user
      });
    } else {
      if(err.name === 'ValidationError') {
        res.statusCode = 400;
        res.json({
          status: 'error',
          error: 'Validation error: '+err.message
        });
      } else {
        res.statusCode = 500;
        res.json({
          status: 'error',
          error: 'Server error: '+err.message
        });
      }
      log.error('Internal error (%d): %s', res.statusCode, err.message);
    }
  });
});

router.get('/:id', passport.authenticate('bearer', { session: false }), function (req, res) {

  var fields = "_id, name, username";

  if (req.user._id == req.params.id || req.authInfo.scope == "admin") {
    fields = null;
  }

  User.findOne({ _id: req.params.id }, fields).populate('_id').exec(function (err, user) {
    if (!err) {
      return res.json({user: user});
    } else {
      res.statusCode = 500;

      log.error('Internal error(%d): %s',res.statusCode,err.message);

      return res.json({
        status: 'error',
        error: 'Server error'
      });
    }
  });
});

module.exports = router;
