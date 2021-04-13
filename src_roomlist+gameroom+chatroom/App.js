import React, { useState } from 'react';
import GameRoom from "./Gameroom";
import SendChat from "./chatroom";
import RoomList from "./Roomlist";

function App(){
	const [userID, setUserID] = React.useState("123456");
	const [username, setUsername] = React.useState("Alice");
	const [gameroomenter, setGameroomenter] = React.useState(null);
	const [gameroomid, setGameroomid] = React.useState(null);
	return (
			<div className="App">
			<button onClick={()=>{setUsername("Peter");setUserID("654321")}}>Boy</button>
				<button onClick={()=>{setUsername("Pe");setUserID("64321")}}>Boy1</button>
				<button onClick={()=>{setUsername("Pet");setUserID("54321")}}>Boy2</button>
			{
				gameroomenter==null && gameroomid==null &&
				<RoomList user_id={userID} user_name={username} setGameroomenter={setGameroomenter} setGameroomid={setGameroomid}/>
			}
			{
				gameroomenter!=null && gameroomid!=null  &&
				<div>
					<GameRoom roomid={gameroomid} roomname={gameroomenter} playername={username} playerid={userID} setGameroomenter={setGameroomenter} setGameroomid={setGameroomid}/>
					<SendChat roomid={gameroomid} userid={userID} name={username} />
				</div>
			}
		</div>
	)
}

export default App;