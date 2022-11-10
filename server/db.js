import Surreal from "surrealdb.js";

const db = new Surreal('http://127.0.0.1:8000/rpc');

export async function initDB() {
	try {
		// Signin as a namespace, database, or root user
		await db.signin({
			user: 'root',
			pass: 'root',
		});

		// Select a specific namespace / database
		await db.use('test', 'test');
	} catch (e) {
		console.error('ERROR', e);
	}
}

export default db

/*
// Import path module
const path = require('path')

// Get the location of database.sqlite file
const dbPath = path.resolve(__dirname, 'db/db.sqlite')

// Create connection to SQLite database
const knex = require('knex')({
  client: 'sqlite3',
  connection: {
    filename: dbPath,
  },
  useNullAsDefault: true
})

// Create a table in the database called "books"
knex.schema
  // Make sure no "books" table exists
  // before trying to create new
  .hasTable('monster')
    .then((exists) => {
      if (!exists) {
        // If no "books" table exists
        // create new, with "id", "author", "title",
        // "pubDate" and "rating" columns
        // and use "id" as a primary identification
        // and increment "id" with every new record (book)
        return knex.schema.createTable('monster', (table)  => {
          table.increments('id').primary()
          table.integer('author_id')
          table.timestamp('created')
          table.string('name')
          table.string('size')
          table.string('type')
          table.string('subtype')
          table.string('alignment')
          table.integer('armor_class')
          table.integer('hit_points')
          table.string('hit_dice')
          table.string('speed')
          table.string('damage_vulnerabilities')
          table.string('damage_resistances')
          table.string('damage_immunities')
          table.string('condition_immunities')
          table.string('senses')
          table.string('languages')
          table.integer('strength')
          table.integer('dexterity')
          table.integer('constitution')
          table.integer('intelligence')
          table.integer('wisdom')
          table.integer('charisma')
          table.integer('strength_save')
          table.integer('dexterity_save')
          table.integer('constitution_save')
          table.integer('intelligence_save')
          table.integer('wisdom_save')
          table.integer('charisma_save')
          table.integer('history')
          table.integer('arcana')
          table.integer('survival')
          table.integer('nature')
          table.integer('acrobatics')
          table.integer('deception')
          table.integer('investigation')
          table.integer('athletics')
          table.integer('medicine')
          table.integer('stealth')
          table.integer('persuasion')
          table.integer('insight')
          table.integer('religion')
          table.integer('intimidation')
          table.integer('perception')
          table.integer('challenge_rating')
          table.string('license')
        })
        .then(() => {
          // Log success message
          console.log('Table \'Monster\' created')
        })
        .catch((error) => {
          console.error(`There was an error creating table: ${error}`)
        })
      }
    })
    .then(() => {
      // Log success message
      console.log('done')
    })
    .catch((error) => {
      console.error(`There was an error setting up the database: ${error}`)
    })


    // Create a table in the database called "books"
    knex.schema
      // Make sure no "books" table exists
      // before trying to create new
      .hasTable('room')
        .then((exists) => {
          if (!exists) {
            // If no "books" table exists
            // create new, with "id", "author", "title",
            // "pubDate" and "rating" columns
            // and use "id" as a primary identification
            // and increment "id" with every new record (book)
            return knex.schema.createTable('room', (table)  => {
              table.increments('id').primary()
              table.integer('author_id')
              table.timestamp('created')
              table.string('title')
              table.string('description')
              table.string('roomJson')
              table.string('tags')
            })
            .then(() => {
              // Log success message
              console.log('Table \'room\' created')
            })
            .catch((error) => {
              console.error(`There was an error creating table: ${error}`)
            })
          }
        })
        .then(() => {
          // Log success message
          console.log('done')
        })
        .catch((error) => {
          console.error(`There was an error setting up the database: ${error}`)
        })

// Just for debugging purposes:
// Log all data in "books" table
// knex.select('*').from('monster')
//   .then(data => console.log('data:', data))
//   .catch(err => console.log(err))
//
// knex.select('*').from('room')
//     .then(data => console.log('data:', data))
//     .catch(err => console.log(err))

// Export the database
module.exports = knex
*/