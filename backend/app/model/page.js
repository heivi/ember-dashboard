var mongoose = require('mongoose');
var Schema = mongoose.Schema;

// Page
var Page = new Schema({
  created: {
    type: Date,
    default: Date.now
  },
  components: [{
    type: Schema.Types.ObjectId,
    ref: 'Component'
  }]
});

module.exports = mongoose.model('Page', Page);
