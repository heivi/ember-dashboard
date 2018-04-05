var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var renameIdPlugin = require('mongoose-rename-id');

// Page
var Page = new Schema({
  created: {
    type: Date,
    default: Date.now
  },
  components: [{
    type: Schema.Types.ObjectId,
    ref: 'Component'
  }],
  number: {
    type: Number,
    default: 0
  },
  dashboard: {
    type: Schema.Types.ObjectId,
    ref: 'Dashboard'
  },
  name: {
    type: String
  }
});

Page.plugin(renameIdPlugin({newIdName: 'id'}));

module.exports = mongoose.model('Page', Page);
