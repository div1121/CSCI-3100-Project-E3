import React from 'react';
import { Button, Modal } from 'react-bootstrap';
import axios from './Axios';
import validator from 'validator';

function ShowProfile({ userID, username }) {
	const [show, setShow] = React.useState(true);
	
	const handleClose = () => setShow(false);
	const handleShow = () => setShow(true);

	return (
		<div>
			<Button size="lg" variant='secondary' onClick={handleShow}>
				Profile
			</Button>
			<Modal show={show} onHide={handleClose}>
				<Modal.Header closeButton>
					<Modal.Title>Player profile</Modal.Title>
				</Modal.Header>
				<Modal.Body>
					<div>Name: {username}</div>
				</Modal.Body>
			</Modal>
		</div>
	);
}

function ChangePasswordConfirm({ userID, password, newPassword, reNewPassword, setShow }) {
	const changePassword = async (e) => {
		var canUpdate = false;
		e.preventDefault();
		try {
			await axios.post("/loginAccount", {
				_id: userID,
				password: password,
			}).then(res => {
				if(res.data.length==0){
					alert('Password is wrong');
				}else if(newPassword.length==0) {
					alert("New password is empty!");
				}else if(newPassword.length<8) {
					alert("New password should contain at least 8 letters!");
				}else if(newPassword!=reNewPassword){
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
					if(res.data.ok==1){
						alert('Password is updated');
					}
					setShow(false);
				});
			}
		} catch (error) {
			alert('Internal Error');
		}
	};
	return <Button variant="primary" onClick={changePassword}>Confirm</Button>;
}

function ChangePasswordButton({ userID }) {
	const [show, setShow] = React.useState(false);
	const [password, setPassword] = React.useState("");
	const [newPassword, setNewPassword] = React.useState("");
	const [reNewPassword, setReNewPassword] = React.useState("");
	
	const handleClose = () => setShow(false);
	const handleShow = () => setShow(true);

	React.useEffect(() => {
		setPassword('');
		setNewPassword('');
		setReNewPassword('');
	}, [show]);
	
	return (
		<div>
			<Button size="md" variant='secondary' onClick={handleShow}>
				Change password
			</Button>
			<Modal show={show} onHide={handleClose}>
				<Modal.Header closeButton>
					<Modal.Title>Change password</Modal.Title>
				</Modal.Header>
				<Modal.Body>
					<form>
						<div>
							<input
								type = 'password'
								value = {password}
								placeholder = 'Current password'
								onChange = {(e) => setPassword(e.target.value)}
								className = 'form_input'
							/>
						</div>
						<div>
							<input
								type = 'password'
								value = {newPassword}
								placeholder = 'New password'
								onChange = {(e) => setNewPassword(e.target.value)}
								className = 'form_input'
							/>
						</div>
						<div>
							<input
								type = 'password'
								value = {reNewPassword}
								placeholder = 'Re-enter new password'
								onChange = {(e) => setReNewPassword(e.target.value)}
								className='form_input'
							/>
						</div>
					</form>
				</Modal.Body>
				<Modal.Footer>
					<ChangePasswordConfirm userID={userID} password={password} newPassword={newPassword} reNewPassword={reNewPassword} setShow={setShow}/>
				</Modal.Footer>
			</Modal>
		</div>
	);
}

function ProfileButton({ userID, username, setUsername }) {
	const [show, setShow] = React.useState(false);
	
	const handleClose = () => setShow(false);
	const handleShow = () => setShow(true);

	return (
		<div>
			<Button size="lg" variant='secondary' onClick={handleShow}>
				Profile
			</Button>
			<Modal show={show} onHide={handleClose}>
				<Modal.Header closeButton>
					<Modal.Title>Player profile</Modal.Title>
				</Modal.Header>
				<Modal.Body>
					<div>Name: {username}</div>
					<div>Symbol: #</div>
					<div>Game record: </div>
				</Modal.Body>
				<Modal.Footer>
					<ChangePasswordButton userID={userID} />
					<Button variant="primary">Save changes</Button>
				</Modal.Footer>
			</Modal>
		</div>
	);
}

export {ProfileButton};