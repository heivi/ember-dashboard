var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var renameIdPlugin = require('mongoose-rename-id');


// component
var Component = new Schema({
  created: {
    type: Date,
    default: Date.now
  },
  minWidth: Number,
  minHeight: Number,
  width: Number,
  height: Number,
  type: String,
  componentData: {},
  name: String,
  public: Boolean,
  triggers: {},
  
});

Component.plugin(renameIdPlugin({newIdName: 'id'}));

module.exports = mongoose.model('Component', Component);
