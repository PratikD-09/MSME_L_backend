const pool = require('../utils/db')

const saveBusiness = async (data) => {
  const query = `
    INSERT INTO businesses (owner_name, pan, business_type, monthly_revenue, created_at)
    VALUES ($1, $2, $3, $4, NOW())
    RETURNING id
  `
  const values = [data.ownerName, data.pan, data.businessType, data.monthlyRevenue]
  const result = await pool.query(query, values)
  return { id: result.rows[0].id, ...data }
}

module.exports = { saveBusiness }