var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var passport = require('passport');
var methodOverride = require('method-override');

require('dotenv').config()

require(__base + 'libs/auth/auth');

var config = require(__base + 'libs/config');
var log = require(__base + 'libs/log')(module);
var oauth2 = require(__base + 'libs/auth/oauth2');

var api = require(__base + 'app/routes/api');
var users = require(__base + 'app/routes/users');
var auth = require(__base + 'app/routes/auth');
var dashboard = require(__base + 'app/routes/dashboard');
var page = require(__base + 'app/routes/page');
var component = require(__base + 'app/routes/components');

var app = express();

app.use(bodyParser.json());
app.use(bodyParser.json({ type: 'application/vnd.api+json' }));
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(methodOverride());
app.use(passport.initialize());

// enable CORS http://stackoverflow.com/questions/11181546/how-to-enable-cross-origin-resource-sharing-cors-in-the-express-js-framework-o
app.all('*', function(req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Methods", "PUT, GET, POST, DELETE, OPTIONS");
  res.header("Access-Control-Allow-Resource", "*");
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept, Authorization");
  next();
});

app.use('/', api);
app.use('/api', api);
app.use('/api/users', users);
app.use('/api/auth', auth);
app.use('/api/dashboards', dashboard);
app.use('/api/pages', page);
app.use('/api/components', component);

// catch 404 and forward to error handler
app.use(function(req, res, next){

  if (req.method == "options") {
    res.send(200);
    return;
  }

  res.status(404);
  log.debug('%s %d %s', req.method, res.statusCode, req.url);
  res.json({
    error: 'Not found'
  });
  return;
});

// error handlers
app.use(function(err, req, res, next){
  res.status(err.status || 500);
  log.error('%s %d %s', req.method, res.statusCode, err.message);
  res.json({
    error: err.message
  });
  return;
});

module.exports = app;
