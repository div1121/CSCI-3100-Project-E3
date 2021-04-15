import React, { Component } from 'react';
import ws from './service';
import alertify from 'alertifyjs';
import 'alertifyjs/build/css/alertify.css';
import './Alert.css'
import {PATH_TO_BACKEND} from './baseURL';
const baseURL = PATH_TO_BACKEND;

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
                        !this.props.loading &&
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
        this.state = {room_list:[], input_room_name:"", loading:false};
        this.handleChange = this.handleChange.bind(this);
        this.handleCreateRoom = this.handleCreateRoom.bind(this);
        this.handleEnterRoom = this.handleEnterRoom.bind(this);
    }

    componentDidMount(){
        fetch(baseURL+'/room')
            .then(res=>res.json())
            .then(res=>this.setState({room_list:res}));
        ws.on('createroom', data => {
            console.log(data);
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

        ws.on('getroominfo',(data)=>{
            console.log("OK");
            console.log(data);
            this.setState({loading: false});
            this.props.setGameroomenter(data.roomname);
            this.props.setGameroomid(data.roomid);
        });

        ws.on('failjoin',(data)=>{
            alertify.message("Fail to join the room: "+ data.roomname);
        })
    }

    handleChange(event) {
        const target = event.target;
        const value = target.type === 'checkbox' ? target.checked : target.value;
        const name = target.name;

        this.setState({
            [name]: value
        });
    }

    handleCreateRoom(event) {
        let obj = {roomname: this.state.input_room_name, userid: this.props.user_id, name: this.props.user_name};
        ws.emit('createroom',obj);
        this.setState({ input_room_name: '', loading:true});
        event.preventDefault();
    }

    handleEnterRoom(roomid,roomname){
        let obj = {roomid: roomid, roomname: roomname, userid: this.props.user_id, name: this.props.user_name};
        ws.emit('joinroom', obj);
        this.setState({loading: true});
    }


    render() {
        let room_list = this.state.room_list;
        //console.log(room_list);
        const displaylist = room_list.map((room) =>
            <Roomline roomname={room.roomname} numofusers={room.numofusers} handleadd={()=>this.handleEnterRoom(room._id,room.roomname)} loading={this.state.loading}></Roomline>
        );
        return (
            <div className="menu">
                <h1>Room List</h1>
                <table>
                    {displaylist}
                </table>
                {
                    <form onSubmit={this.handleCreateRoom}>
                        <fieldset>
                            <legend>Create Room:</legend>
                            <label>Room Name</label>
                            <input name="input_room_name"
                                   type="text"
                                   value={this.state.input_room_name}
                                   onChange={this.handleChange}
                                    />
                                   <br></br>
                            <input type="submit" value="Submit" />
                        </fieldset>
                    </form>
                }
            </div>
        );
    }
}
export default RoomList;