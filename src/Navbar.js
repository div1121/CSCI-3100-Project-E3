import { LogoutButton, LoginButton } from './Login';
import { ProfileButton } from './Profile';

function TopNavbar({ userID, username, setUserID, setUsername }) {
	return(
		<div>
			<a href="https://github.com/luyou00001/CSCI-3100-Project-E3	">Magic Maze</a>
			<span>• A game created by CSCI3100 Project Group E3</span>
			{userID===null?
				<LoginButton setUserID={setUserID} setUsername={setUsername}/>
			:(
				<>
					<span>Welcome {username}</span>
					<ProfileButton userID={userID} username={username} setUsername={setUsername}/>
					<LogoutButton setUserID={setUserID} setUsername={setUsername}/>
				</>
			)}
		</div>
	)
}

export {TopNavbar};