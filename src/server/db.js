var mongoose = require('mongoose');
mongoose.Promise = global.Promise;
//mongoose.connect('mongodb://admin:7ginger7@ds111123.mlab.com:11123/mevsyall', { useMongoClient: true });
//mongoose.connect('mongodb://' + process.env.db_username + ':' + process.env.db_password + '@ds129183.mlab.com:29183/mevsyall-dev', { useMongoClient: true });
mongoose.connect('mongodb://admin:9gidget9@ds129183.mlab.com:29183/mevsyall-dev', { useMongoClient: true });