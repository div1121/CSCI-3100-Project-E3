import React, { useState, useEffect } from 'react';	
import CircularProgress from '@material-ui/core/CircularProgress';
import ws from './service';
import alertify from 'alertifyjs';
import 'alertifyjs/build/css/alertify.css';
import './Menu.css';
import './Alert.css';

//Match is a functional component.
//It returns a button to start matching with other players.
function Match({ setMode, userID, username, setGameRoomEnter, setGameRoomID }){
	const [loading, setLoading] = useState(false);
	
	//Require login before using this function.
	const matching = () => {
		if(userID===null){
			alertify.error('Login first!');
		}else {
			setLoading(true);
			//The server will make a queue for the players using this function.
			ws.emit('ranking',{userid: userID, name: username});
		}
	}
	
	//Players may cancel matching during the process.
	const cancel = () => {
		setLoading(false);
		ws.emit('cancelrank',{userid: userID, name: username});
	}
	
	//Players will receive the game room id after the server has matched up and created a room for them.
	useEffect(() => {
		ws.on('getroominfo',(data)=>{
			setMode("FindingRoom");
			setGameRoomEnter(data.roomname);
			setGameRoomID(data.roomid);
			if(loading===true){
				setMode("Game");
			}
			setLoading(false);
		});
	});
	
	return (
		<>
		{loading===true?
			<button className="menuButton" onClick={cancel}>Matching... <CircularProgress color="black" size="1.5rem"/></button>
		:
			<button className="menuButton" onClick={matching}>Match</button>
		}
		</>
	)
}

//CustomRoom is a functional component.
//It returns a button to switch the app to "FindingRoom" mode.
function CustomRoom({ setMode, userID }) {
	//Require login before using this function
	const customRoom = () => {
		if(userID===null){
			alertify.error('Login first!');
		}else {
			setMode("FindingRoom");
		}
	}
	return <button className="menuButton" onClick={customRoom}>Custom room</button>
}

//Demo is a functional component.
//It returns a button to switch the app to "Demo" mode.
function Demo({ setMode, userID }) {
	const demo = () => {
		setMode("Demo");
	}
	return <button className="menuButton" onClick={demo}>Demo</button>
}

//Menu is a functional component.
//It returns a menu consists of list of three buttons. More options may be added into the menu in the future.
function Menu({ setMode, userID, username, setGameRoomEnter, setGameRoomID }) {
	return(
		<div className='menu'>
			<Match setMode={setMode} userID={userID} username={username} setGameRoomEnter={setGameRoomEnter} setGameRoomID={setGameRoomID}/>
			<CustomRoom setMode={setMode} userID={userID}/>
			<Demo setMode={setMode} userID={userID}/>
		</div>
	);
}

export default Menu;