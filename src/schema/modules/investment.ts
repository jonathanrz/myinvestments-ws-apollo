import { Investment } from "../../entity/Investment"

export const typeDefs = `
  type Investment {
    uuid: String!
    name: String!
    type: String!
    holder: String!
    objective: String!
    dueDate: Int
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
    investments: (_, __, { user, ensureAuth }) => {
      ensureAuth()
      return Investment.find({ where: { user: user.id } })
    },
    investment: (_, { uuid }, { user, ensureAuth }) => {
      ensureAuth()
      return Investment.findOne({ uuid, user: user.id })
    }
  },
  Mutation: {
    createInvestment: (_, { data }, { user, ensureAuth }) => {
      ensureAuth()
      return Investment.create({ ...data, user: { ...user } }).save()
    },
    updateInvestment: (_, { uuid, data }, { user, ensureAuth }) => {
      ensureAuth()
      return Investment.update({ uuid, user }, { ...data })
    }
  }
}
