import React from 'react';
import { Button } from '@material-ui/core';
import ws from './service.js';

//HomeButton is a functional component.
//It returns a button that redirect to the Homepage.
function HomeButton({ userID, username, gameRoomEnter, gameRoomID, setGameRoomEnter, setGameRoomID, setMode }) {
	const home = () => {
		//The player will leave the room if he/she clicks the button in a game room.
		ws.emit('cancelrank',{userid: userID, name: username});
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