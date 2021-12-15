// Import express
const express = require('express')

// Import room-controller
const roomRoutes = require('./../controllers/room-controller.js')

// Create router
const router = express.Router()

// Add route for GET request to retrieve all room
// In server.js, rooms route is specified as '/rooms'
// this means that '/all' translates to '/rooms/all'
router.get('/all', roomRoutes.roomAll)

// Add route for GET request to retrieve all room
// In server.js, rooms route is specified as '/rooms'
// this means that '/all' translates to '/rooms/all'
router.get('/get/:roomId', roomRoutes.roomGet)

// Add route for POST request to create new room
// In server.js, rooms route is specified as '/rooms'
// this means that '/create' translates to '/rooms/create'
router.post('/create', roomRoutes.roomCreate)

// Add route for POST request to update a room
// In server.js, rooms route is specified as '/rooms'
// this means that '/create' translates to '/rooms/create'
router.post('/update', roomRoutes.roomUpdate)

// Add route for PUT request to delete specific room
// In server.js, rooms route is specified as '/rooms'
// this means that '/delete' translates to '/rooms/delete'
router.put('/delete', roomRoutes.roomDelete)

// Export router
module.exports = router
