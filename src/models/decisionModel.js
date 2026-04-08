const pool = require('../utils/db')

const saveDecision = async (data) => {
  const query = `
    INSERT INTO decisions (business_data, loan_data, status, credit_score, reasons, created_at)
    VALUES ($1, $2, $3, $4, $5, NOW())
    RETURNING id
  `
  const values = [
    JSON.stringify(data.business),
    JSON.stringify(data.loan),
    data.status,
    data.creditScore,
    JSON.stringify(data.reasons)
  ]
  const result = await pool.query(query, values)
  return { id: result.rows[0].id, ...data }
}

module.exports = { saveDecision }