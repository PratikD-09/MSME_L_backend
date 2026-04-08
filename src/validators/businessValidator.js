const Joi = require('joi')

const businessSchema = Joi.object({
  ownerName: Joi.string().required(),
  pan: Joi.string().pattern(/^[A-Z]{5}[0-9]{4}[A-Z]{1}$/).required(),
  businessType: Joi.string().valid('retail', 'manufacturing', 'services', 'other').required(),
  monthlyRevenue: Joi.number().positive().required()
})

const validateBusiness = (req, res, next) => {
  const { error } = businessSchema.validate(req.body)
  if (error) {
    return res.status(400).json({ error: true, message: error.details[0].message, code: 'VALIDATION_ERROR' })
  }
  next()
}

module.exports = { validateBusiness }