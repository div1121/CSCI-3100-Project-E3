import React, { Component } from 'react';
import './App.css';
import 'bootstrap/dist/css/bootstrap.min.css';
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
		<div>
			<TopNavbar userID={userID} username={username} setUserID={setUserID} setUsername={setUsername}/>
			{mode === "Game"?
				<></>
			:
				<Container fluid>
					<Row>
						<Col>
							<Chatroom roomid={gameRoomID} userid={userID} name={username} />
						</Col>
						<Col>
							{gameRoomID !== null?
								<GameRoom roomid={gameRoomID} roomname={gameRoomEnter} playername={username} playerid={userID} setGameroomenter={setGameRoomEnter} setGameroomid={setGameRoomID}/>
							:mode === "FindingRoom"?
								<RoomList user_id={userID} user_name={username} setGameroomenter={setGameRoomEnter} setGameroomid={setGameRoomID}/>
							:mode === "Demo"?
								<Game />
							:
								<Menu setMode={setMode} />
							}
						</Col>
					</Row>
				</Container>
			}
			<HomeButton setMode={setMode}/>
		</div>
	);
};

export default App;