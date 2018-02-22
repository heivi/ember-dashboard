var mongoose = require('mongoose'),

Schema = mongoose.Schema;

var membershipSchema = new Schema({
    provider:  String,
    providerUserId:  String,
    accessToken: String,
    userId: {type: Schema.Types.ObjectId, ref: 'User'},
    dateAdded: {type: Date, default: Date.now}
});

module.exports = mongoose.model('Membership', membershipSchema);
