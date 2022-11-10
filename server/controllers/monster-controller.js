// Import database
import db from '../db.js'

// Retrieve all monsters
export async function monsterAll(req, res) {
  // Get all monsters from database
  knex('monster').select('*') // select all records
    .from('monster') // from 'monster' table
    .then(userData => {
      // Send monsters extracted from database in response
      res.json(userData)
    })
    .catch(err => {
      // Send a error message in response
      res.json({ message: `There was an error retrieving monsters: ${err}` })
    })
}

// Create new monster
export async function monsterCreate(req, res) {
  // Add new monster to database
  knex('monster')
    .insert({ // insert new record, a monster
      'author': req.body.author,
      'title': req.body.title,
      'pubDate': req.body.pubDate,
      'rating': req.body.rating
    })
    .then(() => {
      // Send a success message in response
      res.json({ message: `Monster \'${req.body.title}\' by ${req.body.author} created.` })
    })
    .catch(err => {
      // Send a error message in response
      res.json({ message: `There was an error creating ${req.body.title} monster: ${err}` })
    })
}

// Remove specific monster
export async function monsterDelete(req, res) {
  // Find specific monster in the database and remove it
  knex('monster')
    .where('id', req.body.id) // find correct record based on id
    .del() // delete the record
    .then(() => {
      // Send a success message in response
      res.json({ message: `Monster ${req.body.id} deleted.` })
    })
    .catch(err => {
      // Send a error message in response
      res.json({ message: `There was an error deleting ${req.body.id} monster: ${err}` })
    })
}
