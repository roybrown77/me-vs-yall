var mongoose = require('mongoose');
var UserSchema = new mongoose.Schema({
    authServiceId: String,
    email: String,
    firstName: String,
    lastName: String
});
module.exports = mongoose.model('User', UserSchema);