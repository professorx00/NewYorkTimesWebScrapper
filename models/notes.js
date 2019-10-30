const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const UserSchema =  new mongoose.Schema({
  note:{
    type: String,
    require: true,
    unique: true
  },
  articles:[{
    type: Schema.Types.ObjectId,
    ref: "ScrappedData"
  }],
  user:[{
    type: Schema.Types.ObjectId,
    ref: "User"
  }]
})

const User = mongoose.model('User', UserSchema);

module.exports = User;