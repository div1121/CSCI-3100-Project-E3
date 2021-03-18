import {LoginAsGuest, Register, LoginWithEmail, LogOut, LoginForm} from "./Login"
import Modal from '@material-ui/core/Modal';

function Navbar({ user, setUser }){
	return(
		<div>
			<div  className="Navbar">
				<div className="App_header">
					<h1>
						Magic Maze
					</h1>
					<div>
						A game created by CSCI3100 Project Group E3
					</div>
				</div>
				<div className="User_header">
				{user ?
					<div>	
						<h2>Your id: {user.id}</h2>
						<LogOut setUser={setUser} />
					</div>
				:
					<LoginForm setUser={setUser} />
				}
				</div>
			</div>
			<hr />
		</div>
	)
}

export {Navbar};