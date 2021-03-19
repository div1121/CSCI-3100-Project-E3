import React from "react";
import "./App.css";
import 'bootstrap/dist/css/bootstrap.min.css';
import * as Realm from "realm-web";
import {TopNavbar} from "./Navbar"
import Game from './Game';

const REALM_APP_ID = "application-0-exwhb";
const app = new Realm.App({ id: REALM_APP_ID });

class App extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			user: app.currentUser
		}
		this.setUser=this.setUser.bind(this);
	}
	
	setUser(i) {
		this.setState({
			user: i,
		});
	}
	
	render() {
		return (
			<div className="App">
				<TopNavbar user={this.state.user} setUser={this.setUser}/>
				<Game />
			</div>
		);
	}
};

export default App;
