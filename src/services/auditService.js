require('../utils/mongo')
const mongoose = require('mongoose')

const auditSchema = new mongoose.Schema({
  action: String,
  data: Object,
  timestamp: { type: Date, default: Date.now }
})

const AuditLog = mongoose.model('AuditLog', auditSchema)

const logAudit = async (action, data) => {
  const log = new AuditLog({ action, data })
  await log.save()
}

module.exports = { logAudit }