// Chat room provides the chat function in the game room

import React from 'react';
import ws from './service';
import './ChatRoom.css';
import man1 from './picture/man/man_1_head.gif';
import man2 from './picture/man/man_2_head.gif';
import man3 from './picture/man/man_3_head.gif';
import man4 from './picture/man/man_4_head.gif';
import {PATH_TO_BACKEND} from './baseURL';
const baseURL = PATH_TO_BACKEND;

// Image load from resource for display
const image_array = [man1,man2,man3,man4];

class Chatroom extends React.Component {
    // constructor
    constructor(props) {
      super(props);
      this.state = {roomid:this.props.roomid, playerid:this.props.userid, name:this.props.name, value: '', history: []};
      this.handleChange = this.handleChange.bind(this);
      this.handleSubmit = this.handleSubmit.bind(this);
    }

    // handle the change in the input text bos (for sending chat)
    handleChange(event) {
        const target = event.target;
        const value = target.type === 'checkbox' ? target.checked : target.value;
        const name = target.name;

        this.setState({
            [name]: value
        });
    }

    // handle the submit message and pass to the backend for processing
    handleSubmit(event) {
		if(this.state.value!=''){
			let obj = {roomid:this.state.roomid, userid:this.state.playerid, name: this.state.name, imageindex:this.props.imageindex, message: this.state.value}
			ws.emit('messages',obj);
			this.setState({value: ''});
		}
        event.preventDefault();
    }

    componentDidMount(){
		//console.log("hihiihhiihihiihi");

        // initialize the previous chat history from the database
        fetch(baseURL+'/messages?'+new URLSearchParams({roomid:this.props.roomid}))
            .then(res=>res.json())
            .then(res=>{
                this.setState({history:res})
                //console.log(res);
                //console.log(this.props.roomname);
            });

        // handle the message received from all other users in the room in real time
        ws.on('message', message => {
            // console.log(message);
            let his = this.state.history;
            his.push(message);
            this.setState({history:his});
			document.getElementById('chatList').scrollTop = document.getElementById('chatList').scrollHeight;   
        });
    }

    // render
    render(){
        //console.log(this.state.history);
        let history = this.state.history;
        let chatlist = [];
        // forming the chat list element for display
        for (var i=0;i<history.length;i++){
            let name = history[i].name;
            let message = history[i].message;
            let index = history[i].imageindex;
            let userid = history[i].userid;
            let output = name + ": " + message
            let length = output.length
            let count = 0;
            let tail;
            for (let i = 0; i < length; i++) {
                count += output.charCodeAt(i) < 256 ? 1 : 2;
                if (count > 44) break
                else tail = i;
            }
            output = output.substr(0, tail + 1)
            let fontcolor = "white"
            if (userid === this.state.playerid) fontcolor = "cyan"
            chatlist.push(<div style = {{color: `${fontcolor}`}} className="container"><img src={image_array[index]} alt="Avatar"/><div>{output}</div></div>);
        }
      return (
          <div className="chatRoom">
              <h1>Chat Box</h1>
			  <div className="chatList" id="chatList">
				{chatlist}
			  </div>
            <form onSubmit={this.handleSubmit}>
			  <fieldset>
                <legend>Input Text</legend>
                <input name="value" type="text" value={this.state.value} placeholder="Send a message" onChange={this.handleChange} />
                <button type="submit" value="Submit">Send</button>
			  </fieldset>
            </form>
          </div>
      );
    }
  }

  export default Chatroom;