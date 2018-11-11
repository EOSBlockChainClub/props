const { ApolloServer, gql } = require('apollo-server');
const settings = require('./env.json');

  // This is a (sample) collection of books we'll be able to query
  // the GraphQL server for.  A more complete example might fetch
  // from an existing data source like a REST API or database.
  const users = [
    {
      name: 'Tray Lewin',
      hashtags: [
          {name: "HeckYeah", amount: 50},
          {name: "MuchLove", amount: 100},
          {name: "Atomic", amount: 500}
      ]
    }
  ];


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
        amount: Int
    }

    type Transaction {
        dateTime: String,
        fromAccount: String,
        toAccount: String,
        amount: Int
    }

    type Query {
      users: [User]
    }
  `;

  // Resolvers define the technique for fetching the types in the
  // schema.  We'll retrieve books from the "books" array above.
  const resolvers = {
    Query: {
      users: () => users,
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

  // This `listen` method launches a web-server.  Existing apps
  // can utilize middleware options, which we'll discuss later.
  server.listen().then(({ url }) => {
    console.log(`🚀  Server ready at ${url}`);
  });
  