import React, { useState } from 'react';
import axios from './Axios';
import { makeStyles } from '@material-ui/core/styles';
import Modal from '@material-ui/core/Modal';
import { Button } from '@material-ui/core';
import alertify from 'alertifyjs';
import './Leaderboard.css';
import 'alertifyjs/build/css/alertify.css';
import './Alert.css'

//These are the styling for the pop up windows.
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

//LeaderboardButton is a functional component.
//It returns a button that will open a leaderboard on a small window.
function LeaderboardButton({ userID, username }) {
	const classes = useStyles();
	const [modalStyle] = useState(getModalStyle);
	const [show, setShow] = useState(false);
	const [score, setScore] = useState(0);
	const [myRank, setMyRank] = useState(0);
	const [rank, setRank] = useState([]);

	const showLeaderboard = async () => {
		try {
			//Find the user's score from the database.
			await axios.post("/findAccount", {
				_id: userID,
			}).then(res => {
				setScore(res.data[0].score);
			});
			//Find the user's own rank from the database.
			await axios.post("/findMyRanking", {
				_id: userID,
			}).then(res => {
				setMyRank(res.data.rank);
			});
			//Load the ranks of top players from the database and show the window.
			await axios.post("/findRanking").then(res => {
				setRank(res.data.map(data => ({
					id: data._id,
					name: data.name,
					score: data.score
				})));
				setShow(true);
			});
		} catch (error) {
			alertify.error('Connection Error');
		}
	}
	
	//The components consist of a button and a hidden modal.
	return (
		<div>
			<Button onClick={showLeaderboard}>
				Leaderboard
			</Button>
			<Modal
				open={show}
				onClose={() => setShow(false)}
			>
				<div style={modalStyle} className={classes.paper}>
					<div className="form">
						<h1>Top 100 players</h1>
						<div className="leaderboard fixed">
							<div className="leader">
								<div className="leaderRank">Rank</div>
								<div className="leaderName">Player</div>
								<div className="leaderScore">Score</div>
							</div>
						</div>
						<div className="leaderboard">
							{
								rank.map(({id, name, score}, index) => (
									<div className={`leader ${index<3 && "top"} ${id===userID && "self"}`}>
										<div className="leaderRank">{index+1}</div>
										<div className="leaderName">{name}</div>
										<div className="leaderScore">{score}</div>
									</div>
								))
							}
						</div>
						<div className="leaderboard fixed ownRank">
							<div className="leader self">
								<div className="leaderRank">{myRank}</div>
								<div className="leaderName">{username}</div>
								<div className="leaderScore">{score}</div>
							</div>
						</div>
						<div className="formFooter">
							<Button onClick={() => setShow(false)}>Back</Button>
						</div>
					</div>
				</div>
			</Modal>
		</div>
	);
}

export {LeaderboardButton};