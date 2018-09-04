const { ApolloServer, gql } = require("apollo-server");
import axios from "axios";
import { typeDefs } from "./schema";
require("dotenv").config();

console.log("process.env.DB", process.env.DB);
// This is a (sample) collection of books we'll be able to query
// the GraphQL server for.  A more complete example might fetch
// from an existing data source like a REST API or database.
const books = [
  {
    title: "Harry Potter and the Chamber of Secrets",
    author: "J.K. Rowling"
  },
  {
    title: "Jurassic Park",
    author: "Michael Crichton"
  }
];

// Resolvers define the technique for fetching the types in the
// schema.  We'll retrieve books from the "books" array above.
let params = {
  client_id: process.env.client_id,
  client_secret: process.env.client_secret
};

let config = { };
if (process.env.client_id) {
  // @ts-ignore
    config.params = params
}
const resolvers = {
  Query: {
    books: () => books,
    repo: async (_, { id }) => {
      let url = `https://api.github.com/repos/octocat/Hello-World`;
      let { data } = await axios.get(url, config);
      return data;
    }
  },
  Repo: {
    user: async repo => {
      // console.log("repo ", repo);
      let url = `https://api.github.com/users/defunkt`;
      let { data } = await axios.get(url, config);
      return data;
    }
  },
  User: {
    /**
     * @param user
     * @param limit
     * @desc this is the params
     */
    repos: async (user, { limit = 5 }) => {
      console.log("limit  ", limit, user);
      let url = `https://api.github.com/users/defunkt/repos`;
      let { data } = await axios.get(url, config);
      // let result =
      return data.slice(0, limit);
    }
  }
};

// In the most basic sense, the ApolloServer can be started
// by passing type definitions (typeDefs) and the resolvers
// responsible for fetching the data for those types.
const server = new ApolloServer({ typeDefs, resolvers });

// This `listen` method launches a web-server.  Existing apps
// can utilize middleware options, which we'll discuss later.
server.listen().then(({ url }) => {
  console.log(`🚀  wow Server ready cool at ${url}`);
});
