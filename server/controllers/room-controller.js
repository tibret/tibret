// Import database
const knex = require('./../db')

// Retrieve all rooms
exports.roomAll = async (req, res) => {
  // Get all rooms from database
  knex
    .select('*') // select all records
    .from('room') // from 'room' table
    .then(userData => {
      // Send rooms extracted from database in response
      res.json(userData)
    })
    .catch(err => {
      // Send a error message in response
      res.json({ message: `There was an error retrieving rooms: ${err}` })
    })
}

// Retrieve one room
exports.roomGet = async (req, res) => {
    let roomId = req.params.roomId;
  // Get all rooms from database
  knex
    .select('*') // select all records
    .from('room') // from 'room' table
    .where('id', roomId)
    .then(userData => {
      // Send rooms extracted from database in response
      res.json(userData)
    })
    .catch(err => {
      // Send a error message in response
      res.json({ message: `There was an error retrieving rooms: ${err}` })
    })
}

// Create new room
exports.roomUpdate = async (req, res) => {
    console.log(req.body.roomJson)
  // Add new room to database
  knex('room')
    .where("id", req.body.id)
    .update({ // insert new record, a room
        'created': new Date(),
        'author_id': req.body.author_id,
        'title': req.body.title,
        'description': req.body.description,
        'roomJson': req.body.roomJson,
        'tags': req.body.tags
    })
    .then(() => {
      // Send a success message in response
      res.json({ message: `room \'${req.body.title}\' by ${req.body.author} updated.` })
    })
    .catch(err => {
      // Send a error message in response
      res.json({ message: `There was an error creating ${req.body.title} room: ${err}` })
    })
}

// Create new room
exports.roomCreate = async (req, res) => {
  // Add new room to database
  knex('room')
    .insert({ // insert new record, a room
        'created': new Date(),
        'author_id': req.body.author_id,
        'title': req.body.title,
        'description': req.body.description,
        'roomJson': req.body.roomJson,
        'tags': req.body.tags
    })
    .then(() => {
      // Send a success message in response
      res.json({ message: `room \'${req.body.title}\' by ${req.body.author} created.` })
    })
    .catch(err => {
      // Send a error message in response
      res.json({ message: `There was an error creating ${req.body.title} room: ${err}` })
    })
}

// Remove specific room
exports.roomDelete = async (req, res) => {
  // Find specific room in the database and remove it
  knex('room')
    .where('id', req.body.id) // find correct record based on id
    .del() // delete the record
    .then(() => {
      // Send a success message in response
      res.json({ message: `room ${req.body.id} deleted.` })
    })
    .catch(err => {
      // Send a error message in response
      res.json({ message: `There was an error deleting ${req.body.id} room: ${err}` })
    })
}
