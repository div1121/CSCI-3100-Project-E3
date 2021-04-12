var express = require('express');
var bodyParser = require('body-parser')
var app = express();
var http = require('http').Server(app);
var io = require('socket.io')(http, {
    cors: {
        origin: '*',
    }
});

var mongoose = require('mongoose');
var Schema = mongoose.Schema;

app.use(express.static(__dirname));
app.use(bodyParser.urlencoded({extended: true}));
app.use(bodyParser.json());

var Room = mongoose.model('Room',new Schema({
    roomname: String,
    numofusers: Number
}));

var RoomMember = mongoose.model('RoomMember',new Schema({
    roomname: String,
    name : String,
    socketID : String,
    ready : Boolean
}));

var Message = mongoose.model('Message',new Schema({
    roomname: String,
    name : String,
    message : String
}));

var dbUrl = 'mongodb+srv://freshuser:FocRTUAfbj8Mej6R@cluster0.gpxvi.mongodb.net/myFirstDatabase?retryWrites=true&w=majority';

app.get('/', (req,res) => {
    res.send('App Works !!!!');
});

app.get('/messages', (req, res) => {
    var name = req.query.roomname;
    //console.log(name);
    Message.find({roomname:name},(err, messages)=> {
        //console.log(messages);
        res.send(messages);
    });
});

app.get('/roommember', (req, res) => {
    var name = req.query.roomname;
    //console.log(name);
    RoomMember.find({roomname:name}, (err, messages) => {
        //console.log(messages);
        res.send(messages);
    });
});

app.get('/room', (req, res) => {
    Room.find({}, (err, messages) => {
        res.send(messages);
    });
});

// not used
/*
app.get('/messages', (req, res) => {
    Message.find({},(err, messages)=> {
        res.send(messages);
    });
});

// not used
app.post('/messages', async (req, res) => {
    try{
        //console.log(req.body);
        var message = new Message(req.body);
        //console.log(message)
        var savedMessage = await message.save()
        console.log('saved');

        io.emit('message', req.body);
        res.sendStatus(200);
    }
    catch (error){
        res.sendStatus(500);
        return console.log('error',error);
    }
    finally{
        console.log('Message Posted')
    }

});
*/

io.on('connection', socket =>{
    console.log('a user is connected')
    socket.on('createroom',async (data) => {
        console.log('create room')
        data = {roomname: data.roomname, numofusers: 0};
        var room = new Room(data);
        let obj = await room.save();
        //console.log(obj);
        io.emit('createroom',data);
    });

    socket.on('joinroom',async (data) => {
        console.log('in room')
        let doc = await Room.findOne({roomname:data.roomname});
        if (!doc || doc.numofusers<4) {
            let t = (doc) ? doc.numofusers : 0;
            let res = await Room.updateOne({roomname: data.roomname}, {numofusers: t + 1});
            data = {roomname: data.roomname, name: data.name, socketID: socket.id, ready: false};
            var roommember = new RoomMember(data);
            let obj = await roommember.save();
            io.emit('addroomlist',{roomname:data.roomname, numofusers: t + 1});
            socket.join(obj.roomname);
            socket.broadcast.to(data.roomname).emit('addroommember',{roomname: data.roomname, name: data.name, numofusers: t+1})
            socket.emit('roommemberOK');
            /*
            socket.emit('message', {
                name: 'Admin',
                message: obj.name + ', Welcome to ' + obj.roomname + '.'
            });
            socket.broadcast.to(obj.roomname).emit('message', {
                name: 'Admin',
                message: obj.name + 'has joined.'
            });
            */
        }
    });

    socket.on('messages',async (data)=>{
        var message = new Message(data);
        let res = await message.save();
        io.to(data.roomname).emit('message',data);
    });

    socket.on('readychange',(data)=>{
       io.to(data.roomname).emit('readychange',data);
    });

    socket.on("leaveroom", async (data) => {
        await RoomMember.deleteOne({roomname:data.roomname,name:data.name});
        let doc = await Room.findOne({roomname:data.roomname});
        if (doc.numofusers>=2) {
            await Room.updateOne({roomname: doc.roomname}, {numofusers: doc.numofusers - 1});
            socket.broadcast.to(data.roomname).emit('decreaseroommember',data);
            io.emit('downroomlist',{roomname:data.roomname, numofusers: doc.numofusers - 1});
        }
        else {
            await Room.deleteOne({roomname: doc.roomname});
            await Message.deleteMany({roomname: doc.roomname});
            io.emit('deleteroom',{roomname: doc.roomname});
        }
        socket.leave(data.roomname);
    });
    socket.on("disconnect", async () =>{
        console.log("disconnect");
        let data = await RoomMember.findOne({socketID:socket.id});
        if (data) {
            await RoomMember.deleteOne({roomname: data.roomname, name: data.name});
            let doc = await Room.findOne({roomname: data.roomname});
            if (doc.numofusers >= 2) {
                await Room.updateOne({roomname: doc.roomname}, {numofusers: doc.numofusers - 1});
                socket.broadcast.to(data.roomname).emit('decreaseroommember', data);
                io.emit('downroomlist', {roomname: data.roomname, numofusers: doc.numofusers - 1});
            } else {
                await Room.deleteOne({roomname: doc.roomname});
                await Message.deleteMany({roomname: doc.roomname});
                io.emit('deleteroom', {roomname: doc.roomname});
            }
            //socket.leave(data.roomname);
        }
    });
    
    socket.on('move',async (data)=>{
        
        
        io.to(data.roomname).emit('position',data);
    });
});

mongoose.connect(dbUrl,(err) => {
    console.log('mongodb connected',err);
});

var server = http.listen(8000, () => {
    console.log('server is running on port', server.address().port);
});
