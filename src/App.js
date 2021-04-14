import React, { Component, useEffect } from 'react';
import './App.css';
import { Container, Row, Col } from 'react-bootstrap'
import { TopNavbar } from './Navbar'
import Menu from './Menu';
import Chatroom from './ChatRoom';
import RoomList from "./RoomList";
import GameRoom from './GameRoom';
import Game from './Game';
import HomeButton from './HomeButton';

function App() {
	const [userID, setUserID] = React.useState(sessionStorage.getItem('userID'));
	const [username, setUsername] = React.useState(sessionStorage.getItem('username'));
	const [gameRoomEnter, setGameRoomEnter] = React.useState(null);
	const [gameRoomID, setGameRoomID] = React.useState(null);
	const [mode, setMode] = React.useState("Home");
	
	return (
		<div className="app">
			<div className="app_header">
				<TopNavbar userID={userID} username={username} setUserID={setUserID} setUsername={setUsername}/>
			</div>
			<div className="app_body">
				{mode === "Game"?
					<Game />
				:
					<>
						{gameRoomID !== null?
						<>
							<Chatroom roomid={gameRoomID} userid={userID} name={username} />
							<GameRoom roomid={gameRoomID} roomname={gameRoomEnter} playername={username} playerid={userID} setGameroomenter={setGameRoomEnter} setGameroomid={setGameRoomID}/>
						</>
						:mode === "FindingRoom"?
							<RoomList user_id={userID} user_name={username} setGameroomenter={setGameRoomEnter} setGameroomid={setGameRoomID}/>
						:mode === "Demo"?
							<Game />
						:
							<Menu setMode={setMode} />
						}
					</>
				}
				<HomeButton setMode={setMode}/>
			</div>
		</div>
	);
};

export default App;