import './App.css';
import React from 'react';

class Room extends React.Component {

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
                    <button onClick={this.deleteRoom} className="circle-button delete room-button"><i className="fa fa-trash"/></button>
                </div>
            </div>
        );
    }
}

export default Room;
