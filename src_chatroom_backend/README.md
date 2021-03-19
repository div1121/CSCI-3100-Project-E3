# Chat Room Implementation

## Main Member function

Frontend(Partial):

Chat Room:
Now: one chat room only

1. Display the chatroom: render() (Draft: unfinished)
	It should contain a title of chat room, list of message with name and input box with submit

2. Player can type on and submit the text: handleChange(),handleSubmit() (Draft: unfinished)
	Once the user type, the text will be saved
	Once the user submit, the text will send to database for insert a new message record
	The display will rerender for the new submit
	(socket part is unfinished)
	
Backend(Partial):

1. POST the user input text 
	The user name and the message will save in the database (user ID, timestamp are not included)
	
2. GET the chatroom message
	Send all the information (e.g. name, message) saved in database
	
3. Create the chatroom
	The information of chatroom is saved in database, such as ID and member
	
3. Delete the chatroom
	The chatroom is deleted in the database