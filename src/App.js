import React from "react";
import * as Realm from "realm-web";
import {Navbar} from "./Navbar"
import "./App.css";

const REALM_APP_ID = "application-0-exwhb";
const app = new Realm.App({ id: REALM_APP_ID });

function App() {
	const [user, setUser] = React.useState(app.currentUser);
	return (
		<div className="App">
			<Navbar user={user} setUser={setUser}/>
		</div>
	);
};

export default App;
