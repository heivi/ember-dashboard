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
  
  Dashboard.findOne({'userId': req.user.userId, '_id': req.params.id}, null).
  exec(function (err, dashboards) {
    if (!err) {
      
      Page.create().then((page) => {
        console.log(dashboards);
        dashboards.pages.push(page);
        dashboards.save().then(() => {
          return res.json({dashboards: dashboards});
        });
      }).catch((error) => {
        res.statusCode = 500;
        log.error('Internal error(%d): %s',res.statusCode,err.message);
        return res.json({
          errors: ['Server error']
        });
      }));
      
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
