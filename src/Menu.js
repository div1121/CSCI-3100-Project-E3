import React from 'react';
import { Button } from 'react-bootstrap';
import Game from './Game';
import GameRoom from './GameRoom';

function Demo({ setMode }) {
	const demo = () => {
		setMode("Demo");
	}
	return <Button size="lg" variant="primary" onClick={demo}>Demo</Button>
}

function CustomRoom({ setMode }) {
	const customRoom = () => {
		setMode("CustomRoom");
	}
	return <Button size="lg" variant="primary" onClick={customRoom}>Custom room</Button>
}

class Menu extends React.Component {
	constructor(props){
		super(props);
		this.state = {
			mode: "",
		}
		this.setMode=this.setMode.bind(this);
	}
	
	setMode(i)	{
		this.setState({
			mode: i,
		});
	}
	
	render() {
		return(
			<div className='menu'>
				<h1>Menu</h1>
				<Demo setMode={this.setMode}/>
				<CustomRoom setMode={this.setMode}/>
				{this.state.mode === "Demo"?
					<Game />
				:
					<></>
				}
				{this.state.mode === "CustomRoom"?
					<GameRoom room_name={"Game1"} player_list={["Paul","Alice","Sun","Jason"]} player_num={4}/>
				:
					<></>
				}
			</div>
		);
	}
}

export default Menu;