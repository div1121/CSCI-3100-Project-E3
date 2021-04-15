import React, { Component } from 'react';
import ws from './service';
import {PATH_TO_BACKEND} from './baseURL';
const baseURL = PATH_TO_BACKEND;

//member
class Playerline extends Component{
    render(){
        let str = "Ready"
        if (this.props.isready){
            str = "Cancel"
        }
        return (<tr>
            <td>
                {this.props.playername}
            </td>
                {
                    this.props.handleready != null &&
                    <td>
                        <button onClick={this.props.handleready}>{str}</button>
                    </td>
                }
                {
                    this.props.position && this.props.ready_num===4 &&
                    <td>
                        <button onClick={this.props.startgame}>Start</button>
                    </td>
                }
            </tr>
        )
    }
}

// Class Chatroom (to be imported)

class Gameroom extends Component{
    constructor(props) {
        super(props);
        this.state = {roomid:this.props.roomid, roomname: this.props.roomname, player_list: [], player_id: [], player_num: 0, ready_num: 0 ,ready_state: []};
        this.addready = this.addready.bind(this);
        this.minusready = this.minusready.bind(this);
        this.handleLeaveRoom = this.handleLeaveRoom.bind(this);
        this.startgame = this.startgame.bind(this);
    }

	startgame()	{
        ws.emit('startgame',{roomid:this.props.roomid});
	}
	
    componentDidMount(){
        fetch(baseURL+'/roommember?'+new URLSearchParams({roomid:this.props.roomid}))
            .then(res=>res.json())
            .then(res=>{
                let players = this.state.player_list;
                let players_ids = this.state.player_id;
                let num = this.state.player_num;
                let t = this.state.ready_num;
                let ready = this.state.ready_state;
                // console.log(res.length);
                // console.log(res);
                for (var i=0;i<res.length;i++){
                    players.push(res[i].name);
                    players_ids.push(res[i].userid);
                    num++;
                    ready.push(res[i].ready);
                    if (res[i].ready)
                        t++;
                }
                // console.log("How are you")
                console.log(res);
                this.setState({player_list:players, player_id:players_ids,player_num:num, ready_num:t, ready_state:ready});
            });
        ws.on('addroommember', data =>{
            let players = this.state.player_list;
            let players_ids = this.state.player_id;
            let num = this.state.player_num;
            let ready = this.state.ready_state;
            players.push(data.name);
            players_ids.push(data.userid);
            num = num + 1;
            ready.push(false);
            this.setState({player_list:players, player_id:players_ids, player_num:num,ready_state:ready});
        });

        ws.on('readychange', data => {
            this.setState({ready_num: data.ready_num, ready_state:data.ready_state});
        });
		
        ws.on('startgame', () => {
            this.props.setMode("Game");
        });

        ws.on('decreaseroommember', data =>{
            let players = this.state.player_list;
            let players_ids = this.state.player_id;
            let num = this.state.player_num;
            let ready = this.state.ready_state;
            let t = this.state.ready_num;
            const isMatch = (element) => element === data.userid;
            let temp = players_ids.findIndex(isMatch);
            //console.log(players_ids);
            //console.log(data);
            //console.log(temp);
            if (ready[temp])
                t-=1;
            num = num - 1;
            players.splice(temp,1);
            ready.splice(temp,1);
            players_ids.splice(temp,1);
            this.setState({player_list:players, player_id:players_ids, player_num:num,ready_num:t,ready_state:ready});
        });
    }

    addready(i){
        let array = this.state.ready_state;
        array[i] = true;
        let ready_num = this.state.ready_num + 1;
        ws.emit('readychange',{roomid:this.state.roomid, userid:this.props.playerid, ready_num: ready_num, ready_state:array, save:true})
    }

    minusready(i){
        let array = this.state.ready_state;
        array[i] = false;
        let ready_num = this.state.ready_num - 1;
        ws.emit('readychange',{roomid:this.state.roomid, userid:this.props.playerid, ready_num: ready_num, ready_state:array, save:false})
    }

    handleLeaveRoom(){
        ws.emit('leaveroom',{roomid:this.state.roomid, roomname:this.state.roomname, userid:this.props.playerid, name:this.props.playername});
        //this.setState({game_room_enter:null, game_room_id:null});
        this.props.setGameroomenter(null);
        this.props.setGameroomid(null);
    }

    //invite button function for each player (to be implemented)
    render(){
        let list = [];
        for (let i=0;i<this.state.player_num;i++){
            if (this.state.player_id[i]===this.props.playerid) {
                if (this.state.ready_state[i])
                    list.push(() => this.minusready(i));
                else list.push(() => this.addready(i));
            }
            else{
                list.push(null);
            }
        }
        let display = [];
        for (let i=0;i<this.state.player_num;i++){
            display.push(<Playerline isready={this.state.ready_state[i]}
                                     playername={this.state.player_list[i]}
                                     handleready={list[i]}
                                     position={i===0 && list[0]!==null}
                                     ready_num={this.state.ready_num}
									 setMode={this.props.setMode}
									 roomid={this.state.roomid}
									 startgame={this.startgame}/>);
        }
        return (<div>
            <h1>Game Room</h1>
            <h1>You're in: {this.props.roomname}</h1>
            <table>
                {display}
            </table>
            <h2>Number of ready: {this.state.ready_num}</h2>
            <button onClick={this.handleLeaveRoom}>Leave</button>
        </div>)
    }
}

export default Gameroom;