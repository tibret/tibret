// Import express
import { Router } from 'express'

// Import room-controller
import {getPalette} from './../controllers/palette-controller.js'

// Create router
const router = Router()

// Add route for GET request to retrieve all room
// In server.js, rooms route is specified as '/rooms'
// this means that '/all' translates to '/rooms/all'
router.get('/get/:paletteName', getPalette)

// Export router
export default router
