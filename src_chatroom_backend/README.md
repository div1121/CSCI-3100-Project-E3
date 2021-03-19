# Chat Room Implementation

## Main Member function

Frontend(Partial):

Chat Room:
One chat room only

1. Display the chatroom: render() (Draft: unfinished)
	It should contain a title of chat room, list of message with name and input box with submit

2. Player can type on and submit the text: handleChange(),handleSubmit() (Draft: unfinished)
	Once the user type, the text will be saved
	Once the user submit, the text will send to database for insert a new message record
	The display will rerender for the new submit
	
Backend(Partial):

1. POST the user input text
	The user name and the message will save in the database(
	
2. GET the chatroom message
	Send all the message saved in database
	