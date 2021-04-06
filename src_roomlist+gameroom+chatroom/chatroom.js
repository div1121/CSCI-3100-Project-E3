import React from 'react';
import ws from './service';

class SendChat extends React.Component {
    constructor(props) {
      super(props);
      this.state = {roomname:this.props.roomname, name:this.props.name, value: '', history: []};
      this.handleChange = this.handleChange.bind(this);
      this.handleSubmit = this.handleSubmit.bind(this);
        fetch('/messages?'+new URLSearchParams({roomname:this.props.roomname}))
            .then(res=>res.json())
            .then(res=>{
                this.setState({history:res})
                //console.log(res);
                //console.log(this.props.roomname);
            });
    }
  
    handleChange(event) {
      this.setState({value: event.target.value});
    }
  
    handleSubmit(event) {
        let obj = {roomname:this.state.roomname, name: this.state.name, message: this.state.value}
        //console.log(obj);
        /*
        fetch('/messages', {
            method: 'POST', headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(obj)
         });
         */
        ws.emit('messages',obj);
        this.setState({value: ''});
        //fetch('/messages').then(res=>res.json()).then(res=>this.setState({history:res}));
        event.preventDefault();
    }

    componentDidMount(){
        ws.on('message', message => {
            console.log(message);
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
              {chatlist}
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

  export default SendChat;