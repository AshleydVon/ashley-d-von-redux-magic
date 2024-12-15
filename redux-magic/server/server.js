const express = require('express');
const { ApolloServer } = require('@apollo/server');
const { expressMiddleware } = require('@apollo/server/express4');
const path = require('path');
const { authMiddleware } = require('./utils/auth');
const { typeDefs, resolvers } = require('./schemas');
const db = require('./config/connection');
const cors = require('cors');

const PORT = process.env.PORT || 3001;
const app = express();

const server = new ApolloServer({
  typeDefs,
  resolvers,
  formatError: (error) => {
    console.error('GraphQL Error:', error);
    return error;
  },
  debug: true,  
});

const startApolloServer = async () => {
  try {
    await server.start();
    
    // Middleware
    app.use(cors({
      origin: 'http://localhost:3000',  
      credentials: true,
    }));

    app.use(express.urlencoded({ extended: false }));
    app.use(express.json());

    app.use('/graphql', expressMiddleware(server, { context: authMiddleware }));

    if (process.env.NODE_ENV === 'production') {
      app.use(express.static(path.join(__dirname, '../client/build')));
      app.get('*', (req, res) => {
        res.sendFile(path.join(__dirname, '../client/build/index.html'));
      });
    }

    db.on('error', (err) => {
      console.error('MongoDB connection error:', err);
    });

    db.once('open', () => {
      app.listen(PORT, () => {
        console.log(`Server running on port ${PORT}`);
        console.log(`Use GraphQL at http://localhost:${PORT}/graphql`);
      });
    });

  } catch (error) {
    console.error('Error starting Apollo Server:', error);
  }
};

startApolloServer();
