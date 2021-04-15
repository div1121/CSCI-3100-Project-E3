import React, { useState, useEffect } from 'react';	
import CircularProgress from '@material-ui/core/CircularProgress';
import ws from './service';

function Match({ userID, username, setGameRoomEnter, setGameRoomID }){
	const [loading, setLoading] = useState(false);
	const matching = () => {
		if(userID===null){
			alert('Login first!');
		}else {
			setLoading(!loading);
			ws.emit('ranking',{userid: userID, name: username});
		}
	}
	useEffect(() => {
		ws.on('getroominfo',(data)=>{
			console.log("OK");
			setLoading(!loading);
			setGameRoomEnter(data.roomname);
			setGameRoomID(data.roomid);
		});
	});
	return (
		<>
		{loading===true?
			<button className="menuButton" disabled>Matching<CircularProgress size="1.5rem"/></button>
		:
			<button className="menuButton" onClick={matching}>Match</button>
		}
		</>
	)
}

function CustomRoom({ setMode, userID }) {
	const customRoom = () => {
		if(userID===null){
			alert('Login first!');
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
			<Match userID={userID} username={username} setGameRoomEnter={setGameRoomEnter} setGameRoomID={setGameRoomID}/>
			<CustomRoom setMode={setMode} userID={userID}/>
			<Demo setMode={setMode} userID={userID}/>
		</div>
	);
}

export default Menu;