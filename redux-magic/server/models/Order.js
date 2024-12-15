const mongoose = require('mongoose');
const { Schema } = mongoose;

const orderSchema = new Schema({
  purchaseDate: {
    type: Date,
    default: Date.now
  },
  products: [
    {
      type: Schema.Types.ObjectId,
      ref: 'Product',
      required: true
    }
  ],
  total: {
    type: Number,
    required: true,
    min: 0.99
  },
  status: {
    type: String,
    required: true,
    default: 'pending',
    enum: ['pending', 'processing', 'shipped', 'delivered']
  },
  shippingAddress: {
    street: { type: String, required: true },
    city: { type: String, required: true },
    state: { type: String, required: true },
    zipCode: { type: String, required: true }
  }
});

const Order = mongoose.model('Order', orderSchema);

module.exports = Order;
