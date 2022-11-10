import Jimp from 'jimp'
import fs from 'fs'

class Tile{
    position = [0,0];
    sprite = "";

    constructor(params){
        this.position = [params.x, params.y];
        this.sprite = params.tileSprite;
    }

    rotate(){
        let oldpos = [...this.position];
        this.position = [oldpos[1], oldpos[0] * -1]
    }
}

class Exit{
    position = [0, 0];
    facing = "";

    constructor(params){
        this.position = [params.x, params.y];
        this.facing = this.getFacing(params.exitSprite);
    }

    getFacing(exitSprite){
        if (exitSprite === "exit_n"){
            return 'N';
        }
        if (exitSprite === "exit_s"){
            return 'S';
        }
        if (exitSprite === "exit_e"){
            return 'E';
        }
        if (exitSprite === "exit_w"){
            return 'W';
        }
    }

    rotate(){
        let oldpos = [...this.position];
        this.position = [oldpos[1], oldpos[0] * -1];
        if(this.facing === 'N'){
            this.facing = 'W'
        }
        else if(this.facing === 'E'){
            this.facing = 'N'
        }
        else if(this.facing === 'S'){
            this.facing = 'E'
        }
        else if(this.facing === 'W'){
            this.facing = 'S'
        }
    }
}

class Room{
    // the actual tiles that make up the room
    tiles = [];
    // points (if any) where another room can be attached, "N" "E" "S" or "W"
    exits = [];

    position = [0, 0];
    name = "";
    flavorText = "";
    number=0;
    unique = false;
    // the degrees that the room has been rotated by
    rotation = 0;

    constructor(params){
        let roomDef = JSON.parse(params.roomJson);
        this.name = params.title;
        this.flavorText = params.description;
        this.number=params.id;
        this.unique = params.uniqueRoom == 1;

        this.tiles = [];
        for(let tileJson of roomDef.tiles){
            let tile = new Tile(tileJson);
            this.tiles.push(tile);
        }

        this.exits = [];
        for(let exitJson of roomDef.exits){
            let exit = new Exit(exitJson);
            this.exits.push(exit);
        }
    }

    removeExit(exit){
        this.exits = this.exits.filter(e =>
            !(e.position[0] === exit.position[0] && e.position[1] === exit.position[1])
        );
    }

    rotate(){
        for(let tile of this.tiles){
            tile.rotate();
        }
        for(let exit of this.exits){
            exit.rotate();
        }

        this.rotation = (this.rotation + 90) % 360
    }

    sizeX(){
        let minx = 0;
        let maxx = 0;
        for(let tile of this.tiles){
            let x = tile.position[0];
            if(x < minx){
                minx = x;
            }
            if(x > maxx){
                maxx = x;
            }
        }

        return maxx-minx;
    }

    sizeY(){
        let miny = 0;
        let maxy = 0;
        for(let tile of this.tiles){
            let x = tile.position[0];
            if(x < miny){
                miny = x;
            }
            if(x > maxy){
                maxy = x;
            }
        }

        return maxy-miny;
    }

    labelOffset(){
        return [this.position[0] + this.sizeX()/2, this.position[1] + this.sizeY()/2];
    }
}

class Map{
    rooms = [];
    constructor(){
        this.rooms = [];
    }

    numExits(){
        let numExits = 0;
        for(let room of this.rooms){
            numExits += room.exits.length;
        }

        return numExits;
    }

    insertRoom(params){
        let room = new Room(params);

        if(this.rooms.length === 0){
            room.position = [0,0];
            this.rooms.push(room);
            return room;
        }

        for(let i = 0; i < 4; i++){
            let insertPosition = this.findInsertPosition(room);
            if(insertPosition == null){
                room.rotate();
            } else {
                room.position = insertPosition;
                this.rooms.push(room);
                return room;
            }
        }
    }

    findInsertPosition(room){
        for(let currentExit of room.exits){
            for(let r of this.rooms){
                for(let e of r.exits){
                    if(facingMatches(currentExit, e)){
                        let insertPosition = this.calculateInsertPosition(r, e, currentExit);
                        if(!this.areCollisions(room, insertPosition)){
                            r.removeExit(e);
                            room.removeExit(currentExit);
                            return insertPosition;
                        }
                    }
                }
            }
        }

        return null;
    }

