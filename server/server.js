// Import dependencies
import express from 'express'
import BodyParser from 'body-parser'
import compression from 'compression'
import cors from 'cors'
import helmet from 'helmet'

// Import routes
import monsterRouter from './routes/monster-route.js'
import roomRouter from './routes/room-route.js'
import generatorRouter from './routes/generator-route.js'
import paletteRouter from './routes/palette-route.js'

// Set default port for express app
const PORT = process.env.PORT || 4001

// Create express app
const app = express()

// Apply middleware
// Note: Keep this at the top, above routes
app.use(cors())
app.use(helmet())
app.use(compression())
app.use(BodyParser.urlencoded({ extended: false }))
app.use(BodyParser.json())

// Implement monsters route
app.use('/monsters', monsterRouter)
app.use('/rooms', roomRouter)
app.use('/generate', generatorRouter)
app.use('/palette', paletteRouter)

// Implement 500 error route
app.use(function (err, req, res, next) {
  console.error(err.stack)
  res.status(500).send('Something is broken.')
})

// Implement 404 error route
app.use(function (req, res, next) {
  res.status(404).send('Sorry we could not find that.')
})

// Start express app
app.listen(PORT, function() {
  console.log(`Server is running on: ${PORT}`)
})
