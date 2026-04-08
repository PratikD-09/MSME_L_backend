const { runDecisionEngine } = require('../services/decisionService')
const { saveDecision } = require('../models/decisionModel')
const { logAudit } = require('../services/auditService')

const getDecision = async (req, res) => {
  try {
    console.log('Decision request body:', JSON.stringify(req.body, null, 2))

    const {
      ownerName,
      pan,
      businessType,
      monthlyRevenue,
      loanAmount,
      tenureMonths,
      loanPurpose
    } = req.body

    // Validate required fields
    if (!monthlyRevenue || !loanAmount || !tenureMonths) {
      return res.status(400).json({
        error: true,
        message: 'Missing required fields: monthlyRevenue, loanAmount, tenureMonths'
      })
    }

    const business = { ownerName, pan, businessType, monthlyRevenue }
    const loan = { loanAmount, tenureMonths, loanPurpose }

    const decision = await runDecisionEngine({ monthlyRevenue, loanAmount, tenureMonths })
    const savedDecision = await saveDecision({ business, loan, ...decision })

    await logAudit('DECISION_MADE', {
      decisionId: savedDecision.id,
      business,
      loan,
      decision
    })

    res.json(decision)
  } catch (error) {
    console.error('Decision processing failed:', error)
    res.status(500).json({ error: true, message: 'Failed to process decision', detail: error.message })
  }
}

module.exports = { getDecision }