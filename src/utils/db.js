const { Pool } = require('pg')

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: process.env.NODE_ENV === 'production' ? { rejectUnauthorized: false } : false
})

// Log PostgreSQL connection
pool.on('connect', (client) => {
  console.log('✅ Connected to PostgreSQL database')
})

pool.on('error', (err, client) => {
  console.error('❌ PostgreSQL connection error:', err.message)
})

// Test the connection
pool.query('SELECT NOW()', (err, res) => {
  if (err) {
    console.error('❌ PostgreSQL test query failed:', err.message)
  } else {
    console.log('✅ PostgreSQL connection test successful')
  }
})

module.exports = pool