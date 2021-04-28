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

//App is the major component of the system.
function App() {
	//The system will store user id and username in session so that they can stay login after freshing the page.
	const [userID, setUserID] = useState(sessionStorage.getItem('userID'));
	const [username, setUsername] = useState(sessionStorage.getItem('username'));
	const [gameRoomEnter, setGameRoomEnter] = useState(null);
	const [gameRoomID, setGameRoomID] = useState(null);
	const [imageindex, setImageIndex] = useState(null);
	//The system will use this state, "mode", to control what to display.
	const [mode, setMode] = useState("Home");

	//The app will display the corresponding components according to the current mode.
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
							<Chatroom roomid={gameRoomID} userid={userID} name={username} imageindex={imageindex}/>
							<GameRoom setMode={setMode} roomid={gameRoomID} roomname={gameRoomEnter} playername={username} playerid={userID} setGameroomenter={setGameRoomEnter} setGameroomid={setGameRoomID} setImageIndex={setImageIndex}/>
						</>
					:mode === "FindingRoom"?
						<div className="homepage">
							<News />
							<RoomList user_id={userID} user_name={username} setGameroomenter={setGameRoomEnter} setGameroomid={setGameRoomID}/>
						</div>
					:mode === "Demo"?
						<Demo username={username} setMode={setMode}/>
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