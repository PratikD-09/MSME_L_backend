require('dotenv').config({ path: 'e:\\MYFOLDER\\WorkOnProjects\\MSME_Lending\\backend\\.env' })

// Debug: Check if environment variables are loaded
console.log('🔍 Environment variables loaded:')
console.log('DATABASE_URL:', process.env.DATABASE_URL ? '✅ Set' : '❌ Not set')
console.log('MONGODB_URI:', process.env.MONGODB_URI ? '✅ Set' : '❌ Not set')
console.log('PORT:', process.env.PORT)
console.log('NODE_ENV:', process.env.NODE_ENV)

const express = require('express')
const cors = require('cors')
const helmet = require('helmet')
const morgan = require('morgan')
const winston = require('winston')
const rateLimit = require('express-rate-limit')

// Initialize database connections
require('./utils/db')
require('./utils/mongo')

const businessRoutes = require('./routes/business')
const loanRoutes = require('./routes/loan')
const decisionRoutes = require('./routes/decision')

// Health check functions
async function checkDatabaseHealth() {
  try {
    const { Pool } = require('pg')
    const pool = new Pool({ connectionString: process.env.DATABASE_URL })
    await pool.query('SELECT 1')
    await pool.end()
    return true
  } catch (error) {
    console.error('Database health check failed:', error)
    return false
  }
}

async function checkMongoHealth() {
  try {
    const mongoose = require('mongoose')
    return mongoose.connection.readyState === 1
  } catch (error) {
    console.error('MongoDB health check failed:', error)
    return false
  }
}

const app = express()

// Middleware
app.use(helmet({
  contentSecurityPolicy: {
    directives: {
      defaultSrc: ["'self'"],
      styleSrc: ["'self'", "'unsafe-inline'"],
      scriptSrc: ["'self'"],
      imgSrc: ["'self'", "data:", "https:"],
    },
  },
}))

const allowedOrigins = [
  process.env.CORS_ORIGIN,
  'http://localhost:5173',
  'http://localhost:5174',
  'https://msme-lending-frontend.vercel.app'
].filter(Boolean)

const corsOptions = {
  origin: (origin, callback) => {
    console.log('CORS check for origin:', origin)
    if (!origin) return callback(null, true)
    if (
      allowedOrigins.includes(origin) ||
      /^http:\/\/localhost:\d+$/.test(origin) ||
      /^https:\/\/.*\.vercel\.app$/.test(origin)
    ) {
      console.log('CORS allowed for origin:', origin)
      return callback(null, true)
    }
    console.log('CORS blocked for origin:', origin)
    callback(new Error('Not allowed by CORS'))
  },
  credentials: true,
  optionsSuccessStatus: 200
}
app.use(cors(corsOptions))
app.use(morgan('combined'))
app.use(express.json())

// Rate limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100 // limit each IP to 100 requests per windowMs
})
app.use(limiter)

// Routes
app.use('/api/business', businessRoutes)
app.use('/api/loan', loanRoutes)
app.use('/api/decision', decisionRoutes)

// Root route
app.get('/', (req, res) => {
  res.json({
    message: 'MSME Lending Decision System API',
    version: '1.0.0',
    endpoints: {
      health: '/health',
      ready: '/ready',
      business: '/api/business',
      loan: '/api/loan',
      decision: '/api/decision'
    }
  })
})

// Health check endpoint
app.get('/health', (req, res) => {
  res.status(200).json({
    status: 'healthy',
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
    environment: process.env.NODE_ENV || 'development'
  })
})

// Readiness check endpoint
app.get('/ready', async (req, res) => {
  try {
    // Check database connections
    const dbHealth = await checkDatabaseHealth()
    const mongoHealth = await checkMongoHealth()

    if (dbHealth && mongoHealth) {
      res.status(200).json({
        status: 'ready',
        timestamp: new Date().toISOString(),
        services: {
          database: 'healthy',
          mongodb: 'healthy'
        }
      })
    } else {
      res.status(503).json({
        status: 'not ready',
        timestamp: new Date().toISOString(),
        services: {
          database: dbHealth ? 'healthy' : 'unhealthy',
          mongodb: mongoHealth ? 'healthy' : 'unhealthy'
        }
      })
    }
  } catch (error) {
    res.status(503).json({
      status: 'error',
      timestamp: new Date().toISOString(),
      error: error.message
    })
  }
})

// Error handling
app.use((err, req, res, next) => {
  console.error('Unhandled error:', err)
  winston.error(err.stack)
  res.status(500).json({ error: true, message: 'Internal server error' })
})

const PORT = process.env.PORT || 3000
app.listen(PORT, () => {
  console.log(`🚀 MSME Lending Decision System server is running successfully on port ${PORT}`)
  console.log(`📡 API available at: http://localhost:${PORT}/api`)
})

module.exports = app