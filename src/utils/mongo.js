const mongoose = require('mongoose')

mongoose.connect(process.env.MONGODB_URI)

// Log MongoDB connection
mongoose.connection.on('connected', () => {
  console.log('✅ Connected to MongoDB database')
})

mongoose.connection.on('error', (err) => {
  console.error('❌ MongoDB connection error:', err.message)
})

mongoose.connection.on('disconnected', () => {
  console.log('⚠️  MongoDB disconnected')
})

module.exports = mongoose