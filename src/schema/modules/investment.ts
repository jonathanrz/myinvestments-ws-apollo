import { orderBy } from "lodash"
import * as moment from "moment"

import { firstDayOfMonth } from "../../utils/date"
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

  type InvestmentOfMonth {
    uuid: String!
    name: String!
    type: String!
    holder: String!
    lastIncome: Income!
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
  investmentsOfMonth: [InvestmentOfMonth]
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
    investmentsOfMonth: withAuth(async (_, __, { user }) => {
      const investments = await Investment.find({ where: { user: user.id } })
      return investments
        .map(investment => {
          if (investment.incomes) {
            const lastIncome = orderBy(
              investment.incomes,
              ["date"],
              ["desc"]
            )[0]
            return {
              ...investment,
              lastIncome
            }
          } else {
            return {
              ...investment,
              lastIncome: {}
            }
          }
        })
        .filter(
          investment =>
            investment.lastIncome.value > 0 &&
            investment.lastIncome.date < firstDayOfMonth(moment()).format("X")
        )
    }),
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
