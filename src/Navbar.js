import { Nav, Navbar, Button, Form, FormControl } from 'react-bootstrap';
import { LogoutButton, LoginButton } from './Login';
import { ProfileButton } from './Profile';

function TopNavbar({ userID, username, setUserID, setUsername }) {
	return(
	<div>
		<Navbar className='py-4' bg='dark' variant='dark'>
			<Navbar.Brand href="https://github.com/luyou00001/CSCI-3100-Project-E3	">Magic Maze</Navbar.Brand>
			<Nav>
				<Navbar.Text>• A game created by CSCI3100 Project Group E3</Navbar.Text>
			</Nav>
			<Nav className='ml-auto'></Nav>
			{userID===null?
				<Nav.Link href='#home'><LoginButton setUserID={setUserID} setUsername={setUsername}/></Nav.Link>
			:(
				<>
					<Navbar.Brand>Welcome {username}</Navbar.Brand>
					<Nav.Link href='#home'><ProfileButton userID={userID} username={username} setUsername={setUsername}/></Nav.Link>
					<Nav.Link href='#home'><LogoutButton setUserID={setUserID} setUsername={setUsername}/></Nav.Link>
				</>
			)}
		</Navbar>
	</div>
	)
}

export {TopNavbar};