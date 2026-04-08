const express = require('express')
const { createBusiness } = require('../controllers/businessController')
const { validateBusiness } = require('../validators/businessValidator')

const router = express.Router()

router.post('/', validateBusiness, createBusiness)

module.exports = router