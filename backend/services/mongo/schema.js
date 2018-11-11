import mongoose from 'mongoose';
import {now} from '../../../utils';

const util = require('util');
// MongoDB Schema
// schema structure see - http://mongoosejs.com/docs/2.7.x/docs/schematypes.html

// BaseSchema that is shared by all objects
function BaseSchema () {
  mongoose.Schema.apply(this, arguments);
  this.add({
    createdOn: {type: Date, required: true},
    createdBy: {type: String, required: true},
    updatedOn: {type: Date, required: true},
    updatedBy: {type: String, required: true}
  });

  this.pre('validate', function (next) {
    this.updatedOn = now();
    if (!this.createdOn) {
      this.createdOn = now();
    }
    next();
  });
}

util.inherits(BaseSchema, mongoose.Schema);

const ObjectId = mongoose.Schema.Types.ObjectId;

const UserSchema = new BaseSchema({
  _id: {type: String, required: true},
  name: {type: String, required: true},
  accessToken: {type: String},
  instagramName: {type: String},
  twitterName: {type: String},
  googleName: {type: String},
  facebookName: {type: String},
  email: {type: String},
  picture: {type: String},
  username: {type: String},
  hashtags: [{
    name: { type: String},
    amount: { type: Number},
    platforms:  { type: Number}
  }]
});

const TransactonSchema = new BaseSchema({
  _id: {type: String, required: true},
  userId: {type: String, required: true},
  action: {type: String},
  actionDatetime: {type: Date},
  platform: {type: String},
  hashtag: {type: String},
  fromAccount: {type: String},
  toAccount: {type: String},
  amount: {type: Number},
  metadata: {type: Object}
});

// Add schema to mongoose instance
const User = mongoose.model('User', UserSchema, 'users');
const Transaction = mongoose.model('Transaction', TransactonSchema, 'transactions');

export default {
  User,
  Transaction
};
