var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var renameIdPlugin = require('mongoose-rename-id');

// Dashboard
var Dashboard = new Schema({
  // omistaja
  userId: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  name: { type: String },
  pages: [{
    type: Schema.Types.ObjectId,
    ref: 'Page'
  }],
  created: {
    type: Date,
    default: Date.now
  }
});

Dashboard.plugin(renameIdPlugin({newIdName: 'id'}));

module.exports = mongoose.model('Dashboard', Dashboard);
