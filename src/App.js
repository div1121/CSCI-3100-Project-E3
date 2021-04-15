import React, { useState, useEffect } from 'react';
import './App.css';
import { TopNavbar } from './Navbar'
import News from './News';
import Menu from './Menu';
import Chatroom from './ChatRoom';
import RoomList from "./RoomList";
import GameRoom from './GameRoom';
import Game from './Game';
import Demo from './Demo';
import HomeButton from './HomeButton';

function App() {
	const [userID, setUserID] = useState(sessionStorage.getItem('userID'));
	const [username, setUsername] = useState(sessionStorage.getItem('username'));
	const [gameRoomEnter, setGameRoomEnter] = useState(null);
	const [gameRoomID, setGameRoomID] = useState(null);
	const [mode, setMode] = useState("Home");

	return (
		<div className="app">
			{
				mode!=="Game"&&
				<div className="appHeader">
					<TopNavbar setMode={setMode} userID={userID} username={username} setUserID={setUserID} setUsername={setUsername}/>
					<HomeButton userID={userID} username={username} gameRoomEnter={gameRoomEnter} gameRoomID={gameRoomID} setGameRoomEnter={setGameRoomEnter} setGameRoomID={setGameRoomID} setMode={setMode}/>
				</div>
			}
			{mode === "Game"||mode === "GameEnd"?
				<div className="game"><Game userid={userID} roomid={gameRoomID} setMode={setMode}/></div>
			:
				<div className="appBody">
					{mode==="Home"?
						<div className="homepage">
							<News />
							<Menu setMode={setMode} userID={userID} username={username} setGameRoomEnter={setGameRoomEnter} setGameRoomID={setGameRoomID} />
						</div>
					:gameRoomID !== null?
						<>
							<Chatroom roomid={gameRoomID} userid={userID} name={username} />
							<GameRoom setMode={setMode} roomid={gameRoomID} roomname={gameRoomEnter} playername={username} playerid={userID} setGameroomenter={setGameRoomEnter} setGameroomid={setGameRoomID}/>
						</>
					:mode === "FindingRoom"?
						<div className="homepage">
							<News />
							<RoomList user_id={userID} user_name={username} setGameroomenter={setGameRoomEnter} setGameroomid={setGameRoomID}/>
						</div>
					:mode === "Demo"?
						<Demo username={username}/>
					:
						<div className="homepage">
							<News />
							<Menu setMode={setMode} userID={userID} username={username} setGameRoomEnter={setGameRoomEnter} setGameRoomID={setGameRoomID} />
						</div>
					}
				</div>
			}
		</div>
	);
};

export default App;