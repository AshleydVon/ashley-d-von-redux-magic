const mongoose = require('mongoose');

mongoose.connect(process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/redux-magic', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

const db = mongoose.connection;

db.on('error', (err) => {
  console.error('MongoDB connection error:', err);
});

db.once('open', () => {
  console.log('Connected to MongoDB successfully');
});

module.exports = db;
