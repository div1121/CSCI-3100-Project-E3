import React, { Component } from 'react';
import './App.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import { Container, Row, Col } from 'react-bootstrap'
import * as Realm from 'realm-web';
import { TopNavbar } from './Navbar'
import ChatRoom from './ChatRoom';
import Menu from './Menu';

const REALM_APP_ID = 'application-0-exwhb';
const app = new Realm.App({ id: REALM_APP_ID });

function App() {
	const [user, setUser] = React.useState(app.currentUser);
	return (
		<div>
			<TopNavbar user={user} setUser={setUser}/>
			<Container fluid>
				<Row>
					<Col><ChatRoom /></Col>
					<Col><Menu /></Col>
				</Row>
			</Container>
		</div>
	);
};

export default App;
