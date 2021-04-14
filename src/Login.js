import React from 'react';
import { Button, Modal } from 'react-bootstrap';
import axios from './Axios';
import validator from 'validator';

function Register({ setUserID, setUsername, name, email, password, rePassword }) {
	const register = async (e) => {
		e.preventDefault();
		var canRegister = false;
		if(name.length==0) {
			alert("Name is empty!");
		}else if(email.length==0) {
			alert("Email is empty!");
		}else if(validator.isEmail(email)==false) {
			alert("Email does not exist!");
		}else if(password.length==0) {
			alert("Password is empty!");
		}else if(password.length<8) {
			alert("Password should contain at least 8 letters!");
		}else if(password!=rePassword){
			alert("Re-entered password is not same to new password!");
		}else try {
			await axios.post("/loginAccount", {
				email: email,
			}).then(res => {
				if(res.data.length==0){
					canRegister = true;
				} else {
					alert("This email has been used for registration. You may register with another email or login.");
				}
			});
			if(canRegister){
				await axios.post("/createAccount", {
					name: name,
					email: email,
					password: password,
				}).then(res => {
					setUserID(res.data._id);
					setUsername(res.data.name);
					sessionStorage.setItem('userID', res.data._id);
					sessionStorage.setItem('username', res.data.name);
					alert('Register successfully');
				});
			}
		} catch (error) {
			alert('Internal error');
		}
	};
	return <Button variant='secondary' onClick={register}>Register</Button>;
}

function LoginWithEmail({ setUserID, setUsername, email, password}) {
	const loginWithEmail = async (e) => {
		e.preventDefault();
		try {
			await axios.post("/loginAccount", {
				email: email,
				password: password,
			}).then(res => {
				if(res.data.length==0){
					alert('Invalid email or password');
				} else {
					setUserID(res.data[0]._id);
					setUsername(res.data[0].name);
					sessionStorage.setItem('userID', res.data[0]._id);
					sessionStorage.setItem('username', res.data[0].name);
					alert('Login successfully');
				}
			});
		} catch (error) {
			alert('Internal Error');
		}
	};
	return <Button variant='secondary' onClick={loginWithEmail}>Login</Button>;
}

function LogoutButton({ setUserID, setUsername }) {
	const logout = async () => {
		try {
			setUserID(null);
			setUsername(null);
			sessionStorage.clear();
			alert('Logout successfully');
		} catch (error) {
			alert('Failed to connect');
		}
	};
	return <Button size="lg" variant='secondary' onClick={logout}>Log out</Button>;
}

function LoginForm({ setUserID, setUsername }) {
	const [mode, setMode]  = React.useState('Login');
	const toggleMode = () => {
		setMode((oldMode) => (oldMode === 'Login' ? 'Register' : 'Login'));
	};
	
	const [name, setName] = React.useState('');
	const [email, setEmail] = React.useState('');
	const [password, setPassword] = React.useState('');
	const [rePassword, setRePassword] = React.useState('');
	
	React.useEffect(() => {
		setName('');
		setEmail('');
		setPassword('');
		setRePassword('');
	}, [mode]);
	
	return (
		<div className='login_form'>
			{mode === 'Register'?
			<input
				type = 'name'
				placeholder = 'name'
				value = {name}
				onChange = {(e) => setName(e.target.value)}
				className='form_input'
			/>
			:<></>}
			<input
				type = 'email'
				placeholder = 'email'
				value = {email}
				onChange = {(e) => setEmail(e.target.value)}
				className='form_input'
			/>
			<input
				type = 'password'
				placeholder = 'password'
				value = {password}
				onChange = {(e) => setPassword(e.target.value)}
				className='form_input'
			/>
			{mode === 'Register'?
			<input
				type = 'password'
				placeholder = 'Re-enter password'
				value = {rePassword}
				onChange = {(e) => setRePassword(e.target.value)}
				className='form_input'
			/>
			:<></>}
			{mode === 'Login' ? 
				<LoginWithEmail
					setUserID={setUserID}
					setUsername={setUsername}
					email={email}
					password={password}
				/>
				:
				<Register
					setUserID={setUserID}
					setUsername={setUsername}
					name={name}
					email={email}
					password={password}
					rePassword={rePassword}
				/>
			}
			<div>
				<span>You may also </span>
				<a href='#' onClick={() => {toggleMode();}}>
					{mode === 'Login' ? 'register a new account' : 'go to login'}
				</a>
			</div>
		</div>
	);
}

function LoginButton({ setUserID, setUsername }) {
	const [show, setShow] = React.useState(false);
	
	const handleClose = () => setShow(false);
	const handleShow = () => setShow(true);

	return (
		<div>
			<Button size="lg" variant='secondary' onClick={handleShow}>
				Login
			</Button>
			<Modal show={show} onHide={handleClose}>
				<Modal.Header closeButton>
					<Modal.Title>Join us!</Modal.Title>
				</Modal.Header>
				<Modal.Body>
					<LoginForm setUserID={setUserID} setUsername={setUsername}/>
				</Modal.Body>
			</Modal>
		</div>
	);
}

export {Register, LoginWithEmail, LogoutButton, LoginForm, LoginButton};