const mongoose = require('mongoose');
const { Schema } = mongoose;

const categorySchema = new Schema({
  name: {
    type: String,
    required: true,
    trim: true,
    unique: true
  },
  description: {
    type: String,
    trim: true
  },
  image: {
    type: String
  },
  featured: {
    type: Boolean,
    default: false
  },
  parentCategory: {
    type: Schema.Types.ObjectId,
    ref: 'Category',
    default: null
  },
  subCategories: [{
    type: Schema.Types.ObjectId,
    ref: 'Category'
  }],
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date,
    default: Date.now
  }
});

categorySchema.pre('save', function(next) {
  this.updatedAt = Date.now();
  next();
});

const Category = mongoose.model('Category', categorySchema);

module.exports = Category;
