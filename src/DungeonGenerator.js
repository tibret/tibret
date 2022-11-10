import './App.css';
import axios from 'axios'
import React from 'react';
import { WithContext as ReactTags } from 'react-tag-input';

const KeyCodes = {
  comma: 188,
  enter: [10, 13],
};

const delimiters = [...KeyCodes.enter, KeyCodes.comma];

class DungeonGenerator extends React.Component {
    constructor(props) {
        super(props);
        this.state = {roomsJson : [],
            imageIsLoaded: false,
            imageLoading: false,
            image: "",
            tags: [],
            suggestions: [],
            numRooms: 10,
            dataIsLoaded : false};

        this.getAllRooms = this.getAllRooms.bind(this);
        this.generate = this.generate.bind(this);
        this.cancelEdit = this.cancelEdit.bind(this);
        this.handleChange = this.handleChange.bind(this);
        this.handleDelete = this.handleDelete.bind(this);
        this.handleAddition = this.handleAddition.bind(this);
        this.handleDrag = this.handleDrag.bind(this);
    }

    componentDidMount(){
        this.getAllRooms();
    }

    getAllRooms(){
        axios
            .get('http://localhost:4001/rooms/all')
            .then(response => {
                this.setState({roomsJson : response.data, dataIsLoaded: true});
                
                let sug = [];
                let sugText = [];
                for(let room of this.state.roomsJson){
                    if(room.tags == null || room.tags.length === 0){
                        continue;
                    }

                    for(let r of JSON.parse(room.tags)){
                        if(!sugText.includes(r.text)){
                            sug.push(r);
                            sugText.push(r.text);
                        }
                    }
                }

                this.setState({suggestions: sug});
            })
          .catch(error => console.error(`There was an error retrieving the room list: ${error}`));
    }

    generate(){
        const {roomsJson, tags} = this.state;
        //filter out any rooms that don't have the matching tags.
        let roomData = [];
        if(this.state.tags.length === 0){
            roomData = roomsJson;
        } else {
            for(let room of roomsJson){
                if(room.tags == null || room.tags.length === 0){
                    continue;
                }

                let match = false;
                for(let t of tags){
                    if(match){
                        break;
                    }
                    for(let r of JSON.parse(room.tags)){
                        if(t.text === r.text){
                            roomData.push(room);
                            match = true;
                            break;
                        }
                    }
                }
            }
        }

        let data = {rooms: roomData, numRooms: this.state.numRooms};
        this.setState({imageIsLoaded: false,
            image: "",
            imageLoading:true});
        axios
            .post('http://localhost:4001/generate/dungeon/', data)
            .then(response => {
                this.setState({image: response.data.img,
                    imageIsLoaded: true,
                    imageLoading: false});
            })
            .catch(error => console.error(`There was an error generating the dungeon: ${error}`));
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
        const {dataIsLoaded, imageLoading, imageIsLoaded, numRooms, image, tags, suggestions} = this.state;
        if(!dataIsLoaded){
            return <div> Waiting for data </div>
        }

        let imageContent;
        if(imageLoading){
            imageContent = (<div className="lds-ring"><div></div><div></div><div></div><div></div></div>);
        } else if(imageIsLoaded){
            imageContent = (<img src={image} alt="dungeon"/>);
        } else {
            imageContent = (<p className="whiteText">Hit the run button to generate a Dungeon!</p>);
        }

        return (
            <div className="Rooms rooms-wrapper">
                <h1>Generate a Dungeon</h1>
                <div id="buttonArea" className="Fright">
                    <button className="close-button cancel" onClick={this.cancelEdit}><i className="fa fa-times"/></button>
                </div>
                <div className="img-container">
                    <form>
                        <label className="whiteText">
                            Number of rooms in dungeon:
                            <input name="numRooms" type="text" value={numRooms} onChange={this.handleChange}/>
                        </label>
                        <br/>
                        <label className="whiteText">
                            Only include rooms tagged:
                            <ReactTags tags={tags}
                                label="Tags"
                                suggestions={suggestions}
                                handleDelete={this.handleDelete}
                                handleAddition={this.handleAddition}
                                handleDrag={this.handleDrag}
                                delimiters={delimiters} />
                        </label>
                    </form>

                    <button className="circle-button affirmative mar-10" onClick={this.generate}><i className="fa fa-running"/></button>

                    <div id="img-content">
                        {imageContent}
                    </div>
                </div>
            </div>
        );
    }
}

export default DungeonGenerator;
