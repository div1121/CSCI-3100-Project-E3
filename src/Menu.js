import React, { useState } from 'react';
import { Spinner } from 'react-bootstrap';
import { LoginButton } from './Login';

function Match({ userID }) {
	const [loading, setLoading] = useState(false);
	const matching = () => {
		if(userID===null){
			alert('Login first!');
		}else {
			setLoading(!loading);
		}
	}
	return <button className="MenuButton" onClick={matching}>Matching {loading?<Spinner animation="border" role="status" />:<></>}</button>
}

function CustomRoom({ setMode, userID }) {
	const customRoom = () => {
		if(userID===null){
			alert('Login first!');
		}else {
			setMode("FindingRoom");
		}
	}
	return <button className="MenuButton" onClick={customRoom}>Custom room</button>
}

function Demo({ setMode, userID }) {
	const demo = () => {
		setMode("Game");
	}
	return <button className="MenuButton" onClick={demo}>Demo</button>
}

function Menu({ setMode, userID }) {
	return(
		<div className='menu'>
			<h1>Menu</h1>
			<div>
				<Match userID={userID}/>
			</div>
			<div>
				<CustomRoom setMode={setMode} userID={userID}/>
			</div>
			<div>
				<Demo setMode={setMode} userID={userID}/>
			</div>
		</div>
	);
}

export default Menu;