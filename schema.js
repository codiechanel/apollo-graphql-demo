"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const { ApolloServer, gql } = require("apollo-server");
// Type definitions define the "shape" of your data and specify
// which ways the data can be fetched from the GraphQL server.
const typeDefs = gql `
  # Comments in GraphQL are defined with the hash (#) symbol.
  # This "Book" type can be used in other type declarations.
  type Book {
    title: String
    author: String
  }

  type User {
    id: Int!
    login: String
    repos(limit: Int): [Repo]
  }

  type Repo {
    id: Int
    name: String
    user: User
    full_name: String
  }

  # The "Query" type is the root of all GraphQL queries.
  # (A "Mutation" type will be covered later on.)
  type Query {
    books: [Book]
    repo(name: String!): Repo
  }
`;
exports.typeDefs = typeDefs;
