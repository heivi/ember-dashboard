var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var renameIdPlugin = require('mongoose-rename-id');


// component
var Component = new Schema({
  created: {
    type: Date,
    default: Date.now
  },
  minWidth: String,
  minHeight: String,
  width: String,
  height: String,
  type: String,
  componentData: {},
  name: String,
  public: Boolean,
  classes: String,
  triggers: {},
  page: {
    type: Schema.Types.ObjectId,
    ref: 'Page'
  }
});

Component.plugin(renameIdPlugin({newIdName: 'id'}));

module.exports = mongoose.model('Component', Component);
