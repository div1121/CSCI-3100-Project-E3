import React from 'react';
import { Button } from 'react-bootstrap';

function HomeButton({ setMode }) {
	const home = () => {
		setMode("Home");
	}
	return <Button size="lg" variant="primary" onClick={home}>Home</Button>
}

export default HomeButton;