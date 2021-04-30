# CSCI-3100-Project-E3 Magic Maze (Last Update: 30-4-2021)

## Introduction

**Magic Maze v1.0**

For CUHK CSCI3100 Project Group E3 (2021 Spring)  
Developers: Kenny CHAN, Knife NG, Benny CHENG, Jason CHU, Sun CHOI  
You may view our game website on: https://luyou00001.github.io/CSCI-3100-Project-E3/  

Magic Maze is a real-time fast-paced competitive maze game running on a map in rectangular board form. Players can compete with each other by teleporting to the destination in the fastest way on the map. The map contains multiple routes for users to explore and find the fastest way to the end requires memories and fortune.

We have "Matching" and "Custom Room" function for multi-player game mode. You can play with other players after logging in. We also provide a "Demo" function for standalone game mode. You can take it as a tutorial and get familiar with the game flow.

## Backend

Start the server by:

npm run build or node server.js

Using socket.io + node.js + express + mongodb + mongoose as the support of the backend.

### Game
* socket(move): for movement in game
* socket(entrances): set entrace set for one game to all players in the same game
* app.post(updateScores): update the score of a user on database

### Game Room
* app.get(roommember): user fetch the existing room member information in the room
* socket(startgame): start the game
* socket(leaveroom): user leave the room
* socket(readychange): user change its ready state

### Matching
* socket(ranking): user match the room
* socket(cancelrank): cancel the matching

### Chat Room
* app.get(messages): user fetch previous chat history information
* sokcet(messages): user send message

### Room List
* app.get(room): user fetch the existing room information
* socket(joinroom): user join an existing room
* socket(createroom): user create a new room

### Profile
* app.post('/updateAccount'): update the password of a user on database
* app.post('/findAccount'): find the name and score of a user from database

### Login System
* app.post('/createAccount'): create a new user on databsae

### Leader Board
* app.post('/findRanking'): the name and score of all users from the database sorted by score in descending order
* app.post('/findMyRanking'): retrieve the rank of all users from the database and count the rank of a specific user by the user id

### User interface
* Our webpage uses the Bootstrap library to design the user interface.
* From v1.0, GUI is added.

## Changelog

### v1.0 (30-4-2021)
* Significant improvement of UI
* Improve and stabilize the server and many functions
* Fix lots of bugs

### v0.2 (19-3-2021)
* Finished basic UI
* Finished basic login system: users can login as guest or login with their email after registration (testing version)
* Finished demo version of game (standalone version with table as game board only)
* Finished basic game room setting
* Developing chat room and further network functions

### v0.1 (17-3-2021)
* First attempt
