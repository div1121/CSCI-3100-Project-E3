import React from 'react';
import { Button } from '@material-ui/core';
import ws from './service.js';

function HomeButton({ userID, username, gameRoomEnter, gameRoomID, setGameRoomEnter, setGameRoomID, setMode }) {
	const home = () => {
		if (gameRoomID!=null) {
			ws.emit("leaveroom", {roomid: gameRoomID, roomname: gameRoomEnter, userid: userID, name: username});
			setGameRoomEnter(null);
			setGameRoomID(null);
		}
		setMode("Home");
	}
	return <Button variant="contained" color="default" onClick={home}>Home</Button>
}

export default HomeButton;