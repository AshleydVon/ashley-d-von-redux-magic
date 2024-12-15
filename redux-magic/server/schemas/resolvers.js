const { AuthenticationError } = require('apollo-server-express');
const { User, Product, Category, Order } = require('../models');
const { signToken } = require('../utils/auth');

const resolvers = {
  Query: {
    categories: async () => {
      try {
        return await Category.find();
      } catch (error) {
        console.error("Error in categories query:", error);
        throw new Error("Failed to fetch categories");
      }
    },

    products: async (parent, { category, name }) => {
      try {
        const params = {};
        if (category) {
          params.category = category;
        }
        if (name) {
          params.name = {
            $regex: name,
            $options: "i"
          };
        }
        return await Product.find(params).populate('category');
      } catch (error) {
        console.error("Error in products query:", error);
        throw new Error("Failed to fetch products");
      }
    },

    product: async (parent, { _id }) => {
      try {
        return await Product.findById(_id).populate('category');
      } catch (error) {
        console.error("Error in product query:", error);
        throw new Error("Failed to fetch product");
      }
    },

    user: async (parent, args, context) => {
      if (context.user) {
        const user = await User.findById(context.user._id).populate({
          path: 'orders.products',
          populate: 'category'
        });
        return user;
      }
      throw new AuthenticationError('Not logged in');
    },

    order: async (parent, { _id }, context) => {
      if (context.user) {
        const user = await User.findById(context.user._id).populate({
          path: 'orders.products',
          populate: 'category'
        });
        return user.orders.id(_id);
      }
      throw new AuthenticationError('Not logged in');
    }
  },

  Category: {
    products: async (parent) => {
      try {
        return await Product.find({ category: parent._id });
      } catch (error) {
        console.error("Error in Category.products resolver:", error);
        throw new Error("Failed to fetch products for category");
      }
    }
  },

  Mutation: {
    addUser: async (parent, args) => {
      try {
        const user = await User.create(args);
        const token = signToken(user);
        return { token, user };
      } catch (error) {
        console.error("Error in addUser mutation:", error);
        throw new Error("Failed to create user");
      }
    },

    login: async (parent, { email, password }) => {
      try {
        const user = await User.findOne({ email });
        if (!user) {
          throw new AuthenticationError('Incorrect credentials');
        }
        const correctPw = await user.isCorrectPassword(password);
        if (!correctPw) {
          throw new AuthenticationError('Incorrect credentials');
        }
        const token = signToken(user);
        return { token, user };
      } catch (error) {
        console.error("Error in login mutation:", error);
        throw error;
      }
    },

    addOrder: async (parent, { products }, context) => {
      if (context.user) {
        const order = new Order({ products });
        await User.findByIdAndUpdate(context.user._id, {
          $push: { orders: order }
        });
        return order;
      }
      throw new AuthenticationError('Not logged in');
    },

    addProduct: async (parent, { name, description, price, quantity, image, category }) => {
      try {
        const product = await Product.create({
          name,
          description,
          price,
          quantity,
          image,
          category
        });
        return product;
      } catch (error) {
        console.error("Error in addProduct mutation:", error);
        throw new Error("Failed to add product");
      }
    },

    updateProduct: async (parent, { _id, quantity }) => {
      try {
        return await Product.findByIdAndUpdate(
          _id,
          { $set: { quantity } },
          { new: true }
        );
      } catch (error) {
        console.error("Error in updateProduct mutation:", error);
        throw new Error("Failed to update product");
      }
    }
  }
};

module.exports = resolvers;
