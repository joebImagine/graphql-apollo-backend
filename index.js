const { ApolloServer, gql } = require('apollo-server');
const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

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
    users: async (_, { first = 10, after }) => {
      const where = after ? { id: { gt: after } } : {};
      const users = await prisma.user.findMany({
        take: first,
        skip: after ? 1 : 0, // Skip the cursor item
        orderBy: { id: 'asc' },
        where,
      });

      const edges = users.map(user => ({
        cursor: user.id,
        node: user,
      }));

      const lastUser = users[users.length - 1];
      const hasNextPage = !!lastUser && (await prisma.user.count({ where: { id: { gt: lastUser.id } } })) > 0;

      return {
        edges,
        pageInfo: {
          endCursor: lastUser ? lastUser.id : null,
          hasNextPage,
        },
      };
    },
  },
};

const server = new ApolloServer({ typeDefs, resolvers });

server.listen().then(({ url }) => {
  console.log(`🚀 Server ready at ${url}`);
});
