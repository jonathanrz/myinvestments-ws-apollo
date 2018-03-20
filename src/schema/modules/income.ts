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
    income: withAuth((_, { uuid }, { user }) =>
      Income.findOne({ uuid, user: user.id })
    )
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
      return income.save()
    }),
    updateIncome: withAuth((_, { uuid, data }, { user }) => {
      Income.update({ uuid, user: user.id }, { ...data })
      return Income.findOne({ uuid, user: user.id })
    })
  }
}
