const { ApolloServer, gql } = require('apollo-server');

const users = Array.from({ length: 100 }, (_, i) => ({
  id: `user-${i + 1}`,
  name: `User ${i + 1}`,
  age: 20 + (i % 10),
}));


const typeDefs = gql`
  type Query {
    users(first: Int, after: String): UserConnection!
  }

  type User {
    id: ID!
    name: String!
    age: Int!
  }

  type UserConnection {
    edges: [UserEdge!]!
    pageInfo: PageInfo!
  }

  type UserEdge {
    cursor: String!
    node: User!
  }

  type PageInfo {
    endCursor: String
    hasNextPage: Boolean!
  }
`;


const resolvers = {
  Query: {
    users: (_, { first = 10, after }) => {
      const startIndex = after ? users.findIndex(user => user.id === after) + 1 : 0;
      const paginatedUsers = users.slice(startIndex, startIndex + first);

      const edges = paginatedUsers.map(user => ({
        cursor: user.id,
        node: user,
      }));

      const endCursor = edges.length > 0 ? edges[edges.length - 1].cursor : null;

      return {
        edges,
        pageInfo: {
          endCursor,
          hasNextPage: startIndex + first < users.length,
        },
      };
    },
  },
};

const server = new ApolloServer({ typeDefs, resolvers });

server.listen().then(({ url }) => {
  console.log(`🚀 Server ready at ${url}`);
});

