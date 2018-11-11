import mongoose from 'mongoose';
import settings from '../../env.json';

mongoose.Promise = global.Promise;

const options = {
  socketTimeoutMS: settings.MONGO_TIMEOUT,
  connectTimeoutMS: settings.MONGO_TIMEOUT,
  keepAlive: true,
  reconnectTries: 30,
  useNewUrlParser: true
};

export function connect(mongoURI) {
  return new Promise((resolve, reject) => {
    mongoose.connect(mongoURI, options);
    mongoose.connection.once('open', () => {
      console.log('Connected to MongoDB instance.');
      resolve();
    }).on('error', error => {
      console.log('Error connecting to MongoDB:', error);
    });
  });
}
