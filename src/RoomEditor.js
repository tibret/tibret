import './App.css';
import axios from 'axios'
import React from 'react';
import {Helmet} from 'react-helmet'
import { WithContext as ReactTags } from 'react-tag-input';

const KeyCodes = {
  comma: 188,
  enter: [10, 13],
};

const delimiters = [...KeyCodes.enter, KeyCodes.comma];

class RoomEditor extends React.Component {
    constructor(props) {
        super(props);
        this.state = {room : '',
            title: '',
            description: '',
            tags: [],
            roomJson: ''}

        this.handleDelete = this.handleDelete.bind(this);
        this.handleAddition = this.handleAddition.bind(this);
        this.handleDrag = this.handleDrag.bind(this);
        this.cancelEdit = this.cancelEdit.bind(this);
        this.handleChange = this.handleChange.bind(this);
        this.save = this.save.bind(this);
    }

    componentDidMount(){
        if(this.props.roomId != null){
            axios
                .get('http://localhost:4001/rooms/get/'+this.props.roomId)
                .then(response => {
                    console.log(response);
                    this.setState({room : response.data[0],
                        title: response.data[0].title,
                        description: response.data[0].description,
                        roomJson : response.data[0].roomJson});
                    try{
                        this.setState({tags: response.data[0].tags == null ? [] : JSON.parse(response.data[0].tags)});
                    }catch(error){
                        this.setState({tags: []});
                    }
                })
                .catch(error => console.error(`There was an error retrieving the room list: ${error}`));
        } else {//creation mode
            this.setState({room: {}, roomJson: '{}', title: "", description: "", tags:[]});
        }
    }

    cancelEdit(){
        this.props.cancelEditCallback();
    }

    handleChange(evt) {
        const target = evt.target;
        const value = target.value;
        const name = target.name;

        this.setState({
            [name]: value
        });
    }

    save(event) {
        event.preventDefault();

        const {room, title, description, tags} = this.state;

        let data = room;
        data.roomJson = event.target.getElementsByClassName("roomJson")[0].value;
        data.title=title;
        data.author_id=1;
        data.description=description;
        data.tags=JSON.stringify(tags);

        if(this.props.roomId != null){//update existing room
            axios
                .post('http://localhost:4001/rooms/update/', data)
                .then(response => {
                    console.log(response);
                })
                .catch(error => console.error(`There was an error retrieving the room list: ${error}`));
        } else {//create new room
            axios
                .post('http://localhost:4001/rooms/create/', data)
                .then(response => {
                    console.log(response);
                })
                .catch(error => console.error(`There was an error retrieving the room list: ${error}`));
        }

        this.props.cancelEditCallback();
    }

    handleDelete(i) {
        const { tags } = this.state;
        this.setState({
         tags: tags.filter((tag, index) => index !== i),
        });
    }

    handleAddition(tag) {
        this.setState(state => ({ tags: [...state.tags, tag] }));
    }

    handleDrag(tag, currPos, newPos) {
        const tags = [...this.state.tags];
        const newTags = tags.slice();

        newTags.splice(currPos, 1);
        newTags.splice(newPos, 0, tag);

        // re-render
        this.setState({ tags: newTags });
    }

