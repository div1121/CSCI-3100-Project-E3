import React from "react";
import * as Realm from "realm-web";

const REALM_APP_ID = "application-0-exwhb";
const app = new Realm.App({ id: REALM_APP_ID });

function LoginAsGuest({ setUser }) {
	const loginAsGuest = async () => {
		try {
			const user = await app.logIn(Realm.Credentials.anonymous());
			setUser(user);
		} catch (error) {
			alert("Failed to connect");
		}
	};
	return <a onClick={loginAsGuest}>login as guest</a>;
}

function Register({ email, password}) {
	const register = async () => {
		try {
			await app.emailPasswordAuth.registerUser(email, password);
			alert("A confirmation mail has been sent to the mailbox.")
		} catch (error) {
			alert("Invalid email or password");
		}
	};
	return <button onClick={register}>Register</button>;
}

function LoginWithEmail({ setUser, email, password}) {
	const loginWithEmail = async () => {
		try {
			const user = await app.logIn(Realm.Credentials.emailPassword(email, password));
			setUser(user);
		} catch (error) {
			alert("Invalid email or password");
		}
	};
	return <button onClick={loginWithEmail}>Login</button>;
}

function LogOut({ setUser }) {
	const logout = async () => {
		try {
			await app.currentUser.logOut();
			setUser(null);
		} catch (error) {
			alert("Failed to connect");
		}
	};
	return <button onClick={logout}>Log out</button>;
}

function LoginForm({ setUser }) {
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

	return (
		<div>
		{mode === "signIn" ? (
			<div className="login_form">
				<input
					type = "email"
					placeholder = "email"
					value = {email}
					onChange = {(e) => setEmail(e.target.value)}
					className="form_input"
				/>
				<input
					type = "password"
					placeholder = "password"
					value = {password}
					onChange = {(e) => setPassword(e.target.value)}
					className="form_input"
				/>
				<LoginWithEmail setUser={setUser} email={email} password={password}/>
			</div>
		) : (
			<div className="login_form">
				<input
					type = "username"
					placeholder = "username"
					value = {username}
					onChange = {(e) => setUsername(e.target.value)}
					className="form_input"
				/>
				<input
					type = "email"
					placeholder = "email"
					value = {email}
					onChange = {(e) => setEmail(e.target.value)}
					className="form_input"
				/>
				<input
					type = "password"
					placeholder = "password"
					value = {password}
					onChange = {(e) => setPassword(e.target.value)}
					className="form_input"
				/>
				<Register email={email} password={password}/>
			</div>
		)}
			<div>
				<span>You may also </span>
				<a onClick={() => {toggleMode();}}>
					{mode === "signIn" ? "register a new account" : "go to login"}
				</a>
				<span> or </span>
				<LoginAsGuest setUser={setUser}/>
			</div>
		</div>
	);
}

export {LoginAsGuest, Register, LoginWithEmail, LogOut, LoginForm};