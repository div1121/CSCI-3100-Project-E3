import { LogoutButton, LoginButton } from './Login';
import { ProfileButton } from './Profile';
import { LeaderboardButton } from './Leaderboard';
import './Navbar.css';

//TopNavbar is a functional component.
//It returns a navigation bar to facilitate users to carry out some basic operations anytime.
function TopNavbar({ setMode, userID, username, setUserID, setUsername }) {
	return(
		<div className="topNavbar">
			<div className="topNavbarLeft">
				<a href="https://github.com/luyou00001/CSCI-3100-Project-E3	"><h1>Magic Maze</h1></a>
				<span>• By CSCI3100 Project Group E3</span>
			</div>
			{userID===null?
				<div className="topNavbarRight">
					<LoginButton setUserID={setUserID} setUsername={setUsername}/>
				</div>
			:(
				<div className="topNavbarRight">
					<h3>Welcome {username} !</h3>
					<LeaderboardButton userID={userID} username={username}/>
					<ProfileButton userID={userID} username={username} setUsername={setUsername}/>
					<LogoutButton setUserID={setUserID} setUsername={setUsername}/>
				</div>
			)}
		</div>
	)
}

export {TopNavbar};