import React, { Component } from 'react';
import ws from './service';

class Roomline extends Component{
    render(){
        // invite button display (to be implemented)
        return (<tr>
                    <td>
                        {this.props.roomname}
                    </td>
                    <td>
                        {this.props.numofusers}/4
                    </td>
                    {
                        <td>
                            <button onClick={this.props.handleadd}>Add</button>
                        </td>
                    }
            </tr>
        )
    }
}

class RoomList extends React.Component {
    constructor(props) {
        super(props);
        this.state = {room_list:[]};
    }

    componentDidMount(){
        fetch('/room')
            .then(res=>res.json())
            .then(res=>this.setState({room_list:res}));
        ws.on('createroom', data => {
            //console.log(data);
            let display = this.state.room_list;
            display.push(data);
            //console.log(display);
            this.setState({room_list:display});
        });
        ws.on('addroomlist', data => {
            let display = this.state.room_list;
            const isMatch = (element) => element._id === data._id;
            var match = display.findIndex(isMatch);
            if (match!==-1)
                display[match].numofusers += 1;
            this.setState({room_list:display});
        });
        ws.on('downroomlist', data => {
            let display = this.state.room_list;
            const isMatch = (element) => element._id === data._id;
            var match = display.findIndex(isMatch);
            if (match!==-1)
                display[match].numofusers -= 1;
            this.setState({room_list:display});
        });
        ws.on('deleteroom', data => {
            let display = this.state.room_list;
            const isMatch = (element) => element._id === data._id;
            var match = display.findIndex(isMatch);
            if (match!==-1)
                display.splice(display.findIndex(isMatch),1);
            this.setState({room_list:display});
        });
    }

    render() {
        let room_list = this.state.room_list;
        //console.log(room_list);
        const displaylist = room_list.map((room) =>
            <Roomline roomname={room.roomname} numofusers={room.numofusers} handleadd={()=>this.props.handleEnterRoom(room._id,room.roomname)} loading={this.props.loading}></Roomline>
        );
        return (
            <div>
                <h1>Room List</h1>
                <table>
                    {displaylist}
                </table>
                {
                    <form onSubmit={this.props.handleCreateRoom}>
                        <fieldset>
                            <legend>Create Room:</legend>
                            <label>Room Name</label>
                            <input value={this.props.room_name} name="input_room_name"
                                   onChange={this.props.handleInputChange}/><br></br>
                            <input type="submit" value="Submit"/>
                        </fieldset>
                    </form>
                }
            </div>
        );
    }
}
export default RoomList;