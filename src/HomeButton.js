import React from 'react';
import { Button } from 'react-bootstrap';

function HomeButton({ setMode }) {
	const home = () => {
		setMode("Home");
	}
	return <button size="lg" variant="primary" onClick={home}>Home</button>
}

export default HomeButton;