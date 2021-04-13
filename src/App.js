import React, { Component } from 'react';
import './App.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import { Container, Row, Col } from 'react-bootstrap'
import { TopNavbar } from './Navbar'
import Chatroom from './ChatRoom';
import Menu from './Menu';
import Game from './Game';
import GameRoom from './GameRoom';
import HomeButton from './HomeButton';

function App() {
	const [userID, setUserID] = React.useState(sessionStorage.getItem('userID'));
	const [username, setUsername] = React.useState(sessionStorage.getItem('username'));
	const [mode, setMode] = React.useState("Home");
	return (
		<div>
			<TopNavbar userID={userID} username={username} setUserID={setUserID} setUsername={setUsername}/>
			{mode === "Home"?
				<Container fluid>
					<Row>
						<Col><Chatroom /></Col>
						<Col><Menu setMode={setMode} /></Col>
					</Row>
				</Container>
			:mode === "Demo"?
				<Game />
			:mode === "CustomRoom"?
				<GameRoom room_name={"Game1"} player_list={["Paul","Alice","Sun","Jason"]} player_num={4}/>
			:
				<></>
			}
			<HomeButton setMode={setMode}/>
		</div>
	);
};

export default App;