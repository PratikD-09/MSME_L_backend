const express = require('express')
const { getDecision } = require('../controllers/decisionController')
const { validateDecision } = require('../validators/decisionValidator')

const router = express.Router()

router.post('/', validateDecision, getDecision)

module.exports = router