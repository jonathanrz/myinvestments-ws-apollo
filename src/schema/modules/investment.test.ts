const catchErrorMessage = err => Promise.reject(err.message)

declare var bootApp: any
declare var execute: any

bootApp(global)

const createUser = async values => {
  const defaultValues = { email: "example@email.com", password: "password" }
  const data = { ...defaultValues, ...values }
  const result = await execute(
    `
      mutation CreateUser($data: UserInput!){
        createUser(data: $data) {
          id
          email
        }
      }
    `,
    { data }
  )

  return result.createUser
}

const createInvestment = async (values, context) => {
  const defaultValues = {
    name: "Investment",
    type: "Investment-type",
    holder: "Investment-holder",
    objective: "Investment-objective"
  }
  const data = { ...defaultValues, ...values }
  const result = await execute(
    `
      mutation CreateInvestment($data: InvestmentInput!){
        createInvestment(data: $data) {
          uuid
          name
        }
      }
    `,
    { data },
    context
  )

  return result.createInvestment
}

const updateInvestment = async (uuid, values, context) => {
  const defaultValues = {
    name: "Investment",
    type: "Investment-type",
    holder: "Investment-holder",
    objective: "Investment-objective"
  }
  const data = { ...defaultValues, ...values }
  const result = await execute(
    `
      mutation UpdateInvestment($uuid: String!, $data: InvestmentInput!){
        updateInvestment(uuid: $uuid, data: $data) {
          uuid
          name
        }
      }
    `,
    { uuid, data },
    context
  )

  return result.updateInvestment
}

const allInvestmentsQuery = () => `
  {
    investments {
      uuid
      name
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

describe("investment model ", () => {
  let context

  beforeEach(async () => {
    const user = await createUser({})
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
})
