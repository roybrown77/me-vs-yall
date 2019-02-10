const mongoose = require('mongoose');

mongoose.Promise = global.Promise;

const options = {
  useNewUrlParser: true, // use new connection string parser
  autoIndex: false, // Don't build indexes
  reconnectTries: 100, // Never stop trying to reconnect
  reconnectInterval: 500, // Reconnect every 500ms
  poolSize: 10, // Maintain up to 10 socket connections
  bufferMaxEntries: 0 // If not connected, return errors immediately rather than waiting for reconnect
};

mongoose.connect('mongodb://admin:9gidget9@ds129183.mlab.com:29183/mevsyall-dev',options).then(
	() => {
    console.log("connected to mongoDB")
  },
 	(err) => {
    onsole.log("err",err);
  }
);

// const mongoose = require('mongoose');

// mongoose.Promise = global.Promise;

// const options = {
//     useNewUrlParser: true, // use new connection string parser
//     autoIndex: false, // Don't build indexes
//     reconnectTries: 100, // Retry up to 100 times
//     reconnectInterval: 500, // Reconnect every 500ms
//     poolSize: 20, // Maintain up to 10 socket connections
//     bufferMaxEntries: 0 // If not connected, return errors immediately rather than waiting for reconnect
// };

// const connectWithRetry = () => {
//   console.log('MongoDB connection with retry');
//   mongoose.connect("mongodb://admin:9gidget9@ds129183.mlab.com:29183/mevsyall-dev", options).then(()=>{
//     console.log('MongoDB is connected');
//   }).catch(err=>{
//     console.log('MongoDB connection unsuccessful, retry after 5 seconds.');
//     setTimeout(connectWithRetry, 5000);
//   });
// };

// connectWithRetry();