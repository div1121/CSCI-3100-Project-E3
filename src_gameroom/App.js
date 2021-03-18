import React, { Component } from 'react';
import Gameroom from "./Gameroom";

class App extends Component {
	render() {
		return (
			<div className="App">
			<Gameroom room_name={"Game1"} player_list={["Paul","Alice","Sun","Jason"]} player_num={4}/>
			</div>
		);
	}
}

export default App;