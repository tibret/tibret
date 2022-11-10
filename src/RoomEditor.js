import './App.css';
import axios from 'axios'
import React from 'react';
import {Helmet} from 'react-helmet'
import { WithContext as ReactTags } from 'react-tag-input';
import EditorCanvas from './EditorCanvas';

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
            uniqueRoom: false,
            roomJson: null}

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
                    console.log("DATA LOADED FROM DB: " + response.data[0].roomJson);
                    this.setState({room : response.data[0],
                        title: response.data[0].title,
                        description: response.data[0].description,
                        uniqueRoom: response.data[0].uniqueRoom,
                        roomJson : response.data[0].roomJson});
                    try{
                        this.setState({tags: response.data[0].tags == null ? [] : JSON.parse(response.data[0].tags)});
                    }catch(error){
                        this.setState({tags: []});
                    }
                })
                .catch(error => console.error(`There was an error retrieving the room list: ${error}`));
        } else {//creation mode
            this.setState({room: {}, roomJson: '{}', title: "", description: "", tags:[], uniqueRoom: false});
        }
        
    }

    cancelEdit(){
        this.props.cancelEditCallback();
    }

    handleChange(evt) {
        const target = evt.target;
        const value = target.type === 'checkbox' ? target.checked : target.value;
        const name = target.name;

        this.setState({
            [name]: value
        });
    }

    save(event) {
        event.preventDefault();

        const {room, title, description, tags, uniqueRoom} = this.state;

        let data = room;
        data.roomJson = event.target.getElementsByClassName("roomJson")[0].value;
        data.title=title;
        data.author_id=1;
        data.description=description;
        data.uniqueRoom = uniqueRoom;
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
        const {title, description, tags, roomJson, uniqueRoom} = this.state;

        let canvas = <div></div>
        if(roomJson){
            canvas = (<EditorCanvas roomJson={roomJson}/>);
        }

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
                <div className="room-description" >
                    <div className='label'>Title</div>
                    <input label="Title" name="title" type="text" value={title} onChange={this.handleChange}/>
                    
                    <div className='label'>Description</div>
                    <textarea label="Description" name="description" value={description} onChange={this.handleChange}/>
                    
                    <div className='label'>Tags</div>
                    <ReactTags tags={tags}
                        label="Tags"
                        handleDelete={this.handleDelete}
                        handleAddition={this.handleAddition}
                        handleDrag={this.handleDrag}
                        delimiters={delimiters} />
                    <br/>

                    <div className='label'>Unique?</div>
                    <input label="Unique Room" name="uniqueRoom" type="checkbox" checked={uniqueRoom} onChange={this.handleChange}/>
                </div>

                {canvas}
            </div>
            </form>
        );
    }
}

export default RoomEditor;
