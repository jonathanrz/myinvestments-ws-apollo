import * as moment from "moment"

import { firstDayOfMonth } from "../../utils/date"
import {
  mapLastIncome,
  mapYield,
  mapSoldInvestmentData
} from "../../utils/investments"
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
    lastIncome: Income
  }

  type SoldInvestment {
    uuid: String!
    name: String!
    type: String!
    holder: String!
    objective: String!
    totalBought: Int!
    totalYield: Int!
    totalMonth: Int!
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
  activeInvestments: [Investment]
  soldInvestments: [SoldInvestment]
  investmentsOfMonth: [InvestmentOfMonth]
  investment(uuid: String!): Investment
`

export const mutation = `
  createInvestment(data: InvestmentInput!): Investment
  updateInvestment(uuid: String!, data: InvestmentInput!): Investment
`

export const resolvers = {
  Query: {
    investments: withAuth(async (_, __, { user }) => {
      const investments = await Investment.find({ where: { user: user.id } })
      return investments
        .map(mapLastIncome)
        .map(mapYield)
        .map(mapSoldInvestmentData)
    }),
    activeInvestments: withAuth(async (_, __, { user }) => {
      const investments = await Investment.find({ where: { user: user.id } })
      return investments
        .map(mapLastIncome)
        .map(mapYield)
        .filter(
          investment =>
            !investment.lastIncome || investment.lastIncome.value > 0
        )
        .map(mapSoldInvestmentData)
    }),
    soldInvestments: withAuth(async (_, __, { user }) => {
      const investments = await Investment.find({ where: { user: user.id } })
      return investments
        .map(mapLastIncome)
        .filter(
          investment =>
            investment.lastIncome && investment.lastIncome.value === 0
        )
        .map(mapYield)
        .map(mapSoldInvestmentData)
    }),
    investmentsOfMonth: withAuth(async (_, __, { user }) => {
      const investments = await Investment.find({ where: { user: user.id } })
      return investments
        .map(mapLastIncome)
        .filter(
          investment =>
            investment.lastIncome &&
            investment.lastIncome.value > 0 &&
            investment.lastIncome.date < firstDayOfMonth(moment()).format("X")
        )
    }),
    investment: withAuth(async (_, { uuid }, { user }) => {
      const investment = await Investment.findOne({ uuid, user: user.id })
      if (investment) {
        return mapYield(mapLastIncome(investment))
      } else {
        return null
      }
    })
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
