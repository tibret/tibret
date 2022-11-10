import './App.css';
import axios from 'axios'
import React from 'react';
import Room from './Room';

class Rooms extends React.Component {
    constructor(props) {
        super(props);
        this.state = {roomsJson : [], dataIsLoaded : false};

        this.getAllRooms = this.getAllRooms.bind(this);
        this.deleteRoomCallback = this.deleteRoomCallback.bind(this);
    }

    componentDidMount(){
        this.getAllRooms();
    }

    getAllRooms(){
        axios
            .get('http://localhost:4001/rooms/all')
            .then(response => {
                this.setState({roomsJson : response.data, dataIsLoaded: true});
            })
          .catch(error => console.error(`There was an error retrieving the room list: ${error}`));
    }

    deleteRoomCallback(roomId){
        this.setState({dataIsLoaded: false});

        axios
            .put('http://localhost:4001/rooms/delete', {"id": roomId})
            .then(response => {
                //refresh state
                this.getAllRooms();
            })
          .catch(error => console.error(`There was an error retrieving the room list: ${error}`));
    }

    render() {
        const {roomsJson , dataIsLoaded} = this.state;
        if(!dataIsLoaded){
            return <div> Waiting for data </div>
        }
        return (
            <div className="Rooms rooms-wrapper">
                <h1>All Rooms
                    <button className="circle-button affirmative mar-left-10" onClick={this.props.newRoomCallback}><i className="fa fa-plus"/></button>
                    <button className="circle-button affirmative mar-left-10" onClick={this.props.generateDungeonCallback}><i className="fa fa-map-marker"/></button>
                </h1>
                {roomsJson.map((rm, idx) => <Room {...rm} key={rm.id} editRoomCallback={this.props.editRoomCallback} deleteRoomCallback={this.deleteRoomCallback}/>)}
                <div id="img-container">
                </div>
            </div>
        );
    }
}

export default Rooms;
