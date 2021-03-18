import React, { Component } from "react";
import "./App.css";
import 'bootstrap/dist/css/bootstrap.min.css';
import * as Realm from "realm-web";
import {TopNavbar} from "./Navbar"
import Game from './Game';

const REALM_APP_ID = "application-0-exwhb";
const app = new Realm.App({ id: REALM_APP_ID });

function App() {
	const [user, setUser] = React.useState(app.currentUser);
	return (
		<div className="App">
			<TopNavbar user={user} setUser={setUser}/>
			<Game />
		</div>
	);
};

export default App;
