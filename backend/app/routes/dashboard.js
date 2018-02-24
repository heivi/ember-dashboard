var express = require('express');
var passport = require('passport');
var log = require(__base + 'libs/log')(module);
var router = express.Router();

var db = require(__base + 'libs/db/mongoose');
var Dashboard = require(__base + 'app/model/dashboard');

router.get('/', passport.authenticate('bearer', { session: false }), function (req, res) {

  var limit = req.query.limit || null;
  var offset = req.query.offset || null;

  console.log("Getting pages and components:");
  console.log(req.user.userId);

  Dashboard.find({'userId': req.user.userId}, null).
    populate({
      path: 'pages',
      populate: { path: 'components'}
    }).exec(function (err, dashboards) {
    if (!err) {
      return res.json({data: dashboards, meta: {}});
    } else {
      res.statusCode = 500;
      log.error('Internal error(%d): %s',res.statusCode,err.message);
      return res.json({
        errors: ['Server error']
      });
    }
  });
});

router.post('/', passport.authenticate('bearer', { session: false }), function (req, res) {

  console.log("Saving dashboard");
  console.log(req.user.userId);
  console.log(req.body);
  console.log(req.query);
  
  Dashboard.create({
    'user-id': req.user.userId,
    'name': req.body.data.attributes.name
  }, function(err, dash) {
    if (err) {
      res.statusCode = 500;
      log.error('Internal error(%d): %s',res.statusCode,err.message);
      return res.json({
        errors: [err.message]
      });
    } else {
      return res.json({
        data: dash,
        meta: {}
      });
    }
  });

});

module.exports = router;
