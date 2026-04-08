const Joi = require('joi')

const decisionSchema = Joi.object({
  ownerName: Joi.string().required(),
  pan: Joi.string().pattern(/^[A-Z]{5}[0-9]{4}[A-Z]{1}$/).required(),
  businessType: Joi.string().valid('retail', 'manufacturing', 'services', 'other').required(),
  monthlyRevenue: Joi.number().positive().required(),
  loanAmount: Joi.number().positive().required(),
  tenureMonths: Joi.number().integer().min(1).max(120).required(),
  loanPurpose: Joi.string().required()
}).unknown(true) // Allow unknown fields like 'id'

const validateDecision = (req, res, next) => {
  const { error } = decisionSchema.validate(req.body)
  if (error) {
    return res.status(400).json({ error: true, message: error.details[0].message, code: 'VALIDATION_ERROR' })
  }
  next()
}

module.exports = { validateDecision }