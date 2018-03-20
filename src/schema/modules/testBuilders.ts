declare var execute: any

export const createUser = async (values = {}) => {
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

export const createInvestment = async (values, context) => {
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

export const updateInvestment = async (uuid, values, context) => {
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

export const createIncome = async (investmentUuid, values, context) => {
  const defaultValues = {
    date: 1521504163,
    quantity: 100,
    value: 1234
  }
  const data = { ...defaultValues, ...values }
  const result = await execute(
    `
      mutation CreateIncome($investmentUuid: String!, $data: IncomeInput!){
        createIncome(investmentUuid: $investmentUuid, data: $data) {
          uuid
          date
        }
      }
    `,
    { investmentUuid, data },
    context
  )

  return result.createIncome
}

export const updateIncome = async (uuid, values, context) => {
  const defaultValues = {
    date: 1521504163,
    quantity: 100,
    value: 1234
  }
  const data = { ...defaultValues, ...values }
  const result = await execute(
    `
      mutation UpdateIncome($uuid: String!, $data: IncomeInput!){
        updateIncome(uuid: $uuid, data: $data) {
          uuid
          date
        }
      }
    `,
    { uuid, data },
    context
  )

  return result.updateIncome
}
