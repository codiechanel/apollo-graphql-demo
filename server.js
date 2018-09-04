"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
const { ApolloServer, AuthenticationError, ApolloError, UserInputError } = require("apollo-server");
const axios_1 = require("axios");
const schema_1 = require("./schema");
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
let config = {};
if (process.env.client_id) {
    // @ts-ignore
    config.params = params;
}
const resolvers = {
    Query: {
        books: () => books,
        repo: (_, { name }) => __awaiter(this, void 0, void 0, function* () {
            let url = `https://api.github.com/repos/${name}`;
            try {
                let { data } = yield axios_1.default.get(url, config);
                return data;
            }
            catch (e) {
                // throw new AuthenticationError('must authenticate')
                // throw new ApolloError("Form Arguments invalid");
                // return result;
                return null;
            }
            // console.log('repo ', data)
        })
    },
    Repo: {
        user: (repo) => __awaiter(this, void 0, void 0, function* () {
            // console.log("repo ", repo);
            // if (repo.id != 0) {
            let url = `https://api.github.com/users/${repo.owner.login}`;
            let { data } = yield axios_1.default.get(url, config);
            return data;
            // } else {
            //   return null;
            // }
        })
    },
    User: {
        /**
         * @param user
         * @param limit
         * @desc this is the params
         */
        repos: (user, { limit = 5 }) => __awaiter(this, void 0, void 0, function* () {
            let url = `https://api.github.com/users/${user.login}/repos`;
            let { data } = yield axios_1.default.get(url, config);
            return data.slice(0, limit);
        })
    }
};
// In the most basic sense, the ApolloServer can be started
// by passing type definitions (typeDefs) and the resolvers
// responsible for fetching the data for those types.
const server = new ApolloServer({
    typeDefs: schema_1.typeDefs,
    resolvers,
    formatError: error => {
        // console.log(error);
        return new Error("Internal server error cool");
    }
});
// This `listen` method launches a web-server.  Existing apps
// can utilize middleware options, which we'll discuss later.
server.listen().then(({ url }) => {
    console.log(`🚀  wow Server ready cool at ${url}`);
});
