import { LogoutButton, LoginButton } from './Login';
import { ProfileButton } from './Profile';

function TopNavbar({ userID, username, setUserID, setUsername }) {
	return(
		<div className="topNavbar">
			<div className="topNavbarLeft">
				<a href="https://github.com/luyou00001/CSCI-3100-Project-E3	"><h1>Magic Maze</h1></a>
				<span>• A game created by CSCI3100 Project Group E3</span>
			</div>
			{userID===null?
				<div className="topNavbarRight">
					<LoginButton setUserID={setUserID} setUsername={setUsername}/>
				</div>
			:(
				<div className="topNavbarRight">
					<h3>Welcome {username}</h3>
					<ProfileButton userID={userID} username={username} setUsername={setUsername}/>
					<LogoutButton setUserID={setUserID} setUsername={setUsername}/>
				</div>
			)}
		</div>
	)
}

export {TopNavbar};