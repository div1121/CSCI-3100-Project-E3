import React, { Component } from 'react';
import GameRoom from "./Gameroom";
import SendChat from "./chatroom";
import RoomList from "./Roomlist";
import ws from "./service";

class App extends Component {
	constructor(props) {
		super(props);
		this.state = {user_name:"Alice", user_id:"123456", game_room_enter:null, game_room_id:null, loading:false, input_room_name:""};
		this.handleEnterRoom = this.handleEnterRoom.bind(this);
		this.handleLeaveRoom = this.handleLeaveRoom.bind(this);
		this.handleInputChange = this.handleInputChange.bind(this);
		this.handleCreateRoom = this.handleCreateRoom.bind(this);
	}

	handleInputChange(event) {
		const target = event.target;
		const value = target.type === 'checkbox' ? target.checked : target.value;
		const name = target.name;

		this.setState({
			[name]: value
		});
	}

	handleCreateRoom(event) {
		let obj = {roomname: this.state.input_room_name, userid: this.state.user_id, name: this.state.user_name};
		ws.emit('createroom',obj);
		this.setState({ input_room_name: '', loading: true});
		event.preventDefault();
	}

	handleEnterRoom(roomid,roomname){
		let obj = {roomid: roomid, roomname: roomname, userid: this.state.user_id, name: this.state.user_name};
		ws.emit('joinroom', obj);
		this.setState({loading: true});
	}

	handleLeaveRoom(){
		ws.emit('leaveroom',{roomid:this.state.game_room_id, roomname:this.state.game_room_enter, userid:this.state.user_id, name:this.state.user_name});
		this.setState({game_room_enter:null, game_room_id:null});
	}

	componentDidMount() {
		ws.on('getroominfo',(data)=>{
			this.setState({game_room_enter:data.roomname,game_room_id:data.roomid, loading: false});
			//ws.off('createroom');
			//ws.off('addroomlist');
			//ws.off('downroomlist');
			//ws.off('deleteroom');
		});
		ws.on('failjoin',(data)=>{
			alert("Fail to join the room: " + data.roomname);
		})
	}

	render() {
		return (
			<div className="App">
			<button onClick={()=>this.setState({user_name:"Peter",user_id:"654321"})}>Boy</button>
				{
					this.state.game_room_enter==null && this.state.game_room_id==null &&
					<RoomList room_name={this.state.input_room_name} handleCreateRoom={this.handleCreateRoom}
							  handleEnterRoom={this.handleEnterRoom} handleInputChange={this.handleInputChange} loading={this.state.loading}/>
				}
				{
					this.state.game_room_enter!=null && this.state.game_room_id!=null  &&
					<div>
					<h1>Game Room</h1>
					<GameRoom roomid={this.state.game_room_id} roomname={this.state.game_room_enter} playername={this.state.user_name} playerid={this.state.user_id} handleleave={this.handleLeaveRoom}/>
					<h1>Chat Room</h1>
					<SendChat roomid={this.state.game_room_id} userid={this.state.user_id} name={this.state.user_name} />
					</div>
				}
			</div>
		);
	}
}

export default App;