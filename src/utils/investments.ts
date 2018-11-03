import { orderBy } from "lodash"

export function mapLastIncome(investment) {
  if (investment.incomes) {
    const lastIncome = orderBy(investment.incomes, ["date"], ["desc"])[0]
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
}

export function mapYield(investment) {
  const incomes = orderBy(investment.incomes, ["date"], ["asc"])

  let lastIncome
  return {
    ...investment,
    incomes: incomes.map((income, index) => {
      if (index === 0) {
        lastIncome = {
          ...income,
          yield: income.value - income.bought + income.sold
        }
        return lastIncome
      }

      lastIncome = {
        ...income,
        yield: income.value - income.bought + income.sold - lastIncome.value
      }
      return lastIncome
    })
  }
}
