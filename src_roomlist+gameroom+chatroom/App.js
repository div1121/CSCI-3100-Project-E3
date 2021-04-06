import React, { Component } from 'react';
import Gameroom from "./Gameroom";
import SendChat from "./chatroom";
import Roomlist from "./Roomlist";
import ws from "./service";

class App extends Component {
	constructor(props) {
		super(props);
		this.state = {playername:"Alice",gameroomenter:null,datasave:false,value:''};
		this.handleadd = this.handleadd.bind(this);
		this.handleleave = this.handleleave.bind(this);
		this.handleChange = this.handleChange.bind(this);
		this.handleSubmit = this.handleSubmit.bind(this);
	}

	handleChange(event) {
		this.setState({value: event.target.value});
	}

	handleSubmit(event) {
		let obj = {roomname: this.state.value}
		ws.emit('createroom',obj);
		this.handleadd(this.state.value);
		this.setState({value: ''});
		event.preventDefault();
	}

	handleadd(name){
		let obj = {roomname: name, name: this.state.playername};
		ws.emit('joinroom', obj);
		this.setState({gameroomenter:name})
	}

	handleleave(){
		ws.emit('leaveroom',{roomname:this.state.gameroomenter,name:this.state.playername});
		this.setState({gameroomenter:null, datasave:false});
	}

	componentDidMount() {
		ws.on('roommemberOK',()=>{
			this.setState({datasave:true})
		});
	}

	render() {
		return (
			<div className="App">
			<h1>Room list</h1>
			<button onClick={()=>this.setState({playername:"Peter"})}>Boy</button>
			<Roomlist handleadd={this.handleadd} />
			<form onSubmit={this.handleSubmit}>
				<label>The Room name created:
						<textarea value={this.state.value} onChange={this.handleChange} />
				</label>
				<input type="submit" value="Submit" />
			</form>
				{ this.state.gameroomenter!=null && this.state.datasave &&
					<div>
					<h1>Game Room</h1>
					<Gameroom roomname={this.state.gameroomenter} player={this.state.playername} handleleave={this.handleleave}/>
					<h1>Chat Room</h1>
					<SendChat roomname={this.state.gameroomenter} name={this.state.playername} />
					</div>
				}
			</div>
		);
	}
}

export default App;