import React from 'react';
import { Button } from '@material-ui/core';

function HomeButton({ setMode }) {
	const home = () => {
		setMode("Home");
	}
	return <Button variant="contained" color="default" onClick={home}>Home</Button>
}

export default HomeButton;