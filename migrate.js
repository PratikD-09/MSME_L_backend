const { Pool } = require('pg')
const fs = require('fs')
require('dotenv').config({ path: '../.env' })

async function runMigration() {
  const pool = new Pool({
    connectionString: process.env.DATABASE_URL,
    ssl: { rejectUnauthorized: false }
  })

  try {
    console.log('🔄 Connecting to PostgreSQL...')

    // Read the schema file
    const schemaSQL = fs.readFileSync('./schema.sql', 'utf8')

    console.log('📄 Executing schema migration...')

    // Split SQL commands and execute them
    const commands = schemaSQL.split(';').filter(cmd => cmd.trim().length > 0)

    console.log(`📋 Found ${commands.length} SQL commands to execute`)

    for (let i = 0; i < commands.length; i++) {
      const command = commands[i].trim()
      if (command) {
        console.log(`🔄 Executing command ${i + 1}/${commands.length}...`)
        try {
          await pool.query(command)
          console.log('✅ Command executed successfully')
        } catch (cmdError) {
          console.error('❌ Command failed:', cmdError.message)
          throw cmdError
        }
      }
    }

    console.log('🎉 Migration completed successfully!')

  } catch (error) {
    console.error('❌ Migration failed:', error.message)
    console.error('Stack:', error.stack)
  } finally {
    await pool.end()
    console.log('🔌 Database connection closed')
  }
}

runMigration()