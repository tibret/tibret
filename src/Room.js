import './App.css';
import React from 'react';
import axios from 'axios'

class Room extends React.Component {
    constructor(props) {
        super(props);

        this.print = this.print.bind(this);
    }

    print(){
        axios
            .get('http://localhost:4001/generate/room/'+this.props.id)
            .then(response => {
                console.log(response.data);
                return response.data.img;
            }).then(img => {
                const a = document.createElement("a");
                a.download = 'room.png';
                a.href = img;
                a.click();
            })
          .catch(error => console.error(`There was an error printing room: ${error}`));
    }

    editRoom = () => {
        this.props.editRoomCallback(this.props.id);
    }

    deleteRoom = () => {
        this.props.deleteRoomCallback(this.props.id);
    }

    render() {
        let tags = (<div></div>);
        if(this.props.tags != null){
            tags = JSON.parse(this.props.tags).map((tag, idx) => <span className="tag" key={tag.id}>{tag.text}</span>);
        }

        return (
            <div className="room-container">
                <h2>{this.props.title}</h2>
                <div className="room-details">{this.props.description}</div>
                <div className="tag-container">
                    {tags}
                </div>
                <div className="room-about">Created on {this.props.created}</div>
                <div className="button-container">
                    <button onClick={this.editRoom} className="circle-button affirmative room-button"><i className="fa fa-edit"/></button>
                    <button onClick={this.print} className="circle-button affirmative room-button"><i className="fa fa-print"/></button>
                    <button onClick={this.deleteRoom} className="circle-button delete room-button"><i className="fa fa-trash"/></button>
                </div>
            </div>
        );
    }
}

export default Room;
