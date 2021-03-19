# Game Room Implementation

## Main Member function

Frontend(Partial):

1. Display the game room view: render() (Draft: unfinished)
	It should contain a title of game room, list of players and ready buttons

2. Player can interact with buttons addready(),minusready(): (Draft: unfinished)
	click "ready" to be ready
	click "cancel" to cancel its ready state
	Number of ready are recoreded
	Once the number of ready is enough, the game can start (requires game module)
	
3. Chatroom between players: (unfinished)
	Player can chat with each other inside the room (requires chatroom module)
	
Bonus(unfinished):

1. Invited button:
	invite other player to join the room

Backend(unfinished):

1. Create the game room:
	The information of game room is inserted into the database, such as id, member, password and name
	
2. Access the game room:
	Once the player enter the room, the member of the room should be updated (frontend update)
	
3. Leave the game room:
	Once the player leave the room, the member of the room should be updated (frontend update)
	
4. Delete the game room:
	Once the game started, the game room will be destroyed
