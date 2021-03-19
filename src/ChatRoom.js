import React from 'react';

fetch('chats.txt')	
.then(res=>res.text())
.then(txt => document.querySelector("#chat").innerHTML=txt);

let prevtext="";
class ChatRoom extends React.Component {
    constructor(props) {
		super(props);
		this.state = {value: ''};
  
		this.handleChange = this.handleChange.bind(this);
		this.handleSubmit = this.handleSubmit.bind(this);
    }
  
    handleChange(event) {
		this.setState({value: event.target.value});
    }
  
    handleSubmit(event) {
		fetch('chats.txt')
		.then(res=>res.text())
		.then(txt => prevtext=txt); 
		let updatedtext=prevtext+"\n<div><h5>Username: </h5><p>"+this.state.value+"</p></div>";
		fetch('chats.txt', {
			method: 'PUT', body: updatedtext 
		});
		this.setState({value: ''});
		fetch('chats.txt')
		.then(res=>res.text())
		.then(txt => document.querySelector("#chat").innerHTML=txt);
		event.preventDefault();
    }

    render() {
		return (
			<div className='chat_room'>
				<h1>Chat room</h1>
				<div id="chat"></div>
				<form onSubmit={this.handleSubmit}>
					<label>
						<textarea value={this.state.value} placeholder="Send a message" onChange={this.handleChange} />
					</label>
					<input type="submit" value="Submit" />
				</form>
			</div>
		);
	}
}

export default ChatRoom;