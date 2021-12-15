var highlightRect;
var canvasHeight;
var canvasWidth;
var currentImg;
var currentLayer;
var canvas;
var ctx;
var placedTiles;
var placedExits;
var drawing_mode;
var clearButtons;

var TILE_SIZE = 70;

function domloaded(){
    currentLayer = "TILE";
    placedTiles = new Array();
    placedExits = new Array();
    canvas = document.getElementById("tileEditor");
    ctx = canvas.getContext("2d");
    canvasHeight = ctx.canvas.clientHeight;
    canvasWidth = ctx.canvas.clientWidth;
    initGrid(ctx);
    initButtons(ctx);
    canvas.addEventListener('mousemove', e=>{highlightCurrentSquare(e)});
    canvas.addEventListener('mouseup', e=>{unSetDrawingMode(e)});
    canvas.addEventListener('mousedown', e=>{setDrawingMode(e)});
    deserializeDungeon();
    drawTiles(ctx);
    drawExits(ctx);
};

function redraw(ctx){
    ctx.clearRect(0,0,canvasWidth, canvasHeight)
    initGrid(ctx);
    drawTiles(ctx);
    drawExits(ctx);
    serializeDungeon();
}

function highlightCurrentSquare(e){
    // important: correct mouse position:
    var rect = canvas.getBoundingClientRect(),
        x = Math.floor((e.clientX - rect.left) - (e.clientX - rect.left)%TILE_SIZE),
        y = Math.floor((e.clientY - rect.top) - (e.clientY - rect.top)%TILE_SIZE);


    redraw(ctx);

    if(drawing_mode){
        gridInteraction(e);
    }

    ctx.globalAlpha = 0.2;
    if(currentImg == null && currentLayer == "TILE"){
        ctx.fillStyle = "#0000FF";
        ctx.fillRect(x, y, TILE_SIZE, TILE_SIZE);
    } else if(currentImg == null && currentLayer == "EXIT"){
        ctx.fillStyle = "#FF0000";
        ctx.fillRect(x, y, TILE_SIZE, TILE_SIZE);
    }  else if(currentImg != null) {
        ctx.drawImage(currentImg, x, y, TILE_SIZE, TILE_SIZE);
    }
    ctx.globalAlpha = 1;
}

function setDrawingMode(e){
    drawing_mode = true;
    gridInteraction(e);
    redraw(ctx);
}

function unSetDrawingMode(e){
    drawing_mode = false;
}

function gridInteraction(e){
    // important: correct mouse position:
    var rect = canvas.getBoundingClientRect(),
        x = (e.clientX - rect.left),
        y = (e.clientY - rect.top),
        tileX = Math.floor((e.clientX - rect.left) - (e.clientX - rect.left)%TILE_SIZE),
        tileY = Math.floor((e.clientY - rect.top) - (e.clientY - rect.top)%TILE_SIZE);;

    //if we're not in a button, then place a new tile
    if(currentImg != null && currentLayer == "TILE"){
        if(placedTiles[tileX] == null){
            placedTiles[tileX] = new Array();
        }
        placedTiles[tileX][tileY] = currentImg;
    } else if(currentImg != null && currentLayer == "EXIT"){
        if(placedExits[tileX] == null){
            placedExits[tileX] = new Array();
        }
        placedExits[tileX][tileY] = currentImg;
    } else if(currentLayer == "TILE"){
        if(placedTiles[tileX] != null){
            placedTiles[tileX][tileY] = null;
        }
    } else if(currentLayer == "EXIT"){
        if(placedExits[tileX] != null){
            placedExits[tileX][tileY] = null;
        }
    }
}

function drawTiles(ctx){
    if(placedTiles.length < 1){
        return;
    }
    for(var x = 0 ; x <= canvasWidth; x += TILE_SIZE){
        for(var y = 0 ; y <= canvasHeight; y += TILE_SIZE){
            if(placedTiles[x] != null && placedTiles[x][y] != null){
                ctx.drawImage(placedTiles[x][y], x, y, TILE_SIZE, TILE_SIZE);
            }
        }
    }
}

