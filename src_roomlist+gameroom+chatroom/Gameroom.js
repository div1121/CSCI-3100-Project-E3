import React, { Component } from 'react';
import ws from './service';

//member
class Playerline extends Component{
    render(){
        let str = "Ready"
        if (this.props.isready){
            str = "Cancel"
        }
        // invite button display (to be implemented)
        return (<tr>
            <td>
            {this.props.playername}</td>
            <td><button onClick={this.props.handleready}>{str}</button>
            </td>
            </tr>
            )
    }
}

// Class Chatroom (to be imported)

class Gameroom extends Component{
    constructor(props) {
        super(props);
        this.state = {roomname: this.props.roomname, player_list: [], player_num: 0, ready_num: 0 ,ready_state: []};
        this.addready = this.addready.bind(this);
        this.minusready = this.minusready.bind(this);
        fetch('/roommember?'+new URLSearchParams({roomname:this.props.roomname}))
            .then(res=>res.json())
            .then(res=>{
                let players = this.state.player_list;
                let num = this.state.player_num;
                let t = this.state.ready_num;
                let ready = this.state.ready_state;
                console.log(res.length);
                for (var i=0;i<res.length;i++){
                    players.push(res[i].name);
                    num++;
                    ready.push(res[i].ready);
                    if (res[i].ready)
                        t++;
                }
                console.log("How are you")
                console.log(res);
                this.setState({player_list:players, player_num:num, ready_num:t, ready_state:ready});
            });
    }

    componentDidMount(){
        ws.on('addroommember', data =>{
            let players = this.state.player_list;
            let num = this.state.player_num;
            let ready = this.state.ready_state;
            players.push(data.name);
            num = num + 1;
            ready.push(false);
            this.setState({player_list:players,player_num:num,ready_state:ready});
        });

        ws.on('readychange', data => {
            this.setState({ready_num: data.ready_num, ready_state:data.ready_state});
        });

        ws.on('decreaseroommember', data =>{
            let players = this.state.player_list;
            let num = this.state.player_num;
            let ready = this.state.ready_state;
            let t = this.state.ready_num;
            const isMatch = (element) => element === data.name;
            let temp = players.findIndex(isMatch);
            console.log(data.name);
            console.log(temp);
            if (ready[temp])
                t--;
            num = num - 1;
            players.splice(temp,1);
            ready.splice(temp,1);
            this.setState({player_list:players,player_num:num,ready_num:t,ready_state:ready});
        });
    }

    addready(i){
        let array = this.state.ready_state;
        array[i] = true;
        let ready_num = this.state.ready_num + 1;
        ws.emit('readychange',{roomname:this.state.roomname, ready_num: ready_num, ready_state:array})
    }

    minusready(i){
        let array = this.state.ready_state;
        array[i] = false;
        let ready_num = this.state.ready_num - 1;
        ws.emit('readychange',{roomname:this.state.roomname, ready_num: ready_num, ready_state:array})
    }

    //invite button function for each player (to be implemented)
    render(){
        let list = [];
        for (let i=0;i<this.state.player_num;i++){
            if (this.state.ready_state[i])
                list.push(() => this.minusready(i));
            else list.push(() => this.addready(i));
        }
        let display = [];
        for (let i=0;i<this.state.player_num;i++){
            display.push(<Playerline isready={this.state.ready_state[i]}
                                     playername={this.state.player_list[i]} handleready={list[i]} />);
        }
        return (<div>
            <h1>{this.props.roomname}</h1>
            <table>
                {display}
            </table>
            <h2>Number of ready: {this.state.ready_num}</h2>
            <button onClick={this.props.handleleave}>Leave</button>
        </div>)
    }
}

export default Gameroom;