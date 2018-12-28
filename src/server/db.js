var mongoose = require('mongoose');
mongoose.Promise = global.Promise;
mongoose.connect('mongodb://admin:9gidget9@ds129183.mlab.com:29183/mevsyall-dev', { useNewUrlParser: true });