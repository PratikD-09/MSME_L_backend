const Joi = require('joi')

const loanSchema = Joi.object({
  loanAmount: Joi.number().positive().required(),
  tenureMonths: Joi.number().integer().min(1).max(120).required(),
  loanPurpose: Joi.string().required()
})

const validateLoan = (req, res, next) => {
  const { error } = loanSchema.validate(req.body)
  if (error) {
    return res.status(400).json({ error: true, message: error.details[0].message, code: 'VALIDATION_ERROR' })
  }
  next()
}

module.exports = { validateLoan }