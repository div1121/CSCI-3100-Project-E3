import React, { useState } from 'react';
import { Spinner } from 'react-bootstrap';

function Match() {
	const [loading, setLoading] = useState(false);
	const matching = () => {
		setLoading(!loading);
	}
	return <button className="MenuButton" onClick={matching}>Matching {loading?<Spinner animation="border" role="status" />:<></>}</button>
}

function CustomRoom({ setMode }) {
	const customRoom = () => {
		setMode("FindingRoom");
	}
	return <button className="MenuButton" onClick={customRoom}>Custom room</button>
}

function Demo({ setMode }) {
	const demo = () => {
		setMode("Demo");
	}
	return <button className="MenuButton" onClick={demo}>Demo</button>
}

function Menu({ setMode }) {
	return(
		<div className='menu'>
			<h1>Menu</h1>
			<div>
				<Match />
			</div>
			<div>
				<CustomRoom setMode={setMode}/>
			</div>
			<div>
				<Demo setMode={setMode}/>
			</div>
		</div>
	);
}

export default Menu;