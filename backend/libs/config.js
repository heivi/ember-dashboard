var nconf = require('nconf');

nconf.argv()
.env()
.file({
  file: __base + 'config.json'
});

module.exports = nconf;
