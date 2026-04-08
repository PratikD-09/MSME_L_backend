const { saveBusiness } = require('../models/businessModel')
const { logAudit } = require('../services/auditService')

const createBusiness = async (req, res) => {
  try {
    const business = await saveBusiness(req.body)
    await logAudit('BUSINESS_CREATED', { businessId: business.id, data: req.body })
    res.status(201).json(business)
  } catch (error) {
    console.error('Business creation failed:', error)

    // Handle duplicate PAN error
    if (error.code === '23505' && error.constraint === 'businesses_pan_key') {
      return res.status(409).json({
        error: true,
        message: 'PAN already exists. Please use a different PAN number.'
      })
    }

    res.status(500).json({ error: true, message: 'Failed to create business', detail: error.message })
  }
}

module.exports = { createBusiness }