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

  return {
    ...investment,
    incomes: incomes.map((income, index) => {
      if (index === 0) {
        return { ...income, yield: income.value - income.bought - income.sold }
      }

      return {
        ...income,
        yield:
          income.value - income.bought - income.sold - incomes[index - 1].yield
      }
    })
  }
}
