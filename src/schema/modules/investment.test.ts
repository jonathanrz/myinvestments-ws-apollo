const catchErrorMessage = err => Promise.reject(err.message)

declare var bootApp: any
declare var execute: any

bootApp(global)

const createUser = async () => {
  const data = { email: "example@email.com", password: "password" }
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

describe("create investment mutation ", () => {
  let context

  beforeEach(async () => {
    const user = await createUser()
    context = { user }
  })

  it("creates a investment succesfully", async () => {
    const investment = await createInvestment(
      {
        name: "Create investment test"
      },
      context
    )

    expect(investment.uuid).not.toBeUndefined()
    expect(investment.name).toBe("Create investment test")
  })
})
