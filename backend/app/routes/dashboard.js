var express = require('express');
var passport = require('passport');
var log = require(__base + 'libs/log')(module);
var router = express.Router();

var db = require(__base + 'libs/db/mongoose');
var Dashboard = require(__base + 'app/model/dashboard');
var Page = require(__base + 'app/model/page');

router.get('/', passport.authenticate('bearer', { session: false }), function (req, res) {

  var limit = req.query.limit || null;
  var offset = req.query.offset || null;

  //console.log("Getting pages and components:");
  //console.log(req.user.userId);

  Dashboard.find({'userId': req.user.userId}, null).
    populate({
      path: 'pages',
      populate: { path: 'components', model: 'Component'}
    }).exec(function (err, dashboards) {
    if (!err) {
      //console.log(dashboards);
      return res.json({dashboards: dashboards});
      //return res.json({data: dashboards, meta: {}});
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

  //console.log("Saving dashboard");
  //console.log(req.user.userId);
  //console.log(req.body);
  //console.log(req.query);
  
  if (req.body.dashboard.name == null) {
    res.statusCode = 500;
    return res.json({
      errors: ["No name given"]
    });
  }
  
  Dashboard.create({
    'userId': req.user.userId,
    'name': req.body.dashboard.name
  }, function(err, dash) {
    if (err) {
      res.statusCode = 500;
      log.error('Internal error(%d): %s',res.statusCode,err.message);
      return res.json({
        errors: [err.message]
      });
    } else {
      return res.json({
        dashboard: dash
      });
    }
  });

});

router.get('/:id', passport.authenticate('bearer', { session: false }), function (req, res) {

  var limit = req.query.limit || null;
  var offset = req.query.offset || null;

  //console.log("Getting pages and components:");
  //console.log(req.user.userId);

  Dashboard.find({'userId': req.user.userId, '_id': req.params.id}, null).
    populate({
      path: 'pages',
      populate: { path: 'components', model: 'Component'}
    }).exec(function (err, dashboards) {
    if (!err) {
      //console.log(JSON.stringify(dashboards));
      return res.json({dashboards: dashboards});
      //return res.json({data: dashboards, meta: {}});
    } else {
      res.statusCode = 500;
      log.error('Internal error(%d): %s',res.statusCode,err.message);
      return res.json({
        errors: ['Server error']
      });
    }
  });
});

router.delete('/:id', passport.authenticate('bearer', { session: false }), function (req, res) {

  var limit = req.query.limit || null;
  var offset = req.query.offset || null;

  //console.log("Getting page:");
  //console.log(req.user.userId);

  Dashboard.findOne({'userId': req.user.userId, '_id': req.params.id}, null).
    exec(function (err, dash) {
    if (!err) {
      dash.remove().then((removed) => {
        //console.log("removed");
        //console.log(removed);
        return res.json({});
      });
      //return res.json({components: component});
      //return res.json({data: dashboards, meta: {}});
    } else {
      res.statusCode = 500;
      log.error('Internal error(%d): %s',res.statusCode,err.message);
      return res.json({
        errors: ['Server error']
      });
    }
  });
});

router.put('/:id', passport.authenticate('bearer', { session: false }), function (req, res) {

  //console.log("Updating dashboard");
  //console.log(req.user.userId);
  //console.log(req.body);
  //console.log(req.query);
  //console.log(req.params);
  
  Dashboard.findOne({'userId': req.user.userId, '_id': req.params.id}, null).
  populate({
    path: 'pages'
  }).
  exec(function(err, dash) {
    if (err) {
      res.statusCode = 500;
      log.error('Internal error(%d): %s',res.statusCode,err.message);
      return res.json({
        errors: ['Server error']
      });
    } else {
      
      
      dash.name = req.body.dashboard.name;
      
      dash.save().then(() => {
        return res.json({dashboards: dash});
      }).catch((error) => {
        res.statusCode = 500;
        log.error('Internal error(%d): %s',res.statusCode,error.message);
        return res.json({
          errors: ['Server error']
        });
      });
    }
  });
});

module.exports = router;
