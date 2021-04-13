import React from 'react';
import ws from './service';

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
        fetch('/messages?'+new URLSearchParams({roomid:this.props.roomid}))
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
            chatlist.push(<div>{name}: {message}</div>);
        }
      return (
          <div>
              <h1>Chat Room</h1>
              {chatlist}
            <form onSubmit={this.handleSubmit}>
                <label>Input Text</label><br></br>
                <textarea name="value" type="text" value={this.state.value} placeholder="Send a message" onChange={this.handleChange} />
                <input type="submit" value="Submit" />
            </form>
          </div>
      );
    }
  }

  export default SendChat;