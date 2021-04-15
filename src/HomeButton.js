import React from 'react';
import { Button } from 'react-bootstrap';
import ws from './service.js';

function HomeButton({ userID, username, gameRoomEnter, gameRoomID, setGameRoomEnter, setGameRoomID, setMode }) {
	const home = () => {
		ws.emit("leaveroom",{roomid:gameRoomID, roomname:gameRoomEnter, userid:userID, name:username});
		setGameRoomEnter(null);
		setGameRoomID(null);
		setMode("Home");
	}
	return <button size="lg" variant="primary" onClick={home}>Home</button>
}

export default HomeButton;