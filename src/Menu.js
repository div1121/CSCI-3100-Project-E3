import React, { useState, useEffect } from 'react';	
import CircularProgress from '@material-ui/core/CircularProgress';
import ws from './service';
import alertify from 'alertifyjs';
import 'alertifyjs/build/css/alertify.css';
import './Alert.css'

function Match({ setMode, userID, username, setGameRoomEnter, setGameRoomID }){
	const [loading, setLoading] = useState(false);
	const matching = () => {
		if(userID===null){
			alertify.error('Login first!');
		}else {
			setLoading(!loading);
			ws.emit('ranking',{userid: userID, name: username});
		}
	}
	const cancel = () => {
		console.log("hi");
		setLoading(false);
		ws.emit('cancelrank',{userid: userID, name: username});
	}
	useEffect(() => {
		ws.on('getroominfo',(data)=>{
			setMode("FindingRoom");
			//console.log("OK");
			setLoading(!loading);
			setGameRoomEnter(data.roomname);
			setGameRoomID(data.roomid);
		});
	});
	return (
		<>
		{loading===true?
			<button className="menuButton" onClick={cancel}>Matching<CircularProgress size="1.5rem"/></button>
		:
			<button className="menuButton" onClick={matching}>Match</button>
		}
		</>
	)
}

function CustomRoom({ setMode, userID }) {
	const customRoom = () => {
		if(userID===null){
			alertify.error('Login first!');
		}else {
			setMode("FindingRoom");
		}
	}
	return <button className="menuButton" onClick={customRoom}>Custom room</button>
}

function Demo({ setMode, userID }) {
	const demo = () => {
		setMode("Demo");
	}
	return <button className="menuButton" onClick={demo}>Demo</button>
}

function Menu({ setMode, userID, username, setGameRoomEnter, setGameRoomID }) {
	return(
		<div className='menu'>
			<h1>Menu</h1>
			<Match setMode={setMode} userID={userID} username={username} setGameRoomEnter={setGameRoomEnter} setGameRoomID={setGameRoomID}/>
			<CustomRoom setMode={setMode} userID={userID}/>
			<Demo setMode={setMode} userID={userID}/>
		</div>
	);
}

export default Menu;