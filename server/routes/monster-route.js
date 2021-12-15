// Import express
const express = require('express')

// Import monster-controller
const monsterRoutes = require('./../controllers/monster-controller.js')

// Create router
const router = express.Router()

// Add route for GET request to retrieve all monster
// In server.js, monsters route is specified as '/monsters'
// this means that '/all' translates to '/monsters/all'
router.get('/all', monsterRoutes.monsterAll)

// Add route for POST request to create new monster
// In server.js, monsters route is specified as '/monsters'
// this means that '/create' translates to '/monsters/create'
router.post('/create', monsterRoutes.monsterCreate)

// Add route for PUT request to delete specific monster
// In server.js, monsters route is specified as '/monsters'
// this means that '/delete' translates to '/monsters/delete'
router.put('/delete', monsterRoutes.monsterDelete)

// Export router
module.exports = router
