import './App.css';
import axios from 'axios'
import React from 'react';

class RoomEditor extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            paletteData: [],
            roomJson: this.props.roomJson
        }

        console.log("Passed in room JSON");

        // this.state = {
        //     paletteData: [],
        //     roomJson: this.props.roomJson,
        //     canvasHeight: null,
        //     canvasWidth: null,
        //     currentImg: null,
        //     currentLayer: null,
        //     canvas: null,
        //     ctx: null,
        //     placedTiles: null,
        //     placedExits: null,
        //     drawing_mode: null,
        //     clearButtons: null,
        //     TILE_SIZE = 70
        // }

        this.paletteData= [];
        this.roomJson= this.props.roomJson;
        this.canvasHeight= null;
        this.canvasWidth= null;
        this.currentImg= null;
        this.currentLayer= null;
        this.placedTiles= null;
        this.placedExits= null;
        this.drawingMode= null;
        this.clearButtons= null;
        this.TILE_SIZE = 70;
        this.canvasRef = React.createRef();

        this.loadPalette = this.loadPalette.bind(this);
        this.initCanvas = this.initCanvas.bind(this);
        this.setCurrentImg = this.setCurrentImg.bind(this);
        this.unSetCurrentImg = this.unSetCurrentImg.bind(this);
        this.redraw = this.redraw.bind(this);
        this.highlightCurrentSquare = this.highlightCurrentSquare.bind(this);
        this.setDrawingMode = this.setDrawingMode.bind(this);
        this.unSetDrawingMode = this.unSetDrawingMode.bind(this);
        this.gridInteraction = this.gridInteraction.bind(this);
        this.drawTiles = this.drawTiles.bind(this);
        this.drawExits = this.drawExits.bind(this);
        this.initGrid = this.initGrid.bind(this);
        this.initButtons = this.initButtons.bind(this);
        this.serializeDungeon = this.serializeDungeon.bind(this);
        this.deserializeDungeon = this.deserializeDungeon.bind(this);
    }

    componentDidMount() {
        console.log("COMPONENT MOUNTED ");
        this.loadPalette();
    }

    render() {
        const { roomJson, paletteData } = this.state;

        return (
            <div className="editor-container">
                <input id='room_json'
                    className="roomJson"
                    type="hidden"
                    value={roomJson} />

                <div className="editor-image-pane">
                    <img id="clearTile" src="images/default/clear.png" data-layer="TILE" className="clearButton activeTile" alt="clearButton" onClick={this.unSetCurrentImg} />
                    {paletteData.map((img, idx) => <img id={img.id} key={img.fileName} src={img.image} data-layer="TILE" className="tileButton" alt={img.fileName} onClick={this.setCurrentImg} />)}
                </div>
                <div className="editor-image-pane">
                    <img id="clearExit" src="images/default/clear.png" data-layer="EXIT" className="clearButton" alt="clearExist" onClick={this.unSetCurrentImg} />
                    <img id="exit_n" src="images/exits/exit_n.png" data-layer="EXIT" className="exitButton" alt="exit_n" onClick={this.setCurrentImg} />
                    <img id="exit_e" src="images/exits/exit_e.png" data-layer="EXIT" className="exitButton" alt="exit_e" onClick={this.setCurrentImg} />
                    <img id="exit_s" src="images/exits/exit_s.png" data-layer="EXIT" className="exitButton" alt="exit_s" onClick={this.setCurrentImg} />
                    <img id="exit_w" src="images/exits/exit_w.png" data-layer="EXIT" className="exitButton" alt="exit_w" onClick={this.setCurrentImg} />
                </div>
                <div className="editor-canvas-container">
                    <canvas id="tileEditor" width="1400px" height="1400px" ref={this.canvasRef}>
                    </canvas>
                </div>
            </div>
        );
    }

    loadPalette() {
        axios
            .get('http://localhost:4001/palette/get/default')
            .then(response => {
                this.setState({ paletteData: response.data });
                this.initCanvas();
            })
            .catch(error => console.error(`There was an error retrieving the palette: ${error}`));
    }

    initCanvas(){
        const canvas = this.canvasRef.current;
        const ctx = canvas.getContext('2d');

        this.canvasHeight = ctx.canvas.clientHeight;
        this.canvasWidth = ctx.canvas.clientWidth;
        this.currentLayer = "TILE";
        this.placedTiles = [];
        this.placedExits = [];
        this.initGrid(ctx);
        this.drawingMode = false;

        this.initButtons(ctx);
        canvas.addEventListener('mousemove', e => { this.highlightCurrentSquare(e) });
        canvas.addEventListener('mouseup', e => { this.unSetDrawingMode(e) });
        canvas.addEventListener('mousedown', e => { this.setDrawingMode(e) });
        this.deserializeDungeon();
        this.drawTiles(ctx);
        this.drawExits(ctx);
    }

    redraw(ctx) {
        ctx.clearRect(0, 0, this.canvasWidth, this.canvasHeight)
        this.initGrid(ctx);
        this.drawTiles(ctx);
        this.drawExits(ctx);
        this.serializeDungeon();
    }

    highlightCurrentSquare(e) {
        const canvas = this.canvasRef.current;
        const ctx = canvas.getContext('2d');

        // important: correct mouse position:
        var rect = canvas.getBoundingClientRect(),
            x = Math.floor((e.clientX - rect.left) - (e.clientX - rect.left) % this.TILE_SIZE),
            y = Math.floor((e.clientY - rect.top) - (e.clientY - rect.top) % this.TILE_SIZE);


        this.redraw(ctx);

        if (this.drawingMode) {
            this.gridInteraction(e);
        }

        ctx.globalAlpha = 0.2;
        if (this.currentImg == null && this.currentLayer === "TILE") {
            ctx.fillStyle = "#0000FF";
            ctx.fillRect(x, y, this.TILE_SIZE, this.TILE_SIZE);
        } else if (this.currentImg == null && this.currentLayer === "EXIT") {
            ctx.fillStyle = "#FF0000";
            ctx.fillRect(x, y, this.TILE_SIZE, this.TILE_SIZE);
        } else if (this.currentImg != null) {
            ctx.drawImage(this.currentImg, x, y, this.TILE_SIZE, this.TILE_SIZE);
        }
        ctx.globalAlpha = 1;
    }

    setDrawingMode(e) {
        const canvas = this.canvasRef.current;
        const ctx = canvas.getContext('2d');

        this.drawingMode = true;
        this.gridInteraction(e);
        this.redraw(ctx);
    }

    unSetDrawingMode(e) {
        this.drawingMode = false;
    }

    gridInteraction(e) {
        const canvas = this.canvasRef.current;
        let placedTiles = this.placedTiles;
        let placedExits = this.placedExits;
        let currentLayer = this.currentLayer;
        let currentImg = this.currentImg;
        
        // important: correct mouse position:
        var rect = canvas.getBoundingClientRect(),
            // x = (e.clientX - rect.left),
            // y = (e.clientY - rect.top),
            tileX = Math.floor((e.clientX - rect.left) - (e.clientX - rect.left) % this.TILE_SIZE),
            tileY = Math.floor((e.clientY - rect.top) - (e.clientY - rect.top) % this.TILE_SIZE);;

        //if we're not in a button, then place a new tile
        if (currentImg != null && currentLayer === "TILE") {
            if (placedTiles[tileX] == null) {
                placedTiles[tileX] = [];
            }
            placedTiles[tileX][tileY] = currentImg;
        } else if (currentImg != null && currentLayer === "EXIT") {
            if (placedExits[tileX] == null) {
                placedExits[tileX] = [];
            }
            placedExits[tileX][tileY] = currentImg;
        } else if (currentLayer === "TILE") {
            if (placedTiles[tileX] != null) {
                placedTiles[tileX][tileY] = null;
            }
        } else if (currentLayer === "EXIT") {
            if (placedExits[tileX] != null) {
                placedExits[tileX][tileY] = null;
            }
        }
    }

    drawTiles(ctx) {
        let placedTiles = this.placedTiles;
        let canvasHeight = this.canvasHeight;
        let canvasWidth = this.canvasWidth;

        if (placedTiles.length < 1) {
            return;
        }
        for (var x = 0; x <= canvasWidth; x += this.TILE_SIZE) {
            for (var y = 0; y <= canvasHeight; y += this.TILE_SIZE) {
                if (placedTiles[x] != null && placedTiles[x][y] != null) {
                    ctx.drawImage(placedTiles[x][y], x, y, this.TILE_SIZE, this.TILE_SIZE);
                }
            }
        }
    }

    drawExits() {
        const canvas = this.canvasRef.current;
        const ctx = canvas.getContext('2d');
        let placedExits = this.placedExits;
        let canvasHeight = this.canvasHeight;
        let canvasWidth = this.canvasWidth;

        if (placedExits.length < 1) {
            return;
        }
        for (var x = 0; x <= canvasWidth; x += this.TILE_SIZE) {
            for (var y = 0; y <= canvasHeight; y += this.TILE_SIZE) {
                if (placedExits[x] != null && placedExits[x][y] != null) {
                    ctx.drawImage(placedExits[x][y], x, y, this.TILE_SIZE, this.TILE_SIZE);
                }
            }
        }
    }

    setCurrentImg(e) {
        console.log("START current image");
        console.log(this.currentImg);
        this.currentLayer = e.target.dataset.layer;
        if (this.currentImg != null) {
            //remove the active style
            this.currentImg.classList.remove("activeTile");
        }
        for (let clearButton of this.clearButtons) {
            clearButton.classList.remove("activeTile");
        }
        this.currentImg = e.target;

        //add the active style
        this.currentImg.classList.add("activeTile");

        console.log("END current image");
        console.log(this.currentImg);
    }

    unSetCurrentImg(e) {
        this.currentLayer = e.target.dataset.layer;
        if (this.currentImg != null) {
            //remove the active style
            this.currentImg.classList.remove("activeTile");
        }
        for (let clearButton of this.clearButtons) {
            clearButton.classList.remove("activeTile");
        }
        this.currentImg = null;

        //add the active style
        e.target.classList.add("activeTile");
    }

    initGrid(ctx) {
        ctx.fillStyle = "#0000FF";

        for (var i = 0; i <= this.canvasWidth; i += this.TILE_SIZE) {
            ctx.fillRect(i - 1, 0, 2, this.canvasHeight);
        }
        for (var j = 0; j <= this.canvasHeight; j += this.TILE_SIZE) {
            ctx.fillRect(0, j - 1, this.canvasWidth, 2);
        }
    }

    initButtons(ctx) {
        //initialize our set of tiles
        var imgs = document.getElementsByClassName("tileButton");
        for (var i = 0; i < imgs.length; i++) {
            imgs[i].addEventListener('click', e => this.setCurrentImg(e));
        }

        imgs = document.getElementsByClassName("exitButton");
        for (var j = 0; j < imgs.length; j++) {
            imgs[j].addEventListener('click', e => this.setCurrentImg(e));
        }

        this.clearButtons = document.getElementsByClassName("clearButton");
        for (var k = 0; k < this.clearButtons.length; k++) {
            this.clearButtons[k].addEventListener('click', e => this.unSetCurrentImg(e));
        }
    }

    serializeDungeon() {
        let placedTiles = this.placedTiles;
        let placedExits = this.placedExits;

        var roomJson = { "palette": "default", "tiles": [], "exits": [] };
        var counter = 0;

        for (let x = 0; x < placedTiles.length; x += 70) {
            if (!placedTiles[x]) {
                continue;
            }
            for (let y = 0; y < placedTiles[x].length; y += 70) {
                if (!placedTiles[x][y]) {
                    continue;
                }

                var room = {
                    "x": x,
                    "y": y,
                    "tileSprite": placedTiles[x][y].id
                }

                roomJson.tiles[counter] = room;
                counter++;
            }
        }

        counter = 0;
        for (let x = 0; x < placedExits.length; x += 70) {
            if (!placedExits[x]) {
                continue;
            }
            for (let y = 0; y < placedExits[x].length; y += 70) {
                if (!placedExits[x][y]) {
                    continue;
                }

                var exit = {
                    "x": x,
                    "y": y,
                    "exitSprite": placedExits[x][y].id
                }

                roomJson.exits[counter] = exit;
                counter++;
            }
        }

        document.getElementById("room_json").value = JSON.stringify(roomJson);
    }

    deserializeDungeon() {
        let placedTiles = this.placedTiles;
        let placedExits = this.placedExits;

        var roomJson = JSON.parse(document.getElementById("room_json").value);
        if (roomJson == null || roomJson.tiles == null) {
            return;
        }

        for (let n = 0; n < roomJson.tiles.length; n++) {
            let tileJson = roomJson.tiles[n];
            if (placedTiles[tileJson.x] == null) {
                placedTiles[tileJson.x] = [];
            }
            placedTiles[tileJson.x][tileJson.y] = document.getElementById(tileJson.tileSprite);
        }

        for (let n = 0; n < roomJson.exits.length; n++) {
            let exitJson = roomJson.exits[n];
            if (placedExits[exitJson.x] == null) {
                placedExits[exitJson.x] = [];
            }
            placedExits[exitJson.x][exitJson.y] = document.getElementById(exitJson.exitSprite);
        }
    }

}

export default RoomEditor;

