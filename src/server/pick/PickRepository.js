var mongoose = require('mongoose');
var PickSchema = new mongoose.Schema({
	userId: 'string',
    gameId: 'string',
    pickId: 'string'
});
;
module.exports = mongoose.model('Pick', PickSchema)