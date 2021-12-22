// Import database
import Map from '../Generator/Generator.js';
import Jimp from 'jimp';
import knex from '../db.cjs';


// Retrieve all monsters
export async function generate(req, res) {
    let rooms = req.body.rooms;
    let numRooms = req.body.numRooms;

    // console.log("Number of Rooms: " + roomJson.length);

    let map = new Map();
    for(let i = 0; i < numRooms; i++){
        let idx = Math.floor(Math.random() * rooms.length);

        let validRoom = false;
        let room = rooms[idx];
        let roomDef = JSON.parse(room.roomJson);
        let newExits = roomDef.exits.length;
        let currentExits = map.numExits();
        let tries = 0;

        //basic check to make sure that we're always leaving enough exits open
        while(!validRoom){
            // console.log("Current Exits: " + currentExits);
            // console.log("New Exits: " + newExits);

            //if we've tried everythintg, give up and just add whatever room we're looking at
            if(tries === rooms.length){
                break;
            }

            //first, check if we're on the last room, then everything is valid
            if(i === numRooms-1){
                validRoom = true;
                continue;
            }

            //the new room will result in us not having enough exits for more rooms
            if(newExits <= 1 && currentExits <= 1){
                idx = (idx + 1);
                if(idx === rooms.length){
                    idx = 0;
                }
                // console.log("New Index: " + idx);
                room = rooms[idx];
                roomDef = JSON.parse(room.roomJson);
                newExits = roomDef.exits.length;
            } else {
                validRoom = true;
            }


            //console.log("Room valid: " + validRoom);
            // console.log("-----------");
            tries ++;
        }

        try{
            map.insertRoom(roomDef);
            // console.log("Current Number of Rooms: " + map.rooms.length);
            if(room.uniqueRoom){
                console.log("Rooms before " + rooms.length);

                //we have a unique room, prevent it from being used again
                console.log("UNIQUE ROOM USED");
                rooms = rooms.filter(r => r.id != room.id);
                console.log("Rooms after " + rooms.length);
            }

        } catch(err){
            console.log(err);
        }
    }

    //stitch the image together from tiles
    const img = await map.toImage();

    //put it in the response
    img.getBase64Async(Jimp.MIME_PNG).then(image => {
        res.json({img: image});
    });
}

// Retrieve all monsters
export async function printRoom(req, res) {
    let roomId = req.params.roomId;
    // Get all rooms from database
    knex
      .select('*') // select all records
      .from('room') // from 'room' table
      .where('id', roomId)
      .then(userData => {
        let roomDef = JSON.parse(userData[0].roomJson);

        let map = new Map();
        map.insertRoom(roomDef);
    
        //stitch the image together from tiles
        map.toImage().then(img => {
            //put it in the response
            img.getBase64Async(Jimp.MIME_PNG).then(image => {
                res.json({img: image});
            });
        });
      })
      .catch(err => {
        // Send a error message in response
        res.json({ message: `There was an error retrieving rooms: ${err}` })
      })
}
