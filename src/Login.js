import React from "react";
import * as Realm from "realm-web";
import { Button, Modal } from 'react-bootstrap';

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
	return <a href="#" onClick={loginAsGuest}>login as guest</a>;
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
	return <Button variant="secondary" onClick={register}>Register</Button>;
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
	return <Button variant="secondary" onClick={loginWithEmail}>Login</Button>;
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
	return <Button variant="secondary" onClick={logout}>Log out</Button>;
}

function LoginForm({ setUser }) {
	const [mode, setMode]  = React.useState("Login");
	const toggleMode = () => {
		setMode((oldMode) => (oldMode === "Login" ? "Register" : "Login"));
	};
	
	const [username, setUsername] = React.useState("");
	const [email, setEmail] = React.useState("");
	const [password, setPassword] = React.useState("");
	
	function note(){
		return
	}
	
	React.useEffect(() => {
		setUsername("");
		setEmail("");
		setPassword("");
	}, [mode]);
	
	return (
		<div className="login_form">
			{mode === "Register"?
			<input
				type = "username"
				placeholder = "username"
				value = {username}
				onChange = {(e) => setUsername(e.target.value)}
				className="form_input"
			/>
			:<></>}
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
			{mode === "Login" ? <LoginWithEmail setUser={setUser} email={email} password={password} /> : <Register email={email} password={password}/>}
			<div>
				<span>You may also </span>
				<a href="#" onClick={() => {toggleMode();}}>
					{mode === "Login" ? "register a new account" : "go to login"}
				</a>
				<span> or </span>
				<LoginAsGuest setUser={setUser}/>
			</div>
		</div>
	);
}

function LoginButton({ setUser }) {
	const [show, setShow] = React.useState(false);
	
	const handleClose = () => setShow(false);
	const handleShow = () => setShow(true);

	return (
		<div>
			<Button variant="secondary" onClick={handleShow}>
				Login
			</Button>
			<Modal show={show} onHide={handleClose}>
				<Modal.Header closeButton>
					<Modal.Title>Join us!</Modal.Title>
				</Modal.Header>
				<Modal.Body>
					<LoginForm setUser={setUser} />
				</Modal.Body>
			</Modal>
		</div>
	);
}

export {LoginAsGuest, Register, LoginWithEmail, LogOut, LoginForm, LoginButton};