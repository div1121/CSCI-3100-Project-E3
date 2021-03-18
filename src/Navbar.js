import { Nav, Navbar, Button, Form, FormControl} from 'react-bootstrap';
import {LoginAsGuest, Register, LoginWithEmail, LogOut, LoginForm, LoginButton} from "./Login"

function TopNavbar({ user, setUser }){
	return(
	<div>
		<Navbar bg="dark" variant="dark">
			<Navbar.Brand>Magic Maze</Navbar.Brand>
			<Nav>
				<Navbar.Text>• A game created by CSCI3100 Project Group E3</Navbar.Text>
			</Nav>
			<Nav className="ml-auto">
				{!user?
					<Nav.Link href="#home"><LoginButton setUser={setUser}/></Nav.Link>
				:(
					<>
						<Navbar.Text>Your id: {user.id}</Navbar.Text>
						<Nav.Link href="#home"><LogOut setUser={setUser}/></Nav.Link>
					</>
				)}
			</Nav>
		</Navbar>
	</div>
	)
}

export {TopNavbar};