function drawExits(){
    if(placedExits.length < 1){
        return;
    }
    for(var x = 0 ; x <= canvasWidth; x += TILE_SIZE){
        for(var y = 0 ; y <= canvasHeight; y += TILE_SIZE){
            if(placedExits[x] != null && placedExits[x][y] != null){
                ctx.drawImage(placedExits[x][y], x, y, TILE_SIZE, TILE_SIZE);
            }
        }
    }
}

function setCurrentImg(e){
    //console.log(e);
    currentLayer = e.target.dataset.layer;
    if(currentImg != null){
        //remove the active style
        currentImg.classList.remove("activeTile");
    }
    for(var clearButton of clearButtons){
        clearButton.classList.remove("activeTile");
    }
    currentImg = e.target;

    //add the active style
    currentImg.classList.add("activeTile");
}

function unSetCurrentImg(e){
    currentLayer = e.target.dataset.layer;
    if(currentImg != null){
        //remove the active style
        currentImg.classList.remove("activeTile");
    }
    for(var clearButton of clearButtons){
        clearButton.classList.remove("activeTile");
    }
    currentImg = null;

    //add the active style
    e.target.classList.add("activeTile");
}

function initGrid(ctx){
    ctx.fillStyle = "#0000FF";

    for(var i = 0 ; i <= canvasWidth; i += TILE_SIZE){
         ctx.fillRect(i-1, 0, 2, canvasHeight);
    }
    for(var j = 0 ; j <= canvasHeight; j += TILE_SIZE){
         ctx.fillRect(0, j-1, canvasWidth, 2);
    }
}

function initButtons(ctx){
    //initialize our set of tiles
    var imgs = document.getElementsByClassName("tileButton");
    for(var i=0; i<imgs.length; i++){
        imgs[i].addEventListener('click', e=>setCurrentImg(e));
    }

    imgs = document.getElementsByClassName("exitButton");
    for(var i=0; i<imgs.length; i++){
        imgs[i].addEventListener('click', e=>setCurrentImg(e));
    }

    clearButtons = document.getElementsByClassName("clearButton");
    for(var i=0; i<clearButtons.length; i++){
        clearButtons[i].addEventListener('click', e=>unSetCurrentImg(e));
    }
}

function isClickInRect(clickX, clickY, rectX, rectY, rectWidth, rectHeight){
    return clickX >= rectX && clickX <= (rectX + rectWidth) && clickY > rectY && clickY < (rectY + rectHeight);
}

function serializeDungeon(){
    var roomJson = {"palette": "default", "tiles":[], "exits":[]};
    var counter = 0;

    for(var x=0; x < placedTiles.length; x+=70){
        if(!placedTiles[x]){
            continue;
        }
        for(var y=0; y <placedTiles[x].length; y+=70){
            if(!placedTiles[x][y]){
                continue;
            }

            var room = {"x":x,
                "y":y,
                "tileSprite": placedTiles[x][y].id
            }

            roomJson.tiles[counter] = room;
            counter++;
        }
    }

    counter = 0;
    for(var x=0; x < placedExits.length; x+=70){
        if(!placedExits[x]){
            continue;
        }
        for(var y=0; y <placedExits[x].length; y+=70){
            if(!placedExits[x][y]){
                continue;
            }

            var exit = {"x":x,
                "y":y,
                "exitSprite": placedExits[x][y].id
            }

            roomJson.exits[counter] = exit;
            counter++;
        }
    }

    document.getElementById("room_json").value = JSON.stringify(roomJson);
}

function deserializeDungeon(){
    var roomJson = JSON.parse(document.getElementById("room_json").value);
    if(roomJson == null || roomJson.tiles == null){
        return;
    }

    for(var n=0; n < roomJson.tiles.length; n++){
        tileJson = roomJson.tiles[n];
        if(placedTiles[tileJson.x] == null){
            placedTiles[tileJson.x] = new Array();
        }
        placedTiles[tileJson.x][tileJson.y] = document.getElementById(tileJson.tileSprite);
    }

    for(var n=0; n < roomJson.exits.length; n++){
        exitJson = roomJson.exits[n];
        if(placedExits[exitJson.x] == null){
            placedExits[exitJson.x] = new Array();
        }
        placedExits[exitJson.x][exitJson.y] = document.getElementById(exitJson.exitSprite);
    }
}

domloaded();
