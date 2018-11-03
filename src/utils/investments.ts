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
          yield:
            income.value -
            income.bought +
            income.sold +
            income.gross -
            income.ir -
            income.fee
        }
        return lastIncome
      }

      lastIncome = {
        ...income,
        yield:
          income.value -
          income.bought +
          income.sold +
          income.gross -
          income.ir -
          income.fee -
          lastIncome.value
      }
      return lastIncome
    })
  }
}

export function mapSoldInvestmentData(investment) {
  return {
    ...investment,
    totalBought: investment.incomes.reduce((acc, i) => acc + i.bought, 0),
    totalYield: investment.incomes.reduce((acc, i) => acc + i.yield, 0),
    totalMonth: investment.incomes.length
  }
}
