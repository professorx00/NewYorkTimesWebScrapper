const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const UserSchema =  new mongoose.Schema({
  name:{
    type: String,
    require: true,
    unique: true
  },
  email:{
    type: String,
    require: true
  },
  password:{
    type: String,
    require: true
  },
  date:{
    type: Date,
    default: Date.now
  },
  articles:[{
    type: Schema.Types.ObjectId,
    ref: "ScrappedData"
  }]
})

const User = mongoose.model('User', UserSchema);

module.exports = User;