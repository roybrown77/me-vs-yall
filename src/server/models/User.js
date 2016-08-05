/**
 * Created by roy.brown on 7/31/2016.
 */
var mongoose     = require('mongoose');
var UserSchema   =  mongoose.Schema({
    email: String,
    password: String,
    token: String
});
module.exports = mongoose.model('User', UserSchema);