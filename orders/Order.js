const mongoose = require('mongoose');
const orderSchema = new mongoose.Schema({
  CustomerID: {
    type: mongoose.SchemaTypes.ObjectId,
    require: true
  },
  BookID: {
    type: mongoose.SchemaTypes.ObjectId,
    require: true
  },
  initialDate: {
    type: Date,
    require: true
  },
  deliveryDate: {
    type: Date,
    require: true
  },

})
const Order = mongoose.model('Order', orderSchema)
module.exports = Order;