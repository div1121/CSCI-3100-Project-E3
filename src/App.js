import React, { useState, useEffect } from 'react';
import './App.css';
import { TopNavbar } from './Navbar'
import Menu from './Menu';
import Chatroom from './ChatRoom';
import RoomList from "./RoomList";
import GameRoom from './GameRoom';
import Game from './Game';
import HomeButton from './HomeButton';

function App() {
	const [userID, setUserID] = useState(sessionStorage.getItem('userID'));
	const [username, setUsername] = useState(sessionStorage.getItem('username'));
	const [gameRoomEnter, setGameRoomEnter] = useState(null);
	const [gameRoomID, setGameRoomID] = useState(null);
	const [mode, setMode] = useState("Home");

	return (
		<div className="app">
			{mode === "Game"?
				<div className="game"><Game userid={userID} roomid={gameRoomID}/></div>
			:
			<>
				<div className="appHeader">
					<TopNavbar userID={userID} username={username} setUserID={setUserID} setUsername={setUsername}/>
					<HomeButton setMode={setMode}/>
				</div>
				<div className="appBody">
							{gameRoomID !== null?
							<>
								<GameRoom setMode={setMode} roomid={gameRoomID} roomname={gameRoomEnter} playername={username} playerid={userID} setGameroomenter={setGameRoomEnter} setGameroomid={setGameRoomID}/>
								<Chatroom roomid={gameRoomID} userid={userID} name={username} />
							</>
							:mode === "FindingRoom"?
								<RoomList user_id={userID} user_name={username} setGameroomenter={setGameRoomEnter} setGameroomid={setGameRoomID}/>
							:mode === "Demo"?
								<Game />
							:
								<Menu setMode={setMode} userID={userID} username={username} setGameRoomEnter={setGameRoomEnter} setGameRoomID={setGameRoomID} />
							}
				</div>
			</>
			}
		</div>
	);
};

export default App;