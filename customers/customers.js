const app = require('express')();
const bodyParser = require('body-parser')
const mongoose = require('mongoose');
const Customer = require('./Customer');
require('dotenv').config(); 


const port = 5222;
const dbName = 'customersservice'
const dbOptions = {
  useNewUrlParser: true,
  dbName,
  connectTimeoutMS: 1000,
  socketTimeoutMS: 45000,
  poolSize: 10
};

mongoose.connect(encodeURI(process.env.DB_URI), dbOptions, (err)=> {
  !err ? console.log('Database connected - customers service') : console.log('error occured ',err)
})
app.use(bodyParser.json())

app.get('/customers', (req, res) => {
  Customer.find().then((customer)=> {
    res.status(200).json(customer)
  }).catch((err)=> {
    if (err) {
      throw err
    }
  })
})

app.get('/customer/:id', (req, res) => {
  const {id} = req.params
  Customer.findById({_id: id}).then((customer)=> {
    if (!customer) {
      return res.status(400).json({
        message: "customer not found"
      })
    }
    return res.status(200).json(customer)
  }).catch((err)=> {
    if (err) {
      throw err
    }
  })
})

app.post('/customer', (req, res) => {
  const {name, age, address} = req.body
  const newCustomer = {
    name,
    age,
    address
  }
  const customer = new Customer(newCustomer);

  customer.save().then(()=> {
      res.send('customer created')
  }).catch((err)=> {
    if (err) {
      throw err;
    }
  })
  res.send('new book created with success!')
})

app.delete('/customer/:id', (req, res) => {
  const {id} = req.params
  Customer.findByIdAndDelete({_id: id}).then(()=> {
    return res.status(200).json({
      message: 'customer successfully deleted'
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