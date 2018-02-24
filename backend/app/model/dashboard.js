var mongoose = require('mongoose');
var Schema = mongoose.Schema;

// Dashboard
var Dashboard = new Schema({
  // omistaja
  'user-id': {
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

module.exports = mongoose.model('Dashboard', Dashboard);
