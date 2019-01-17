const mongoose = require('mongoose');
const bookSchema = new mongoose.Schema({
  title: {
    type: String,
    require: true
  },
  author: {
    type: String,
    require: true
  },
  numberOfPages: {
    type: Number,
    require: false
  },
  publisher: {
    type: String,
    require: false
  },

})
const Book = mongoose.model('Book', bookSchema)
module.exports = Book;