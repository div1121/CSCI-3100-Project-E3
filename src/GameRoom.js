// Game room is the room for players before enter the game (chat and send ready)

import React, { Component } from 'react';
import ws from './service';
import './GameRoom.css';
import man1 from './picture/man/man_1_head.gif';
import man2 from './picture/man/man_2_head.gif';
import man3 from './picture/man/man_3_head.gif';
import man4 from './picture/man/man_4_head.gif';
import {PATH_TO_BACKEND} from './baseURL';
const baseURL = PATH_TO_BACKEND;

// Image load from resource for display
const image_array =[man1,man2,man3,man4];

// Player information of the game room (one line)
class Playerline extends Component{
    render(){
        let displayname = this.props.playername
        let str = "Ready"
        let backgroundcolor = "rgba(0, 0, 0, 0.7)"
        if (this.props.isready) {
            str = "Cancel"
            displayname += " (Ready)"
            backgroundcolor = "rgba(24, 57, 80, 0.8)"
        }
        let fontcolor = "white"
        if (this.props.ismyself) {
            fontcolor = "cyan"
        }
        return (
			<div style = {{backgroundColor: `${backgroundcolor}`}} className="gameRoomPlayerLine">
                <img align="center" height="40" width="40" src={this.props.image} alt="Avator"/>
				<span style = {{color: `${fontcolor}`}}>
                    　{displayname}
				</span>
                {
                    this.props.handleready != null &&
                        <button onClick={this.props.handleready}>{str}</button>
                }
                {
	                   this.props.position && this.props.ready_num===this.props.totalplayer && this.props.totalplayer > 1 &&
                        <button onClick={this.props.startgame}>Start</button>
                }
			</div>
        )
    }
}

// Game room
class Gameroom extends Component{
    // constructor
    constructor(props) {
        super(props);
        this.state = {roomid:this.props.roomid, roomname: this.props.roomname, player_list: [], player_id: [], player_num: 0, ready_num: 0 ,ready_state: []};
        this.addready = this.addready.bind(this);
        this.minusready = this.minusready.bind(this);
        this.handleLeaveRoom = this.handleLeaveRoom.bind(this);
        this.startgame = this.startgame.bind(this);
    }

    // function to start game (click start button) and send information to backend
	startgame()	{
        ws.emit('startgame',{roomid:this.props.roomid});
	}
	
    componentDidMount(){

        // initialize the existing room memeber in the room from the database
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
                    if (res[i].userid===this.props.playerid)
                        this.props.setImageIndex(i);
                    num++;
                    ready.push(res[i].ready);
                    if (res[i].ready)
                        t++;
                }
                // console.log("How are you")
                console.log(res);
                this.setState({player_list:players, player_id:players_ids,player_num:num, ready_num:t, ready_state:ready});
            });

        // function for receiving new member entering the room and update the information (real time)
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

        // function for receiving the change in ready state and update (real time)
        ws.on('readychange', data => {
            this.setState({ready_num: data.ready_num, ready_state:data.ready_state});
        });

        // function for receiving the signal of start game and update (real time)
        ws.on('startgame', () => {
            this.props.setMode("Game");
        });

        // fucntion for receiving member leave the room and update (real time)
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

    // function for set user state as ready
    addready(i){
        let array = this.state.ready_state;
        array[i] = true;
        let ready_num = this.state.ready_num + 1;
        ws.emit('readychange',{roomid:this.state.roomid, userid:this.props.playerid, ready_num: ready_num, ready_state:array, save:true})
    }

    // function for set user state as not ready
    minusready(i){
        let array = this.state.ready_state;
        array[i] = false;
        let ready_num = this.state.ready_num - 1;
        ws.emit('readychange',{roomid:this.state.roomid, userid:this.props.playerid, ready_num: ready_num, ready_state:array, save:false})
    }

    // function for handle a user leave the room (click the leave button)
    handleLeaveRoom(){
        ws.emit('leaveroom',{roomid:this.state.roomid, roomname:this.state.roomname, userid:this.props.playerid, name:this.props.playername});
        //this.setState({game_room_enter:null, game_room_id:null});
        this.props.setGameroomenter(null);
        this.props.setGameroomid(null);
    }

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
        // holding the list of players in the room
        let display = [];
        for (let i=0;i<this.state.player_num;i++){
            display.push(<Playerline isready={this.state.ready_state[i]}
                                     playername={this.state.player_list[i]}
                                     ismyself={this.props.playerid===this.state.player_id[i]}
                                     image={image_array[i]}
                                     handleready={list[i]}
                                     position={i===0 && list[0]!==null}
                                     ready_num={this.state.ready_num}
                                     totalplayer={this.state.player_num}
									 setMode={this.props.setMode}
									 roomid={this.state.roomid}
									 startgame={this.startgame}/>);
        }
        return (
			<div className="gameRoom">
				<h1>You're in: {this.props.roomname}</h1>
				<div className="gameRoomPlayers">
					{display}
				</div>
				<div className="gameRoomFooter">
					<h1>Number of ready: {this.state.ready_num}/{this.state.player_num}</h1>
					<button onClick={this.handleLeaveRoom}>Leave</button>
				</div>
			</div>
		)
    }
}

export default Gameroom;