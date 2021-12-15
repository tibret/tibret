// Import database
const Map = require('../Generator/Generator');
var Jimp = require('jimp');

// Retrieve all monsters
exports.generate = async (req, res) => {
    let rooms = req.body.rooms;
    let numRooms = req.body.numRooms;
    let roomJson = [];
    for(let room of rooms){
        roomJson.push(JSON.parse(room.roomJson));
    }

    console.log("Number of Rooms: " + rooms.length);

    let map = new Map();
    for(let i = 0; i < numRooms; i++){
        let idx = Math.floor(Math.random() * roomJson.length);

        let validRoom = false;
        let room = roomJson[idx];
        let newExits = room.exits.length;
        let currentExits = map.numExits();
        let tries = 0;

        //basic check to make sure that we're always leaving enough exits open
        while(!validRoom){
            console.log("Current Exits: " + currentExits);
            console.log("New Exits: " + newExits);

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
                console.log("New Index: " + idx);
                room = roomJson[idx];
                newExits = room.exits.length;
            } else {
                validRoom = true;
            }


            console.log("Room valid: " + validRoom);
            console.log("-----------");
            tries ++;
        }

        //if we currently have not enough exits, try the next room instead
        try{
            map.insertRoom(room);
            console.log("Current Number of Rooms: " + map.rooms.length);
        } catch(err){
            console.log(err);
        }
    }

    // let room_json = {"palette":"default","tiles":[{"x":0,"y":280,"tileSprite":"floor"},{"x":70,"y":70,"tileSprite":"wall_nw"},{"x":70,"y":140,"tileSprite":"wall_w"},{"x":70,"y":210,"tileSprite":"wall_w"},{"x":70,"y":280,"tileSprite":"floor"},{"x":70,"y":350,"tileSprite":"wall_w"},{"x":70,"y":420,"tileSprite":"wall_w"},{"x":70,"y":490,"tileSprite":"wall_sw"},{"x":140,"y":70,"tileSprite":"wall_n"},{"x":140,"y":140,"tileSprite":"floor"},{"x":140,"y":210,"tileSprite":"floor"},{"x":140,"y":280,"tileSprite":"floor"},{"x":140,"y":350,"tileSprite":"floor"},{"x":140,"y":420,"tileSprite":"floor"},{"x":140,"y":490,"tileSprite":"wall_s"},{"x":210,"y":70,"tileSprite":"wall_n"},{"x":210,"y":140,"tileSprite":"floor"},{"x":210,"y":210,"tileSprite":"floor"},{"x":210,"y":280,"tileSprite":"floor"},{"x":210,"y":350,"tileSprite":"floor"},{"x":210,"y":420,"tileSprite":"floor"},{"x":210,"y":490,"tileSprite":"floor"},{"x":210,"y":560,"tileSprite":"wall_w"},{"x":210,"y":630,"tileSprite":"wall_w"},{"x":210,"y":700,"tileSprite":"wall_w"},{"x":210,"y":770,"tileSprite":"wall_sw"},{"x":280,"y":0,"tileSprite":"floor"},{"x":280,"y":70,"tileSprite":"floor"},{"x":280,"y":140,"tileSprite":"floor"},{"x":280,"y":210,"tileSprite":"floor"},{"x":280,"y":280,"tileSprite":"floor"},{"x":280,"y":350,"tileSprite":"floor"},{"x":280,"y":420,"tileSprite":"floor"},{"x":280,"y":490,"tileSprite":"floor"},{"x":280,"y":560,"tileSprite":"floor"},{"x":280,"y":630,"tileSprite":"floor"},{"x":280,"y":700,"tileSprite":"floor"},{"x":280,"y":770,"tileSprite":"wall_s"},{"x":350,"y":70,"tileSprite":"wall_n"},{"x":350,"y":140,"tileSprite":"floor"},{"x":350,"y":210,"tileSprite":"floor"},{"x":350,"y":280,"tileSprite":"floor"},{"x":350,"y":350,"tileSprite":"floor"},{"x":350,"y":420,"tileSprite":"floor"},{"x":350,"y":490,"tileSprite":"floor"},{"x":350,"y":560,"tileSprite":"wall_e"},{"x":350,"y":630,"tileSprite":"floor"},{"x":350,"y":700,"tileSprite":"floor"},{"x":350,"y":770,"tileSprite":"wall_s"},{"x":420,"y":70,"tileSprite":"wall_n"},{"x":420,"y":140,"tileSprite":"floor"},{"x":420,"y":210,"tileSprite":"floor"},{"x":420,"y":280,"tileSprite":"floor"},{"x":420,"y":350,"tileSprite":"floor"},{"x":420,"y":420,"tileSprite":"floor"},{"x":420,"y":490,"tileSprite":"wall_s"},{"x":420,"y":630,"tileSprite":"wall_n"},{"x":420,"y":700,"tileSprite":"floor"},{"x":420,"y":770,"tileSprite":"wall_s"},{"x":490,"y":70,"tileSprite":"wall_ne"},{"x":490,"y":140,"tileSprite":"wall_e"},{"x":490,"y":210,"tileSprite":"floor"},{"x":490,"y":280,"tileSprite":"floor"},{"x":490,"y":350,"tileSprite":"floor"},{"x":490,"y":420,"tileSprite":"wall_e"},{"x":490,"y":490,"tileSprite":"wall_se"},{"x":490,"y":630,"tileSprite":"wall_n"},{"x":490,"y":700,"tileSprite":"floor"},{"x":490,"y":770,"tileSprite":"wall_s"},{"x":560,"y":210,"tileSprite":"wall_n"},{"x":560,"y":280,"tileSprite":"floor"},{"x":560,"y":350,"tileSprite":"wall_s"},{"x":560,"y":630,"tileSprite":"wall_n"},{"x":560,"y":700,"tileSprite":"floor"},{"x":560,"y":770,"tileSprite":"wall_s"},{"x":630,"y":210,"tileSprite":"wall_n"},{"x":630,"y":280,"tileSprite":"floor"},{"x":630,"y":350,"tileSprite":"floor"},{"x":630,"y":420,"tileSprite":"wall_w"},{"x":630,"y":490,"tileSprite":"wall_w"},{"x":630,"y":560,"tileSprite":"wall_w"},{"x":630,"y":630,"tileSprite":"floor"},{"x":630,"y":700,"tileSprite":"floor"},{"x":630,"y":770,"tileSprite":"wall_s"},{"x":700,"y":210,"tileSprite":"wall_n"},{"x":700,"y":280,"tileSprite":"floor"},{"x":700,"y":350,"tileSprite":"floor"},{"x":700,"y":420,"tileSprite":"floor"},{"x":700,"y":490,"tileSprite":"floor"},{"x":700,"y":560,"tileSprite":"floor"},{"x":700,"y":630,"tileSprite":"floor"},{"x":700,"y":700,"tileSprite":"floor"},{"x":700,"y":770,"tileSprite":"wall_s"},{"x":770,"y":210,"tileSprite":"wall_ne"},{"x":770,"y":280,"tileSprite":"wall_e"},{"x":770,"y":350,"tileSprite":"wall_e"},{"x":770,"y":420,"tileSprite":"wall_e"},{"x":770,"y":490,"tileSprite":"wall_e"},{"x":770,"y":560,"tileSprite":"wall_e"},{"x":770,"y":630,"tileSprite":"wall_e"},{"x":770,"y":700,"tileSprite":"wall_e"},{"x":770,"y":770,"tileSprite":"wall_se"}],"exits":[{"x":0,"y":280,"exitSprite":"exit_w"},{"x":280,"y":0,"exitSprite":"exit_n"}]};
    // let hallway_json = {"palette":"default","tiles":[{"x":0,"y":280,"tileSprite":"floor"},{"x":70,"y":280,"tileSprite":"floor"},{"x":140,"y":280,"tileSprite":"floor"},{"x":210,"y":280,"tileSprite":"floor"},{"x":280,"y":0,"tileSprite":"floor"},{"x":280,"y":70,"tileSprite":"floor"},{"x":280,"y":140,"tileSprite":"floor"},{"x":280,"y":210,"tileSprite":"floor"},{"x":280,"y":280,"tileSprite":"floor"},{"x":280,"y":350,"tileSprite":"floor"},{"x":280,"y":420,"tileSprite":"floor"},{"x":280,"y":490,"tileSprite":"floor"},{"x":280,"y":560,"tileSprite":"floor"},{"x":350,"y":280,"tileSprite":"floor"},{"x":420,"y":280,"tileSprite":"floor"},{"x":490,"y":280,"tileSprite":"floor"},{"x":560,"y":280,"tileSprite":"floor"}],"exits":[{"x":0,"y":280,"exitSprite":"exit_w"},{"x":280,"y":0,"exitSprite":"exit_n"},{"x":280,"y":560,"exitSprite":"exit_s"},{"x":560,"y":280,"exitSprite":"exit_e"}]};
    // let smol_json = {"palette":"default","tiles":[{"x":0,"y":0,"tileSprite":"wall_nw"},{"x":0,"y":70,"tileSprite":"wall_sw"},{"x":70,"y":0,"tileSprite":"wall_n"},{"x":70,"y":70,"tileSprite":"floor"},{"x":140,"y":0,"tileSprite":"wall_ne"},{"x":140,"y":70,"tileSprite":"wall_se"}],"exits":[{"x":70,"y":70,"exitSprite":"exit_s"}]};
    // let cells_json = {"palette":"default","tiles":[{"x":70,"y":0,"tileSprite":"wall_nw"},{"x":70,"y":70,"tileSprite":"wall_w"},{"x":70,"y":140,"tileSprite":"wall_nw"},{"x":70,"y":210,"tileSprite":"wall_w"},{"x":70,"y":280,"tileSprite":"wall_nw"},{"x":70,"y":350,"tileSprite":"wall_sw"},{"x":140,"y":0,"tileSprite":"wall_ne"},{"x":140,"y":70,"tileSprite":"floor"},{"x":140,"y":140,"tileSprite":"wall_ne"},{"x":140,"y":210,"tileSprite":"floor"},{"x":140,"y":280,"tileSprite":"wall_ne"},{"x":140,"y":350,"tileSprite":"wall_s"},{"x":210,"y":0,"tileSprite":"wall_n"},{"x":210,"y":70,"tileSprite":"floor"},{"x":210,"y":140,"tileSprite":"floor"},{"x":210,"y":210,"tileSprite":"floor"},{"x":210,"y":280,"tileSprite":"floor"},{"x":210,"y":350,"tileSprite":"floor"},{"x":210,"y":420,"tileSprite":"floor"},{"x":280,"y":0,"tileSprite":"wall_nw"},{"x":280,"y":70,"tileSprite":"floor"},{"x":280,"y":140,"tileSprite":"wall_nw"},{"x":280,"y":210,"tileSprite":"floor"},{"x":280,"y":280,"tileSprite":"wall_nw"},{"x":280,"y":350,"tileSprite":"wall_s"},{"x":350,"y":0,"tileSprite":"wall_ne"},{"x":350,"y":70,"tileSprite":"wall_e"},{"x":350,"y":140,"tileSprite":"wall_ne"},{"x":350,"y":210,"tileSprite":"wall_e"},{"x":350,"y":280,"tileSprite":"wall_ne"},{"x":350,"y":350,"tileSprite":"wall_se"}],"exits":[{"x":210,"y":420,"exitSprite":"exit_s"}]};
    // let map = new Map();
    // map.insertRoom(cells_json);
    // map.insertRoom(hallway_json);
    // map.insertRoom(cells_json);
    // map.insertRoom(room_json);
    // map.insertRoom(hallway_json);
    // map.insertRoom(room_json);
    // map.insertRoom(room_json);
    // map.insertRoom(smol_json);
    // map.insertRoom(room_json);
    // map.insertRoom(smol_json);
    // map.insertRoom(room_json);
    // map.insertRoom(room_json);
    // map.insertRoom(smol_json);
    // map.insertRoom(smol_json);
    const img = await map.toImage();

    img.getBase64Async(Jimp.MIME_PNG).then(image => {
        res.json({img: image});
    });
}
