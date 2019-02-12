const mongoose = require('mongoose');
const UserSchema = new mongoose.Schema({
    authServiceId: String,
    email: String,
    firstName: String,
    lastName: String,
    picture: String
});
module.exports = mongoose.model('User', UserSchema);