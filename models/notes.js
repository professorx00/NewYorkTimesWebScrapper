const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const NoteSchema =  new mongoose.Schema({
  note:{
    type: String,
    require: true,
    unique: true
  },
  article:{
    type: Schema.Types.ObjectId,
    ref: "ScrappedData"
  },
  user:{
    type: Schema.Types.ObjectId,
    ref: "User"
  }
})

const Note = mongoose.model('Note', NoteSchema);

module.exports = Note;