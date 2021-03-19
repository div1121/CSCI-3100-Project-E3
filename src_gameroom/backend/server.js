var express = require('express');
var bodyParser = require('body-parser')
var app = express();

var http = require('http').Server(app);
var io = require('socket.io')(http);

var mongoose = require('mongoose');
var Schema = mongoose.Schema;

app.use(express.static(__dirname));
app.use(bodyParser.urlencoded({extended: true}));
app.use(bodyParser.json());


//1.  Create the game room (To be implemented)


//2.  Access the game room (To be implemented)


//3. Leave the game room (To be implemented)


//4. Delete the game room

