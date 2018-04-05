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
    path: 'components',
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
      })
    }
  });

});

module.exports = router;
