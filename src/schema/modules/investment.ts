import { Investment } from "../../entity/Investment"
import { withAuth } from "../../authentication"

export const typeDefs = `
  type Investment {
    uuid: String!
    name: String!
    type: String!
    holder: String!
    objective: String!
    dueDate: Int
    incomes: [Income]
  }

  input InvestmentInput {
    name: String!
    type: String!
    holder: String!
    objective: String!
    dueDate: Int
  }
`

export const query = `
  investments: [Investment]
  investment(uuid: String!): Investment
`

export const mutation = `
  createInvestment(data: InvestmentInput!): Investment
  updateInvestment(uuid: String!, data: InvestmentInput!): Investment
`

export const resolvers = {
  Query: {
    investments: withAuth((_, __, { user }) =>
      Investment.find({ where: { user: user.id } })
    ),
    investment: withAuth((_, { uuid }, { user }) =>
      Investment.findOne({ uuid, user: user.id })
    )
  },
  Mutation: {
    createInvestment: withAuth((_, { data }, { user }) =>
      Investment.create({ ...data, user: { ...user } }).save()
    ),
    updateInvestment: withAuth((_, { uuid, data }, { user }) => {
      Investment.update({ uuid, user: user.id }, { ...data })
      return Investment.findOne({ uuid, user: user.id })
    })
  }
}
