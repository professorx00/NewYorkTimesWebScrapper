const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const ScrappedDataSchema =  new mongoose.Schema({
  title:{
    type: String,
    require: true
  },
  link:{
    type: String,
    require: true
  },
  titleData:{
    type: String,
    require: true
  },
  date:{
    type: Date,
    default: Date.now
  }
})

const ScrappedData = mongoose.model('ScrappedData', ScrappedDataSchema);

module.exports = ScrappedData;