import { Investment } from "../../entity/Investment"
import { Income } from "../../entity/Income"
import { withAuth } from "../../authentication"

export const typeDefs = `
  type Income {
    uuid: String!
    date: Int!
    quantity: Int!
    value: Int!
    bought: Int
    sold: Int
    gross: Int
    ir: Int
    fee: Int
    investment: Investment
  }

  input IncomeInput {
    date: Int!
    quantity: Int!
    value: Int!
    bought: Int
    sold: Int
    gross: Int
    ir: Int
    fee: Int
  }
`

export const query = `
  incomes(investmentUuid: String!): [Income]
  income(uuid: String!): Income
`

export const mutation = `
  createIncome(investmentUuid: String!, data: IncomeInput!): Income
  updateIncome(uuid: String!, data: IncomeInput!): Income
`

export const resolvers = {
  Query: {
    incomes: withAuth(async (_, { investmentUuid }, { user }) => {
      const investment: any = await Investment.findOne({
        uuid: investmentUuid,
        user: user.id
      })
      if (!investment) {
        return []
      }
      return Income.find({
        where: { investment: investment.id, user: user.id }
      })
    }),
    income: withAuth(async (_, { uuid }, { user }) => {
      const income = await Income.findOne({ uuid, user: user.id })
      income.investment = await Investment.findOne({ id: income.investmentId })
      return income
    })
  },
  Mutation: {
    createIncome: withAuth(async (_, { investmentUuid, data }, { user }) => {
      const investment: any = await Investment.findOne({
        uuid: investmentUuid,
        user: user.id
      })
      const income = Income.create({
        ...data,
        investment: { ...investment },
        user: { ...user }
      })
      income.save()
      income.investment = investment
      return income
    }),
    updateIncome: withAuth(async (_, { uuid, data }, { user }) => {
      Income.update({ uuid, user: user.id }, { ...data })
      const income = await Income.findOne({ uuid, user: user.id })
      income.investment = await Investment.findOne({ id: income.investmentId })
      return income
    })
  }
}
