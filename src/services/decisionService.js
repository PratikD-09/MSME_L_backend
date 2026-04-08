const runDecisionEngine = async (input) => {
  const { monthlyRevenue, loanAmount, tenureMonths } = input

  let score = 100
  const reasons = []

  // Revenue-to-EMI Ratio
  const emi = loanAmount / tenureMonths
  const revenueToEmiRatio = monthlyRevenue / emi
  if (revenueToEmiRatio < 3) {
    score -= 30
    reasons.push('LOW_REVENUE_TO_EMI_RATIO')
  }

  // Loan-to-Revenue Ratio
  const loanToRevenueRatio = loanAmount / monthlyRevenue
  if (loanToRevenueRatio > 0.5) {
    score -= 20
    reasons.push('HIGH_LOAN_TO_REVENUE_RATIO')
  }

  // Tenure Risk
  if (tenureMonths < 6) {
    score -= 15
    reasons.push('RISKY_SHORT_TENURE')
  } else if (tenureMonths > 60) {
    score -= 10
    reasons.push('RISKY_LONG_TENURE')
  }

  // Fraud / Consistency Checks
  if (loanAmount > monthlyRevenue * 2) {
    score -= 50
    reasons.push('EXTREME_LOAN_AMOUNT')
  }
  if (monthlyRevenue < 10000) {
    score -= 25
    reasons.push('VERY_LOW_REVENUE')
  }

  score = Math.max(0, Math.min(100, score))

  const status = score >= 60 ? 'APPROVED' : 'REJECTED'

  return {
    status,
    creditScore: score,
    reasons
  }
}

module.exports = { runDecisionEngine }