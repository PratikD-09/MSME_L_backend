const pool = require('../utils/db')

const saveLoan = async (data) => {
  const query = `
    INSERT INTO loans (loan_amount, tenure_months, loan_purpose, created_at)
    VALUES ($1, $2, $3, NOW())
    RETURNING id
  `
  const values = [data.loanAmount, data.tenureMonths, data.loanPurpose]
  const result = await pool.query(query, values)
  return { id: result.rows[0].id, ...data }
}

module.exports = { saveLoan }