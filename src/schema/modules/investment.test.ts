import * as moment from "moment"
import {
  createUser,
  createInvestment,
  updateInvestment,
  createIncome
} from "./testBuilders"

const catchErrorMessage = err => Promise.reject(err.message)

declare var bootApp: any
declare var execute: any

bootApp(global)

const allInvestmentsQuery = () => `
  {
    investments {
      uuid
      name
    }
  }
`

const investmentsOfMonthQuery = () => `
  {
    investmentsOfMonth {
      uuid
      lastIncome {
        uuid
      }
    }
  }
`

const getInvestmentQuery = uuid => `
  {
    investment(uuid: "${uuid}") {
      uuid
      name
    }
  }
`

const getInvestmentWithIncomesQuery = uuid => `
  {
    investment(uuid: "${uuid}") {
      uuid
      name
      incomes {
        uuid
        date
      }
    }
  }
`

describe("investment model ", () => {
  let context

  beforeEach(async () => {
    const user = await createUser()
    context = { user }
  })

  it("should create an investment succesfully", async () => {
    const investment = await createInvestment(
      { name: "Create investment test" },
      context
    )

    expect(investment.uuid).not.toBeUndefined()
    expect(investment.name).toBe("Create investment test")
  })

  it("should get an investment by uuid", async () => {
    const investment = await createInvestment({}, context)

    const result = await execute(
      getInvestmentQuery(investment.uuid),
      null,
      context
    )

    expect(result.investment).toEqual(investment)
  })

  it("should not return another user investment", async () => {
    const investment = await createInvestment({}, context)

    const user = await createUser({ email: "another-user@email.com" })
    context = { user }

    const result = await execute(
      getInvestmentQuery(investment.uuid),
      null,
      context
    )

    expect(result.investment).toEqual(null)
  })

  it("should return user investments", async () => {
    const investment = await createInvestment({}, context)

    const result = await execute(allInvestmentsQuery(), null, context)

    const { investments } = result
    expect(investments.length).toBe(1)
    expect(investments[0]).toEqual(investment)
  })

  it("should not return another user investments", async () => {
    const investment = await createInvestment({}, context)

    const user = await createUser({ email: "another-user@email.com" })
    context = { user }

    const result = await execute(allInvestmentsQuery(), null, context)

    const { investments } = result
    expect(investments.length).toBe(0)
  })

  it("should update an investment succesfully", async () => {
    const investmentOriginal = await createInvestment(
      { name: "Investment original" },
      context
    )

    const investmentUpdated = await updateInvestment(
      investmentOriginal.uuid,
      { name: "Investment updated" },
      context
    )

    expect(investmentUpdated.uuid).toBe(investmentOriginal.uuid)
    expect(investmentUpdated.name).toBe("Investment updated")
  })

  it("should return investment with incomes", async () => {
    const investment = await createInvestment({}, context)
    const income = await createIncome(investment.uuid, {}, context)

    const result = await execute(
      getInvestmentWithIncomesQuery(investment.uuid),
      null,
      context
    )

    expect(result.investment.uuid).toEqual(investment.uuid)

    const { incomes } = result.investment
    expect(incomes.length).toBe(1)
    expect(incomes[0]).toEqual(income)
  })

  it("should return investment of month", async () => {
    const investment1 = await createInvestment({ name: "investment1" }, context)
    await createIncome(
      investment1.uuid,
      { date: moment().format("X") },
      context
    )
    const investment2 = await createInvestment({ name: "investment2" }, context)
    const lastMonthIncome = await createIncome(
      investment2.uuid,
      {
        date: moment()
          .subtract(1, "months")
          .format("X")
      },
      context
    )

    const result = await execute(investmentsOfMonthQuery(), null, context)

    expect(result.investmentsOfMonth).toHaveLength(1)
    const investment = result.investmentsOfMonth[0]
    expect(investment.uuid).toBe(investment2.uuid)
    expect(investment.lastIncome.uuid).toBe(lastMonthIncome.uuid)
  })

  it("should not return sold investment in investment of month", async () => {
    const investment = await createInvestment({ name: "investment1" }, context)
    await createIncome(
      investment.uuid,
      {
        date: moment()
          .subtract(1, "months")
          .format("X"),
        value: 0
      },
      context
    )

    const result = await execute(investmentsOfMonthQuery(), null, context)

    expect(result.investmentsOfMonth).toHaveLength(0)
  })
})
