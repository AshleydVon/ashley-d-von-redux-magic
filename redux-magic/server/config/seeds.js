const db = require('./connection');
const { User, Product, Category } = require('../models');
const cleanDB = require('./cleanDB');

db.once('open', async () => {
  await cleanDB('Category', 'categories');
  await cleanDB('Product', 'products');
  await cleanDB('User', 'users');

  const categories = await Category.insertMany([
    { name: 'Food' },
    { name: 'Household Supplies' },
    { name: 'Electronics' },
    { name: 'Books' },
    { name: 'Toys' }
  ]);

  console.log('Categories seeded');

  const products = await Product.insertMany([
    {
      name: 'Tin of Cookies',
      description: 'Class aptent taciti sociosqu ad litora torquent per conubia nostra, per inceptos himenaeos.',
      image: 'cookie-tin.jpg',
      category: categories[0]._id,
      price: 2.99,
      quantity: 500
    },
    {
      name: 'Smart TV',
      description: '4K Ultra HD Smart LED TV with built-in streaming apps.',
      image: 'tv.jpg',
      category: categories[2]._id,
      price: 599.99,
      quantity: 50
    },
    {
      name: 'Coffee Maker',
      description: 'Programmable coffee maker with thermal carafe.',
      image: 'coffee-maker.jpg',
      category: categories[1]._id,
      price: 49.99,
      quantity: 100
    }
  ]);

  console.log('Products seeded');

  await User.create({
    firstName: 'Pamela',
    lastName: 'Washington',
    email: 'pamela@testmail.com',
    password: 'password12345',
    orders: [{
      products: [products[0]._id, products[1]._id],
      shippingAddress: {
        street: '123 Main St',
        city: 'Austin',
        state: 'TX',
        zipCode: '78701'
      },
      total: 602.98
    }]
  });

  console.log('Users seeded');

  process.exit();
});