    areCollisions(room, roomPosition){
        for(let r of this.rooms){
            for(let t of r.tiles){
                for( let tile of room.tiles){
                    if((tile.position[0] + roomPosition[0]) === (t.position[0] + r.position[0])
                        && (tile.position[1] + roomPosition[1]) === (t.position[1] + r.position[1])){
                        return true;
                    }
                }
            }
        }

        return false;
    }

    calculateInsertPosition(room1, exit1, exit2){
        let desiredCoord = [room1.position[0] + exit1.position[0], room1.position[1] + exit1.position[1]];
        if (exit1.facing === 'N'){
            desiredCoord[1] = desiredCoord[1] - 70
        }
        if (exit1.facing === 'S'){
            desiredCoord[1] = desiredCoord[1] + 70
        }
        if (exit1.facing === 'E'){
            desiredCoord[0] = desiredCoord[0] + 70
        }
        if (exit1.facing === 'W'){
            desiredCoord[0] = desiredCoord[0] - 70
        }

        return [desiredCoord[0] - exit2.position[0], desiredCoord[1] - exit2.position[1]]
    }

    async toImage(){
        let minX = 0;
        let minY = 0;
        let maxX = 0;
        let maxY = 0;

        for(let room of this.rooms){
            if(room.position[0] < minX){
                minX = room.position[0];
            }
            if(room.position[0] > maxX){
                maxX = room.position[0];
            }
            if(room.position[1] < minY){
                minY = room.position[1];
            }
            if(room.position[1] > maxY){
                maxY = room.position[1];
            }

            for(let tile of room.tiles){
                let abs_pos_x = room.position[0] + tile.position[0];
                let abs_pos_y = room.position[1] + tile.position[1];
                if (abs_pos_x < minX){
                    minX = abs_pos_x;
                }
                if (abs_pos_x > maxX){
                    maxX = abs_pos_x;
                }
                if (abs_pos_y < minY){
                    minY = abs_pos_y;
                }
                if (abs_pos_y > maxY){
                    maxY = abs_pos_y;
                }
            }
        }

        let image = new Jimp(maxX - minX + 70 + 400, maxY - minY + 70, 'white', (err, image) => {
            if (err) throw err
        });

        let infoX = maxX - minX + 70;
        let infoY = 0;

        const infoFont = await Jimp.loadFont(Jimp.FONT_SANS_16_BLACK);
        const labelFont = await Jimp.loadFont(Jimp.FONT_SANS_32_BLACK);

        let promises = [];
        for (let room of this.rooms){
            for (let tile of room.tiles){
                let file = fs.readFileSync("./public/images/default/" + tile.sprite+".png");
                const sprite = await Jimp.read(file);
                // console.log("Adding sprite "+ tile.sprite + " with rotation "+ room.rotation);
                await sprite.rotate(room.rotation);
                await image.composite(sprite, room.position[0] + tile.position[0] - minX, room.position[1] + tile.position[1] - minY);
            }

            if(room.unique){
                //print the label
                let labelOffset = room.labelOffset();
                await image.print(labelFont, labelOffset[0] - minX, labelOffset[1] - minY, room.number);

                //print the description
                await image.print(infoFont, infoX, infoY, room.number + " - " + room.name, 390);
                infoY += Jimp.measureTextHeight(infoFont, room.number + " - " + room.name, 390); // move y-value of the info;
                await image.print(infoFont, infoX, infoY, room.flavorText, 390);
                infoY += Jimp.measureTextHeight(infoFont, room.flavorText, 390); // move y-value of the info;
                infoY += 30;
            }
        }

        // return Promise.all(promises);

        return image;
    }
}

function facingMatches(exit1, exit2) {
    if ((exit1.facing === 'N' && exit2.facing === 'S')
          || (exit1.facing === 'S' && exit2.facing === 'N')
          || (exit1.facing === 'E' && exit2.facing === 'W')
          || (exit1.facing === 'W' && exit2.facing === 'E')){
      return true;
    }

    return false;
}

export default Map;