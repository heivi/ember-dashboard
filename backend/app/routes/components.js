var express = require('express');
var passport = require('passport');
var log = require(__base + 'libs/log')(module);
var router = express.Router();

var db = require(__base + 'libs/db/mongoose');
var Dashboard = require(__base + 'app/model/dashboard');
var Page = require(__base + 'app/model/page');
var Component = require(__base + 'app/model/component');

router.post('/', passport.authenticate('bearer', { session: false }), function (req, res) {

  console.log("Saving component");
  console.log(req.user.userId);
  console.log(req.body);
  console.log(req.query);
  console.log(req.params);
  
  Page.findOne({'_id': req.body.component.page}, null).
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
      //console.log("Checking dashboard owner");
      //console.log(page.dashboard.userId);
      if (page.dashboard.userId != req.user.userId) {
        console.log("Not your dashboard!");
        res.statusCode = 401;;
        return res.json({
          errors: ['Not your dashboard']
        });
      }
      Component.create({
        page: page._id,
        name: req.body.component.name
      }).then((component) => {
        console.log(page);
        console.log(component);
        page.components.push(component);
        page.save().then(() => {
          return res.json({components: component});
        });
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

router.put('/:id', passport.authenticate('bearer', { session: false }), function (req, res) {

  console.log("Updating component");
  console.log(req.user.userId);
  console.log(req.body);
  console.log(req.query);
  console.log(req.params);
  
  Component.findOne({'_id': req.params.id}, null).
  populate({
    path: 'page',
    populate: { path: 'dashboard', model: 'Dashboard'}
  }).
  exec(function(err, component) {
    if (err) {
      res.statusCode = 500;
      log.error('Internal error(%d): %s',res.statusCode,err.message);
      return res.json({
        errors: ['Server error']
      });
    } else {
      if (component.page.dashboard.userId != req.user.userId) {
        console.log("Not your dashboard!");
        res.statusCode = 401;;
        return res.json({
          errors: ['Not your dashboard']
        });
      }
      component.height = req.body.component.height;
      component.width = req.body.component.width;
      component.minHeight = req.body.component.minHeight;
      component.minWidth = req.body.component.minWidth;
      component.name = req.body.component.name;
      component.public = req.body.component.public;
      component.type = req.body.component.type;
      component.page = req.body.component.page;
      component.componentData = req.body.component.componentData;
      component.triggers = req.body.component.triggers;
      component.classes = req.body.component.classes;
      component.save().then(() => {
        return res.json({components: component});
      }).catch((error) => {
        res.statusCode = 500;
        log.error('Internal error(%d): %s',res.statusCode,error.message);
        return res.json({
          errors: ['Server error']
        });
      });
      /*Component.create({
        page: page._id,
        name: req.body.component.name
      }).then((component) => {
        console.log(page);
        console.log(component);
        page.components.push(component);
        page.save().then(() => {
          return res.json({components: component});
        });
      }).catch((error) => {
        res.statusCode = 500;
        log.error('Internal error(%d): %s',res.statusCode,error.message);
        return res.json({
          errors: ['Server error']
        });
      })*/
    }
  });

});

router.get('/:id', passport.authenticate('bearer', { session: false }), function (req, res) {

  var limit = req.query.limit || null;
  var offset = req.query.offset || null;

  console.log("Getting component:");
  console.log(req.user.userId);

  Component.findOne({'_id': req.params.id}, null).
    populate({
      path: 'page',
      populate: { path: 'dashboard', model: 'Dashboard'}
    }).exec(function (err, component) {
    if (!err) {
      console.log(component);
      if (component.page.dashboard.userId != req.user.userId) {
        console.log("Not your dashboard!");
        res.statusCode = 401;
        return res.json({
          errors: ['Not your dashboard']
        });
      }
      console.log(JSON.stringify(component));
      component.page = component.page._id;
      return res.json({components: component});
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

  console.log("Getting component:");
  console.log(req.user.userId);

  Component.findOne({'_id': req.params.id}, null).
    populate({
      path: 'page',
      populate: { path: 'dashboard', model: 'Dashboard'}
    }).exec(function (err, component) {
    if (!err) {
      console.log(component);
      if (component.page.dashboard.userId != req.user.userId) {
        console.log("Not your dashboard!");
        res.statusCode = 401;
        return res.json({
          errors: ['Not your dashboard']
        });
      }
      console.log(JSON.stringify(component));
      component.page = component.page._id;
      component.remove().then((removed) => {
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
