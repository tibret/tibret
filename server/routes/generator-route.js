// Import express
const express = require('express')

// Import monster-controller
const generatorRoutes = require('./../controllers/generator-controller.js')

// Create router
const router = express.Router()

// Add route for GET request to retrieve all monster
// In server.js, monsters route is specified as '/monsters'
// this means that '/all' translates to '/monsters/all'
router.post('/dungeon', generatorRoutes.generate)


// Export router
module.exports = router
