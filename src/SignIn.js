import React from "react";
import * as Realm from "realm-web";

const RealmAppContext = React.createContext();

const REALM_APP_ID = "application-0-exwhb"; // e.g. myapp-abcde
const app = new Realm.App({ id: REALM_APP_ID });

function SignIn() {
	const [mode, setMode]  = React.useState("signIn");
	const toggleMode = () => {
		setMode((oldMode) => (oldMode === "signIn" ? "signUp" : "signIn"));
	};
	
	const [username, setUsername] = React.useState("");
	const [email, setEmail] = React.useState("");
	const [password, setPassword] = React.useState("");
	
	React.useEffect(() => {
		setUsername("");
		setEmail("");
		setPassword("");
	}, [mode]);

	const signIn = async () => {
		try {
			await app.logIn(Realm.Credentials.emailPassword(email, password));
		} catch (error) {
			alert(error.message)
		}
	};
	
	const signUp = async () => {
		try {
			await app.emailPasswordAuth.registerUser(email, password);
		} catch (error) {
			alert(error.message)
		}
	};

	return (
		<div>
		{mode === "signIn" ? (
			<form className="signInForm">
				<input
					type = "text"
					placeholder = "email"
					value = {email}
					onChange = {(e) => setEmail(e.target.value)}
				/>
				<input
					type = "password"
					placeholder = "password"
					value = {password}
					onChange = {(e) => setPassword(e.target.value)}
				/>
				<button type="submit" onClick={signIn}>Sign In</button>
			</form>
		) : (
			<form className="signUpForm">
				<input
					type = "username"
					placeholder = "username"
					value = {username}
					onChange = {(e) => setUsername(e.target.value)}
				/>
				<input
					type = "text"
					placeholder = "email"
					value = {email}
					onChange = {(e) => setEmail(e.target.value)}
				/>
				<input
					type = "password"
					placeholder = "password"
					value = {password}
					onChange = {(e) => setPassword(e.target.value)}
				/>
				<button type="submit" onClick={signUp}>Sign up</button>
			</form>
		)}
			<button onClick={(e) => {toggleMode();}}>
				{mode === "signIn" ? "Go to sign up" : "Go to sign in"}
			</button>
		</div>
	);
}

export default SignIn;