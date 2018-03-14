import { GraphQLSchema } from "graphql";
import { makeExecutableSchema } from "graphql-tools";

const modules = [require("./modules/user")];

const mainDef = `
  schema {
    query: Query,
    mutation: Mutation
  }
`;

const resolvers: any = modules.map(m => m.resolvers).filter(res => !!res);

const typeDefs: any = [mainDef].concat(
  modules.map(m => m.typeDefs).filter(res => !!res)
);

const schema: GraphQLSchema = makeExecutableSchema({ resolvers, typeDefs });

export { schema };
