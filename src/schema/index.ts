/* tslint:disable:no-var-requires */
import { GraphQLSchema } from "graphql"
import { makeExecutableSchema } from "graphql-tools"

const modules = [
  require("./modules/user"),
  require("./modules/investment"),
  require("./modules/income")
]

const resolvers: any = modules.map(m => m.resolvers).filter(res => !!res)

const typeDefs = `
  schema {
    query: Query,
    mutation: Mutation
  }

  type Query {
    ${modules
      .map(m => m.query)
      .filter(res => !!res)
      .join("")}
  }

  type Mutation {
    ${modules
      .map(m => m.mutation)
      .filter(res => !!res)
      .join("")}
  }

  ${modules
    .map(m => m.typeDefs)
    .filter(res => !!res)
    .join("")}
`

const schema: GraphQLSchema = makeExecutableSchema({ resolvers, typeDefs })

export { schema }
