const app = require('express')();
const bodyParser = require('body-parser')
const mongoose = require('mongoose');
const Book = require('./Book');
require('dotenv').config(); 


const port = 4222;
const dbName = 'booksservice'
const dbOptions = {
  useNewUrlParser: true,
  dbName,
  connectTimeoutMS: 1000,
  socketTimeoutMS: 45000,
  poolSize: 10
};

mongoose.connect(encodeURI(process.env.DB_URI), dbOptions, (err)=> {
  !err ? console.log('Database connected') : console.log('error occured ',err)
})
app.use(bodyParser.json())
app.get('/', (req, res) => {
  res.send('hello there!')
})

app.get('/books', (req, res) => {
  Book.find().then((books)=> {
    res.status(200).json(books)
  }).catch((err)=> {
    if (err) {
      throw err
    }
  })
})

app.get('/book/:id', (req, res) => {
  const {id} = req.params
  Book.findById({_id: id}).then((book)=> {
    if (!book) {
      console.log('book not found')
      return res.status(400).json({
        message: "book not found"
      })
    }
    return res.status(200).json(book)
  }).catch((err)=> {
    if (err) {
      throw err
    }
  })
})

app.post('/book', (req, res) => {
  const {title, author, numberOfPages, publisher} = req.body
  const newBook = {
    title,
    author,
    numberOfPages,
    publisher
  }
  const book = new Book(newBook);

  book.save().then(()=> {
      console.log('new book created')
  }).catch((err)=> {
    if (err) {
      throw err;
    }
  })
  res.send('new book created with success!')
})

app.delete('/book/:id', (req, res) => {
  const {id} = req.params
  Book.findByIdAndDelete({_id: id}).then(()=> {
    return res.status(200).json({
      message: 'book successfully deleted'
    })
  }).catch((err)=> {
    if (err) {
      throw err
    }
  })
})

app.listen(port, (err)=> {
  !err? console.log(`Server is running on port: ${port}`): console.log('err: ', err)
})