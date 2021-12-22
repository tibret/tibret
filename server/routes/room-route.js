// Import express
import { Router } from 'express'

// Import room-controller
import { roomAll, roomGet, roomCreate, roomUpdate, roomDelete } from './../controllers/room-controller.js'

// Create router
const router = Router()

// Add route for GET request to retrieve all room
// In server.js, rooms route is specified as '/rooms'
// this means that '/all' translates to '/rooms/all'
router.get('/all', roomAll)

// Add route for GET request to retrieve all room
// In server.js, rooms route is specified as '/rooms'
// this means that '/all' translates to '/rooms/all'
router.get('/get/:roomId', roomGet)

// Add route for POST request to create new room
// In server.js, rooms route is specified as '/rooms'
// this means that '/create' translates to '/rooms/create'
router.post('/create', roomCreate)

// Add route for POST request to update a room
// In server.js, rooms route is specified as '/rooms'
// this means that '/create' translates to '/rooms/create'
router.post('/update', roomUpdate)

// Add route for PUT request to delete specific room
// In server.js, rooms route is specified as '/rooms'
// this means that '/delete' translates to '/rooms/delete'
router.put('/delete', roomDelete)

// Export router
export default router
