var mongoose = require('mongoose');
var PickSchema = new mongoose.Schema({
    gameId: String,
    userId: String,
    pickId: String
});
mongoose.model('Pick', PickSchema);
module.exports = mongoose.model('Pick');