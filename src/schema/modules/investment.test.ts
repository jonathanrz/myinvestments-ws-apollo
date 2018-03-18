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

describe("investment model ", () => {
  let context

  beforeEach(async () => {
    const user = await createUser({})
    context = { user }
  })

  it("should create a investment succesfully", async () => {
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
      `
        {
          investment(uuid: "${investment.uuid}") {
            uuid
            name
          }
        }
      `,
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
      `
        {
          investment(uuid: "${investment.uuid}") {
            uuid
            name
          }
        }
      `,
      null,
      context
    )

    expect(result.investment).toEqual(null)
  })

  it("should return user investments", async () => {
    const investment = await createInvestment({}, context)

    const result = await execute(
      `
        {
          investments {
            uuid
            name
          }
        }
      `,
      null,
      context
    )

    const { investments } = result
    expect(investments.length).toBe(1)
    expect(investments[0]).toEqual(investment)
  })

  it("should not return another user investments", async () => {
    const investment = await createInvestment({}, context)

    const user = await createUser({ email: "another-user@email.com" })
    context = { user }

    const result = await execute(
      `
        {
          investments {
            uuid
            name
          }
        }
      `,
      null,
      context
    )

    const { investments } = result
    expect(investments.length).toBe(0)
  })
})
