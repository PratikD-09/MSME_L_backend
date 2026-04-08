const { saveLoan } = require('../models/loanModel')
const { logAudit } = require('../services/auditService')

const createLoan = async (req, res) => {
  try {
    const loan = await saveLoan(req.body)
    await logAudit('LOAN_CREATED', { loanId: loan.id, data: req.body })
    res.status(201).json(loan)
  } catch (error) {
    res.status(500).json({ error: true, message: 'Failed to create loan' })
  }
}

module.exports = { createLoan }