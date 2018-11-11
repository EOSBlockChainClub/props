import Mongo from './services/mongo/schema';
import { findMongo, findOneMongo, inMongo } from './services/mongo/resolvers';
import {searchTweets, processTwitterTransfers} from './services/twitter/resolvers';
import { connect } from './services/mongo/connectors';
const { ApolloServer, gql } = require('apollo-server');
const settings = require('./env.json');

  // Type definitions define the "shape" of your data and specify
  // which ways the data can be fetched from the GraphQL server.
  const typeDefs = gql`
    type User {
      name: String,
      hashtags: [Hashtag],
      transactions: [Transaction],
      twitterName: String,
      googleName: String,
      facebookName: String
    }

    type Hashtag {
        name: String,
        amount: Int,
        platforms: String
    }

    type Result {
      success: Boolean!
      modifiedCount: Int
      _id: String          
      errorCode: String
    }

    type Transaction {
        _id: String
        userId: String
        action: String
        actionDatetime: String
        dateTime: String
        platform: String
        fromAccount: String
        toAccount: String
        hashtag: String
        amount: Int
        metadata: String
    }

    type Query {
      searchTweets (searchString:String, twitterName:String, count:Int) : String
      processTwitterTransfers (searchString:String, twitterName:String, count:Int) : Result
      transactions  (userId:String): [Transaction]
      users: [User]
    }
  `;

  // Resolvers define the technique for fetching the types in the
  // schema.  We'll retrieve books from the "books" array above.
  const resolvers = {
    Query: {
      searchTweets: (_, args, context) => { return searchTweets(args, context); },
      // getTwitterData: (_, args, context) => { return getTwitterData(args, context); },
      processTwitterTransfers: (_, args, context) => { return processTwitterTransfers(args, context); },
      // users: () => users,
      transactions: (_, args, context) => { return findMongo(args, context, Mongo.Transaction); },
      users: (_, args, context) => { return findMongo(args, context, Mongo.User); },
    },
  };

  // In the most basic sense, the ApolloServer can be started
  // by passing type definitions (typeDefs) and the resolvers
  // responsible for fetching the data for those types.
  const server = new ApolloServer({
    typeDefs,
    resolvers,
    // engine: settings.ENGINE_API_KEY && {
    //   apiKey: settings.ENGINE_API_KEY,
    // },
  });

  // Mongo
  connect(settings.MONGO_URI);

  // This `listen` method launches a web-server.  Existing apps
  // can utilize middleware options, which we'll discuss later.
  server.listen().then(({ url }) => {
    console.log(`🚀  Server ready at ${url}`);
  });
  