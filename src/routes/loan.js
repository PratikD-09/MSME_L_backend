const express = require('express')
const { createLoan } = require('../controllers/loanController')
const { validateLoan } = require('../validators/loanValidator')

const router = express.Router()

router.post('/', validateLoan, createLoan)

module.exports = router