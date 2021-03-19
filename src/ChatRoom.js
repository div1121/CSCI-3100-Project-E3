import React from 'react';


let prevtext="";
class ChatRoom extends React.Component {
    constructor(props) {
		super(props);
		this.state = {value: ''};
  
		this.loadFile = this.loadFile.bind(this);
	        this.handleChange = this.handleChange.bind(this);
		this.handleSubmit = this.handleSubmit.bind(this);
    }
  
    loadFile(){
	let history = document.getElementById('record');
        fetch('chats.txt')
        .then(res=>res.text())
        .then(text => history.innerHTML = text);
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
				<div id="record" onLoad={this.loadFile} border="3px"></div>
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
