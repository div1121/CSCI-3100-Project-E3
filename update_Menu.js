import React, { useState } from 'react';
import { Spinner } from 'react-bootstrap';

function Rank({userID, username, setGameRoomEnter, setGameRoomID}){
	const [loading, setLoading] = useState(false);
	const matching = () => {
		setLoading(!loading);
		ws.emit('ranking',{userid: userID, name: username});
	}
	useEffect(() => {
		ws.on('getroominfo',(data)=>{
			console.log("OK");
			setLoading(!loading);
			setGameRoomEnter(data.roomname);
			setGameRoomID(data.roomid);
		});
	});
	return <button className="MenuButton" onClick={matching}>Matching {loading?<Spinner animation="border" role="status" />:<></>}</button>
}

function Match() {
	const [loading, setLoading] = useState(false);
	const matching = () => {
		setLoading(!loading);
	}
	return <button className="MenuButton" onClick={matching}>Matching {loading?<Spinner animation="border" role="status" />:<></>}</button>
}

function CustomRoom({ setMode }) {
	const customRoom = () => {
		setMode("FindingRoom");
	}
	return <button className="MenuButton" onClick={customRoom}>Custom room</button>
}

function Demo({ setMode }) {
	const demo = () => {
		setMode("Game");
	}
	return <button className="MenuButton" onClick={demo}>Demo</button>
}

function Menu({ userID, username, setGameRoomEnter, setGameRoomID, setMode }) {
	return(
		<div className='menu'>
			<h1>Menu</h1>
			<div>
				<Rank userID={userID}, username={username}, setGameRoomEnter={setGameRoomEnter}, setGameRoomID={setGameRoomID} />
			</div>
			<div>
				<Match />
			</div>
			<div>
				<CustomRoom setMode={setMode}/>
			</div>
			<div>
				<Demo setMode={setMode}/>
			</div>
		</div>
	);
}

export default Menu;