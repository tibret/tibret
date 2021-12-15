import './App.css';
import Rooms from './Rooms';
import RoomEditor from './RoomEditor';
import DungeonGenerator from './DungeonGenerator';
import React from 'react';
import {Helmet} from "react-helmet";

class App extends React.Component {
    constructor(props) {
        super(props);
        this.state = {editMode: false,
            generateMode: false,
            editRoomId: null}
    }

    componentDidMount(){
        const fontawesome = document.createElement("style", {src: 'https://kit.fontawesome.com/b378e3576d.js', crossorigin: 'anonymous'});
        document.head.appendChild(fontawesome);
    }

    editRoomCallback = (roomId) => {
        this.setState({editMode: true, editRoomId: roomId, generateMode: false});
    }

    cancelEditCallback = (roomId) => {
        this.setState({editMode: false, editRoomId: null, generateMode: false});
    }

    newRoomCallback = () => {
        this.setState({editMode: true, editRoomId: null, generateMode: false});
    }

    generateDungeonCallback = () => {
        this.setState({editMode: false, editRoomId: null, generateMode: true});
    }

    render(){
        let pageContent;
        if(this.state.editMode){
            pageContent = <RoomEditor cancelEditCallback={this.cancelEditCallback} roomId={this.state.editRoomId}/>;
        } else if(this.state.generateMode){
            pageContent = <DungeonGenerator cancelEditCallback={this.cancelEditCallback}/>
        } else {
            pageContent = <Rooms editRoomCallback={this.editRoomCallback}
                generateDungeonCallback={this.generateDungeonCallback}
                newRoomCallback={this.newRoomCallback}/>;
        }

        return (
            <div className="App">
                <Helmet>
                    <title>DTool</title>
                    <script src="https://kit.fontawesome.com/b378e3576d.js" crossorigin="anonymous"></script>
                </Helmet>
                {pageContent}
            </div>
        );
    }
}

export default App;
