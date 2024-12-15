const mongoose = require('mongoose');
const { Schema } = mongoose;

const productSchema = new Schema({
  name: {
    type: String,
    required: true,
    trim: true
  },
  description: {
    type: String,
    required: true,
    trim: true
  },
  image: {
    type: String,
    required: true
  },
  price: {
    type: Number,
    required: true,
    min: 0.99
  },
  quantity: {
    type: Number,
    min: 0,
    default: 0,
    required: true
  },
  category: {
    type: Schema.Types.ObjectId,
    ref: 'Category',
    required: true
  },
  reviews: [{
    rating: {
      type: Number,
      required: true,
      min: 1,
      max: 5
    },
    comment: String,
    author: {
      type: Schema.Types.ObjectId,
      ref: 'User'
    },
    createdAt: {
      type: Date,
      default: Date.now
    }
  }],
  featured: {
    type: Boolean,
    default: false
  }
});

const Product = mongoose.model('Product', productSchema);

module.exports = Product;
