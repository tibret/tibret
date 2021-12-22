// Import express
import { Router } from 'express'

// Import monster-controller
import { generate, printRoom } from './../controllers/generator-controller.js'

// Create router
const router = Router()

// Add route for GET request to retrieve all monster
// In server.js, monsters route is specified as '/monsters'
// this means that '/all' translates to '/monsters/all'
router.post('/dungeon', generate)

// Add route for GET request to retrieve all monster
// In server.js, monsters route is specified as '/monsters'
// this means that '/all' translates to '/monsters/all'
router.get('/room/:roomId', printRoom)


// Export router
export default router
