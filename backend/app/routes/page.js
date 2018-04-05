var express = require('express');
var passport = require('passport');
var log = require(__base + 'libs/log')(module);
var router = express.Router();

var db = require(__base + 'libs/db/mongoose');
var Dashboard = require(__base + 'app/model/dashboard');
var Page = require(__base + 'app/model/page');

router.post('/', passport.authenticate('bearer', { session: false }), function (req, res) {

  console.log("Saving page");
  console.log(req.user.userId);
  console.log(req.body);
  console.log(req.query);
  console.log(req.params);
  
  if (req.body.page.dashboard == null) {
    res.statusCode = 500;
    log.error('Internal error(%d): %s',res.statusCode,"no dashboard given");
    return res.json({
      errors: ['No dashboard given']
    });
  }
  
  Dashboard.findOne({'userId': req.user.userId, '_id': req.body.page.dashboard}, null).
  populate({
    path: 'pages',
    populate: { path: 'components', model: 'Component'}
  }).
  exec(function (err, dashboards) {
    if (!err) {
      
      Page.create({
        dashboard: req.body.page.dashboard,
        name: req.body.page.name
      }).then((page) => {
        console.log(dashboards);
        console.log(page);
        dashboards.pages.push(page);
        dashboards.save().then(() => {
          return res.json({pages: page});
        });
      }).catch((error) => {
        res.statusCode = 500;
        log.error('Internal error(%d): %s',res.statusCode,error.message);
        return res.json({
          errors: ['Server error']
        });
      });
      
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

  console.log("Updating page");
  console.log(req.user.userId);
  console.log(req.body);
  console.log(req.query);
  console.log(req.params);
  
  Page.findOne({'_id': req.params.id}, null).
  populate({
    path: 'components'
  }).populate({
    path: 'dashboard'
  }).
  exec(function(err, page) {
    if (err) {
      res.statusCode = 500;
      log.error('Internal error(%d): %s',res.statusCode,err.message);
      return res.json({
        errors: ['Server error']
      });
    } else {
      
      if (page.dashboard.userId != req.user.userId) {
        console.log("Not your dashboard!");
        res.statusCode = 401;
        return res.json({
          errors: ['Not your dashboard']
        });
      }
      page.name = req.body.page.name;
      page.timeout = req.body.page.timeout;
      page.number = req.body.page.number;
      page.classes = req.body.page.classes;
      page.save().then(() => {
        page.dashboard = page.dashboard._id;
        return res.json({pages: page});
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

router.get('/:id', passport.authenticate('bearer', { session: false }), function (req, res) {

  var limit = req.query.limit || null;
  var offset = req.query.offset || null;

  console.log("Getting pages and components:");
  console.log(req.user.userId);

  Page.findOne({'_id': req.params.id}, null).
    populate({
      path: 'dashboard'
    }).populate({
      path: 'components'
    }).exec(function (err, page) {
    if (!err) {
      console.log(page);
      if (page.dashboard.userId != req.user.userId) {
        console.log("Not your dashboard!");
        res.statusCode = 401;
        return res.json({
          errors: ['Not your dashboard']
        });
      }
      console.log(JSON.stringify(page));
      page.dashboard = page.dashboard._id;
      return res.json({pages: page});
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

  console.log("Getting page:");
  console.log(req.user.userId);

  Page.findOne({'_id': req.params.id}, null).
    populate({
      path: 'dashboard'
    }).exec(function (err, page) {
    if (!err) {
      console.log(page);
      if (page.dashboard.userId != req.user.userId) {
        console.log("Not your dashboard!");
        res.statusCode = 401;
        return res.json({
          errors: ['Not your dashboard']
        });
      }
      console.log(JSON.stringify(page));
      page.remove().then((removed) => {
        console.log("removed");
        console.log(removed);
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


module.exports = router;