    render() {
        const {title, description, tags, roomJson} = this.state;
        return (
            <form onSubmit={this.save}>
            <div className="room-editor">
                <Helmet>
                    <script src="scripts/tileEditor.js" type="text/javascript"/>
                </Helmet>
                <div id="buttonArea" className="Fright">
                    <button className="circle-button affirmative button-shadow" type="submit"><i className="fa fa-save"/></button>
                    <button className="close-button button-shadow cancel" onClick={this.cancelEdit}><i className="fa fa-times"/></button>
                </div>
                <div className="room-description">
                    <input name="title" type="text" value={title} onChange={this.handleChange}/>
                    <br/>
                    <textarea name="description" value={description} onChange={this.handleChange}/>
                    <ReactTags tags={tags}
                        label="Tags"
                        handleDelete={this.handleDelete}
                        handleAddition={this.handleAddition}
                        handleDrag={this.handleDrag}
                        delimiters={delimiters} />
                </div>

                <input id='room_json'
                    className="roomJson"
                    type="hidden"
                    value={roomJson} />

                <div className="editor-container">
                    <div className="editor-image-pane">
                        <img id="clearTile" src="images/tiles/clear.png" data-layer="TILE" className="clearButton activeTile" alt="clearButton"/>
                        <img id="floor" src="images/tiles/floor.png" data-layer="TILE" className="tileButton" alt="floor"/>
                        <img id="floor_2" src="images/tiles/floor_2.png" data-layer="TILE" className="tileButton" alt="floor_2"/>
                        <img id="floor_3" src="images/tiles/floor_3.png" data-layer="TILE" className="tileButton" alt="floor_3"/>
                        <img id="floor_4" src="images/tiles/floor_4.png" data-layer="TILE" className="tileButton" alt="floor_4"/>
                        <img id="wall_w" src="images/tiles/wall_w.png" data-layer="TILE" className="tileButton" alt="wall_w"/>
                        <img id="wall_s" src="images/tiles/wall_s.png" data-layer="TILE" className="tileButton" alt="wall_s"/>
                        <img id="wall_e" src="images/tiles/wall_e.png" data-layer="TILE" className="tileButton" alt="wall_e"/>
                        <img id="wall_n" src="images/tiles/wall_n.png" data-layer="TILE" className="tileButton" alt="wall_n"/>
                        <img id="wall_nw" src="images/tiles/wall_nw.png" data-layer="TILE" className="tileButton" alt="wall_nw"/>
                        <img id="wall_ne" src="images/tiles/wall_ne.png" data-layer="TILE" className="tileButton" alt="wall_ne"/>
                        <img id="wall_sw" src="images/tiles/wall_sw.png" data-layer="TILE" className="tileButton" alt="wall_sw"/>
                        <img id="wall_se" src="images/tiles/wall_se.png" data-layer="TILE" className="tileButton" alt="wall_se"/>
                        <img id="wall_c_n_e" src="images/tiles/wall_c_n_e.png" data-layer="TILE" className="tileButton" alt="wall_c_n_e"/>
                        <img id="wall_c_n_w" src="images/tiles/wall_c_n_w.png" data-layer="TILE" className="tileButton" alt="wall_c_n_w"/>
                        <img id="wall_c_s_e" src="images/tiles/wall_c_s_e.png" data-layer="TILE" className="tileButton" alt="wall_c_s_e"/>
                        <img id="wall_c_s_w" src="images/tiles/wall_c_s_w.png" data-layer="TILE" className="tileButton" alt="wall_c_s_w"/>
                        <img id="wall_e_w" src="images/tiles/wall_e_w.png" data-layer="TILE" className="tileButton" alt="wall_e_w"/>
                        <img id="wall_n_s" src="images/tiles/wall_n_s.png" data-layer="TILE" className="tileButton" alt="wall_n_s"/>
                    </div>
                    <div className="editor-image-pane">
                        <img id="clearExit" src="images/tiles/clear.png" data-layer="EXIT" className="clearButton" alt="clearExist"/>
                        <img id="exit_n" src="images/exits/exit_n.png" data-layer="EXIT" className="exitButton" alt="exit_n"/>
                        <img id="exit_e" src="images/exits/exit_e.png" data-layer="EXIT" className="exitButton" alt="exit_e"/>
                        <img id="exit_s" src="images/exits/exit_s.png" data-layer="EXIT" className="exitButton" alt="exit_s"/>
                        <img id="exit_w" src="images/exits/exit_w.png" data-layer="EXIT" className="exitButton" alt="exit_w"/>
                    </div>
                    <div className="editor-canvas-container">
                        <canvas id="tileEditor" width="1400px" height="1400px">
                        </canvas>
                    </div>
                </div>
            </div>
            </form>
        );
    }
}

export default RoomEditor;
