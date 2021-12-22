// Import express
import { Router } from 'express'

// Import monster-controller
import { monsterAll, monsterCreate, monsterDelete } from './../controllers/monster-controller.js'

// Create router
const router = Router()

// Add route for GET request to retrieve all monster
// In server.js, monsters route is specified as '/monsters'
// this means that '/all' translates to '/monsters/all'
router.get('/all', monsterAll)

// Add route for POST request to create new monster
// In server.js, monsters route is specified as '/monsters'
// this means that '/create' translates to '/monsters/create'
router.post('/create', monsterCreate)

// Add route for PUT request to delete specific monster
// In server.js, monsters route is specified as '/monsters'
// this means that '/delete' translates to '/monsters/delete'
router.put('/delete', monsterDelete)

// Export router
export default router
