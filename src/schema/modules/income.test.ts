import {
  createUser,
  createInvestment,
  createIncome,
  updateIncome
} from "./testBuilders"

const catchErrorMessage = err => Promise.reject(err.message)

declare var bootApp: any
declare var execute: any

bootApp(global)

const allIncomesQuery = investmentUuid => `
  {
    incomes(investmentUuid: "${investmentUuid}") {
      uuid
      date
    }
  }
`
const getIncomeQuery = uuid => `
  {
    income(uuid: "${uuid}") {
      uuid
      date
    }
  }
`

describe("income model ", () => {
  let context
  let investment

  beforeEach(async () => {
    const user = await createUser()
    context = { user }
    investment = await createInvestment({}, context)
  })

  it("should create an income succesfully", async () => {
    const income = await createIncome(
      investment.uuid,
      { date: 1521504620 },
      context
    )

    expect(income.uuid).not.toBeUndefined()
    expect(income.date).toBe(1521504620)
  })

  it("should get an income by uuid", async () => {
    const income = await createIncome(investment.uuid, {}, context)

    const result = await execute(getIncomeQuery(income.uuid), null, context)

    expect(result.income).toEqual(income)
  })

  it("should not return another user income", async () => {
    const income = await createIncome(investment.uuid, {}, context)

    const user = await createUser({ email: "another-user@email.com" })
    context = { user }

    const result = await execute(getIncomeQuery(income.uuid), null, context)

    expect(result.income).toEqual(null)
  })

  it("should return user incomes", async () => {
    const income = await createIncome(investment.uuid, {}, context)

    const result = await execute(
      allIncomesQuery(investment.uuid),
      null,
      context
    )

    const { incomes } = result
    expect(incomes.length).toBe(1)
    expect(incomes[0]).toEqual(income)
  })

  it("should not return another user incomes", async () => {
    const income = await createIncome(investment.uuid, {}, context)

    const user = await createUser({ email: "another-user@email.com" })
    context = { user }

    const result = await execute(
      allIncomesQuery(investment.uuid),
      null,
      context
    )

    const { incomes } = result
    expect(incomes.length).toBe(0)
  })

  it("should update an income succesfully", async () => {
    const incomeOriginal = await createIncome(
      investment.uuid,
      { date: 1521504620 },
      context
    )

    const incomeUpdated = await updateIncome(
      incomeOriginal.uuid,
      { date: 1521504621 },
      context
    )

    expect(incomeUpdated.uuid).toBe(incomeOriginal.uuid)
    expect(incomeUpdated.date).toBe(1521504621)
  })
})
