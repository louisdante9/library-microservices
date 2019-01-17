const app = require('express')();
const bodyParser = require('body-parser')
const mongoose = require('mongoose');
const axios = require('axios');
const Order = require('./Order');
require('dotenv').config(); 


const port = 6222;
const dbName = 'ordersservice'
const dbOptions = {
  useNewUrlParser: true,
  dbName,
  connectTimeoutMS: 1000,
  socketTimeoutMS: 45000,
  poolSize: 10
};

mongoose.connect(encodeURI(process.env.DB_URI), dbOptions, (err)=> {
  !err ? console.log('Database connected - orders service') : console.log('error occured ',err)
})

app.use(bodyParser.json())


app.get('/orders', (req, res) => {
  Order.find().then((orders)=> {
    res.status(200).json(orders)
  }).catch((err)=> {
    if (err) {
      throw err
    }
  })
})

app.get('/order/:id', (req, res) => {
  const {id} = req.params
  Order.findById({_id: id}).then((order)=> {
    if (!order) {
      return res.status(400).json({
        message: "order not found"
      })
    }
    axios.get(`http://localhost:5222/customer/${order.CustomerID}`).then((response)=> {

        let orderObject = {
          customerName: response.data.name,
          bookTitle: ''
        }
        axios.get(`http://localhost:4222/book/${order.BookID}`).then((response) => {
          orderObject.bookTitle = response.data.title;
          res.json(orderObject);
        })
    })
  }).catch((err)=> {
    if (err) {
      throw err
    }
  })
})

app.post('/order', (req, res) => {
  const {CustomerID, BookID, initialDate, deliveryDate} = req.body
  const newOrder = {
    CustomerID : mongoose.Types.ObjectId(CustomerID),
     BookID:mongoose.Types.ObjectId(BookID), 
     initialDate, 
     deliveryDate
  }
  const order = new Order(newOrder);

  order.save().then(()=> {
      res.send('order created')
  }).catch((err)=> {
    if (err) {
      throw err;
    }
  })
})

// app.delete('/customer/:id', (req, res) => {
//   const {id} = req.params
//   Customer.findByIdAndDelete({_id: id}).then(()=> {
//     return res.status(200).json({
//       message: 'customer successfully deleted'
//     })
//   }).catch((err)=> {
//     if (err) {
//       throw err
//     }
//   })
// })

app.listen(port, (err)=> {
  !err? console.log(`Server is running on port: ${port}`): console.log('err: ', err)
})