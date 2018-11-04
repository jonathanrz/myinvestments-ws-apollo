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
      const received = income.gross - income.ir - income.fee
      if (index === 0) {
        lastIncome = {
          ...income,
          received,
          yield: income.value - income.bought + income.sold + received
        }
        return lastIncome
      }

      lastIncome = {
        ...income,
        received,
        yield:
          income.value -
          income.bought +
          income.sold +
          received -
          lastIncome.value
      }
      return lastIncome
    })
  }
}

export function mapInvestmentResumeData(investment) {
  return {
    ...investment,
    totalBought: investment.incomes.reduce((acc, i) => acc + i.bought, 0),
    totalYield: investment.incomes.reduce((acc, i) => acc + i.yield, 0),
    totalReceived: investment.incomes.reduce(
      (acc, i) => acc + i.gross - i.ir - i.fee,
      0
    ),
    totalMonth: investment.incomes.length
  }
}
