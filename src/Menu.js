import React from 'react';
import Game from './Game';
import { Button } from 'react-bootstrap';

function Demo({ setMode }) {
	const demo = () => {
		setMode("Demo");
	}
	return <Button size="lg" variant="primary" onClick={demo}>Demo</Button>
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
				{this.state.mode === "Demo"?
					<Game />
				:
					<></>
				}
			</div>
		);
	}
}

export default Menu;