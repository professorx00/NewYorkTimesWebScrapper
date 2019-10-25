const mongoose = require('mongoose');

const ScrapppedDataSchema =  new mongoose.Schema({
  title:{
    type: String,
    require: true
  },
  link:{
    type: String,
    require: true
  },
  date:{
    type: Date,
    default: Date.now
  }
})

const ScrapppedData = mongoose.model('ScrappedData', ScrapppedDataSchema);

module.exports = ScrapppedData;