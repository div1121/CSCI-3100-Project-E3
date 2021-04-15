import React, { useState } from 'react';
import axios from './Axios';
import { makeStyles } from '@material-ui/core/styles';
import Modal from '@material-ui/core/Modal';
import { Button } from '@material-ui/core';

function getModalStyle() {
	const top = 50;
	const left = 50;

	return {
		top: `${top}%`,
		left: `${left}%`,
		transform: `translate(-${top}%, -${left}%)`,
	};
}

const useStyles = makeStyles((theme) => ({
	paper: {
		position: 'absolute',
		width: 400,
		backgroundColor: theme.palette.background.paper,
		padding: theme.spacing(2, 4, 3),
	},
}));

function ChangePasswordConfirm({ userID, password, newPassword, reNewPassword, setShow }) {
	const changePassword = async (e) => {
		var canUpdate = false;
		e.preventDefault();
		try {
			await axios.post("/loginAccount", {
				_id: userID,
				password: password,
			}).then(res => {
				if(res.data.length===0){
					alert('Password is wrong');
				}else if(newPassword.length===0) {
					alert("New password is empty!");
				}else if(newPassword.length<8) {
					alert("New password should contain at least 8 letters!");
				}else if(newPassword!==reNewPassword){
					alert("Re-entered new password is not same to new password!");
				}else {
					canUpdate = true;
				}
			});
			if(canUpdate) {
				await axios.post("/updateAccount", {
					_id: userID,
					password: newPassword,
				}).then(res => {
					if(res.data.ok===1){
						alert('Password is updated');
					}
					setShow(false);
				});
			}
		} catch (error) {
			alert('Internal Error');
		}
	};
	return <Button variant="contained" onClick={changePassword}>Confirm</Button>;
}

function ChangePasswordButton({ userID }) {
	const classes = useStyles();
	const [modalStyle] = useState(getModalStyle);
	const [show, setShow] = useState(false);
	const [password, setPassword] = useState("");
	const [newPassword, setNewPassword] = useState("");
	const [reNewPassword, setReNewPassword] = useState("");

	React.useEffect(() => {
		setPassword('');
		setNewPassword('');
		setReNewPassword('');
	}, [show]);
	
	return (
		<div>
			<Button variant="contained" color="secondary" onClick={() => setShow(true)}>
				Change password
			</Button>
			<Modal
				open={show}
				onClose={() => setShow(false)}
			>
				<div style={modalStyle} className={classes.paper}>
					<div className="form">
						<h1>Change Password</h1>
						<input
							type = 'password'
							value = {password}
							placeholder = 'Current password'
							onChange = {(e) => setPassword(e.target.value)}
							className = 'formInput'
						/>
						<input
							type = 'password'
							value = {newPassword}
							placeholder = 'New password'
							onChange = {(e) => setNewPassword(e.target.value)}
							className = 'formInput'
						/>
						<input
							type = 'password'
							value = {reNewPassword}
							placeholder = 'Re-enter new password'
							onChange = {(e) => setReNewPassword(e.target.value)}
							className='formInput'
						/>
						<div className="formFooter">
							<ChangePasswordConfirm userID={userID} password={password} newPassword={newPassword} reNewPassword={reNewPassword} setShow={setShow}/>
							<Button variant="contained" onClick={() => setShow(false)}>Cancel</Button>
						</div>
					</div>
				</div>
			</Modal>
		</div>
	);
}

function ProfileButton({ userID, username, setUsername }) {
	const classes = useStyles();
	const [modalStyle] = useState(getModalStyle);
	const [show, setShow] = useState(false);
	const [score, setScore] = useState(1000);

	const showProfile = async () => {
		try {
			await axios.post("/loginAccount", {
				_id: userID,
			}).then(res => {
				setScore(res.data[0].score);
			});
			setShow(false);
		} catch (error) {
			alert('Connection Error');
		}
	}
	
	return (
		<div>
			<Button variant="contained" onClick={() => setShow(true)}>
				Profile
			</Button>
			<Modal
				open={show}
				onClose={() => setShow(false)}
			>
				<div style={modalStyle} className={classes.paper}>
					<div className="form">
						<h1>Player profile</h1>
						<h3>Name: {username}</h3>
						<h3>Score: {score}</h3>
						<div className="formFooter">
							<ChangePasswordButton userID={userID} />
							<Button variant="primary" onClick={showProfile}>Back</Button>
						</div>
					</div>
				</div>
			</Modal>
		</div>
	);
}

export {ProfileButton};