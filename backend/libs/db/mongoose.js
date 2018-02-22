var mongoose = require('mongoose');

var log = require(__base + 'libs/log')(module);
var config = require(__base + 'libs/config');

mongoose.connect(config.get('mongoose:uri'));

var db = mongoose.connection;

db.on('error', function (err) {
  log.error('Connection error:', err.message);
});

db.once('open', function callback () {
  log.info("Connected to DB!");
});

module.exports = mongoose;
