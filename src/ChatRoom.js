import React from 'react';
import ws from './service';
import './ChatRoom.css';
import {PATH_TO_BACKEND} from './baseURL';
const baseURL = PATH_TO_BACKEND;

class SendChat extends React.Component {
    constructor(props) {
      super(props);
      this.state = {roomid:this.props.roomid, playerid:this.props.userid, name:this.props.name, value: '', history: []};
      this.handleChange = this.handleChange.bind(this);
      this.handleSubmit = this.handleSubmit.bind(this);
    }

    handleChange(event) {
        const target = event.target;
        const value = target.type === 'checkbox' ? target.checked : target.value;
        const name = target.name;

        this.setState({
            [name]: value
        });
    }
  
    handleSubmit(event) {
        let obj = {roomid:this.state.roomid, userid:this.state.playerid, name: this.state.name, message: this.state.value}
        ws.emit('messages',obj);
        this.setState({value: ''});
        event.preventDefault();
    }

    componentDidMount(){
		//console.log("hihiihhiihihiihi");
        fetch(baseURL+'/messages?'+new URLSearchParams({roomid:this.props.roomid}))
            .then(res=>res.json())
            .then(res=>{
                this.setState({history:res})
                //console.log(res);
                //console.log(this.props.roomname);
            });
        ws.on('message', message => {
            // console.log(message);
            let his = this.state.history;
            his.push(message);
            this.setState({history:his});
        });
    }

    render(){
        //console.log(this.state.history);
        let history = this.state.history;
        let chatlist = [];
        for (var i=0;i<history.length;i++){
            let name = history[i].name;
            let message = history[i].message;
            chatlist.push(<div className="chat"><h4 className="chatName">{name}</h4><h4>:</h4><span>{message}</span></div>);
        }
      return (
          <div className="chatRoom">
              <h1>Chat Box</h1>
			  <div className="chatList">
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

  export default SendChat;