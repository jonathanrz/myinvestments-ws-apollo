import { orderBy } from "lodash"

export function mapLastIncome(investment) {
  if (investment.incomes) {
    const lastIncome = orderBy(
      investment.incomes,
      ["date"],
      ["desc"]
    )[0]
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
})
}