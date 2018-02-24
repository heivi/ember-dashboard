var mongoose = require('mongoose');
var Schema = mongoose.Schema;

// component
var Component = new Schema({
  created: {
    type: Date,
    default: Date.now
  },
  min-width: Number,
  min-height: Number,
  width: Number,
  height: Number,
  type: String,
  data: {},
  name: String,
  public: Boolean,
  triggers: {},
  
});

module.exports = mongoose.model('Component', Component);
