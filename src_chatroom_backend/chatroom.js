import React from 'react';
import ReactDOM from 'react-dom';
import socketIOClient from 'socket.io-client';

class SendChat extends React.Component {
    constructor(props) {
      super(props);
      this.state = {name:this.props.name, value: '', history:' '};
      fetch('/messages')
            .then(res=>res.json())
            .then(res=>this.setState({history:res}));
      this.handleChange = this.handleChange.bind(this);
      this.handleSubmit = this.handleSubmit.bind(this);
    }
  
    handleChange(event) {
      this.setState({value: event.target.value});
    }
  
    handleSubmit(event) {
        let obj = {name: this.props.name, message: this.state.value}
        //console.log(obj);
        fetch('/messages', {
            method: 'POST', headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(obj)
         });
        this.setState({value: ''});
        //fetch('/messages').then(res=>res.json()).then(res=>this.setState({history:res}));
      event.preventDefault();
    }

    componentDidMount(){
        const ws = socketIOClient("http://localhost:8000");
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