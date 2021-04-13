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
    roomid: String,
    userid : String,
    name: String,
    socketID : String,
    ready: Boolean
}));

var Message = mongoose.model('Message',new Schema({
    roomid: String,
    userid : String,
    name: String,
    message : String
}));

var dbUrl = 'mongodb+srv://freshuser:FocRTUAfbj8Mej6R@cluster0.gpxvi.mongodb.net/myFirstDatabase?retryWrites=true&w=majority';

var globalplayer = [];

app.get('/', (req,res) => {
    res.send('App Works !!!!');
});

app.get('/messages', (req, res) => {
    var id = req.query.roomid;
    //console.log(name);
    Message.find({roomid:id},(err, messages)=> {
        //console.log(messages);
        res.send(messages);
    });
});

app.get('/roommember', (req, res) => {
    var id = req.query.roomid;
    //console.log(name);
    RoomMember.find({roomid:id}, (err, messages) => {
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
    // data -> roomname / userid / user name (name)
    console.log('a user is connected')
    socket.on('createroom',async (data) => {
        console.log('create room')

        var rom = {roomname: data.roomname, numofusers: 1};
        var room = new Room(rom);
        let obj = await room.save();

        var id = obj._id.toString();
        var memberdata = {roomid: id, userid: data.userid, name:data.name, socketID: socket.id, ready: false};
        var roommember = new RoomMember(memberdata);
        let memobj = await roommember.save();

        io.emit('createroom',obj);
        socket.join(id);
        socket.broadcast.to(id).emit('addroommember',{roomid: id, userid: data.userid, name: data.name});
        socket.emit('getroominfo',{roomid:id, roomname:data.roomname});
    });

    socket.on('joinroom',async (data) => {
        // roomid, roomname, userid, username
        console.log('in room')
        //console.log(data.roomid);
        var id = mongoose.Types.ObjectId(data.roomid);
        //console.log(typeof id);
        //console.log(id);
        let doc = await Room.findOneAndUpdate({_id: id, roomname:data.roomname},{$inc : {'numofusers' : 1}},{new: true});
        //console.log(doc);
        if (doc.numofusers>4) {
            doc = await Room.findOneAndUpdate({_id: id,roomname:data.roomname},{$inc : {'numofusers' : -1}},{new: true});
            socket.emit('failjoin',{roomname: data.roomname});
        }
        else {
            var rdata = {roomid: data.roomid, userid: data.userid, name:data.name, socketID: socket.id, ready: false};
            var roommember = new RoomMember(rdata);
            let obj = await roommember.save();

            io.emit('addroomlist', doc);
            socket.join(data.roomid);
            socket.broadcast.to(data.roomid).emit('addroommember', {roomid:data.roomid, userid: data.userid, name: data.name});
            socket.emit('getroominfo',{roomid:id, roomname:data.roomname});
        }
    });

    socket.on('messages',async (data)=>{
        //roomid, userid, name, message
        var message = new Message(data);
        let res = await message.save();
        io.to(data.roomid).emit('message',data);
    });

    socket.on('readychange',async (data)=>{
        // roomid, userid, number , ready array, save
        // console.log(data.save);
        let doc = await RoomMember.findOneAndUpdate({roomid: data.roomid, userid:data.userid}, {ready : data.save},{new: true});
        // console.log(doc);
        io.to(data.roomid).emit('readychange',data);
    });

    socket.on('ranking', async (data)=>{
        //userid, username
        var info = {userid:data.userid,name:data.name,socketid:socket.id};
        globalplayer.push(info);
        console.log(globalplayer);
        if (globalplayer.length==4){
            var temp = globalplayer.splice(0,5);
            globalplayer = globalplayer.splice(0,4);
            var rom = {roomname: "Ranking", numofusers: 4};
            var room = new Room(rom);
            let obj = await room.save();
            var id = obj._id.toString();
            for (var i=0;i<temp.length;i++){
                var memberdata = {roomid: id, userid: temp[i].userid, name:temp[i].name, socketID: temp[i].socketid, ready: false};
                var roommember = new RoomMember(memberdata);
                let memobj = await roommember.save();
            }
            for (var i=0;i<temp.length;i++) {
                var ele = temp[i];
                var sid = ele.socketid;
                io.to(sid).emit('getroominfo',{roomid:id, roomname:"Ranking"});
            }
            io.emit('createroom',obj);
        }
    });

    socket.on("leaveroom", async (data) => {
        // data -> roomid, roomname / userid / user name (name)
        await RoomMember.deleteOne({roomid:data.roomid, userid:data.userid});
        var id = mongoose.Types.ObjectId(data.roomid);
        let doc = await Room.findOneAndUpdate({_id: id},{$inc : {'numofusers' : -1}},{new: true});
        if (!doc || doc.numofusers<=0) {
            await Room.deleteOne({_id: id});
            await Message.deleteMany({roomid:data.roomid});
            io.emit('deleteroom',doc);
        }
        else {
            socket.broadcast.to(data.roomid).emit('decreaseroommember',{roomid:data.roomid, userid: data.userid, name: data.name});
            io.emit('downroomlist',doc);
        }
        socket.leave(data.roomid);
    });
    socket.on("disconnect", async () =>{
        console.log("disconnect");
        let data = await RoomMember.findOne({socketID:socket.id});
        if (data) {
            await RoomMember.deleteOne({roomid:data.roomid, userid:data.userid});
            var id = mongoose.Types.ObjectId(data.roomid);
            let doc = await Room.findOneAndUpdate({_id: id},{$inc : {'numofusers' : -1}},{new: true});
            if (!doc || doc.numofusers<=0) {
                await Room.deleteOne({_id: id});
                await Message.deleteMany({roomid:data.roomid});
                io.emit('deleteroom',doc);
            }
            else {
                socket.broadcast.to(data.roomid).emit('decreaseroommember',{roomid:data.roomid, userid: data.userid, name: data.name});
                io.emit('downroomlist',doc);
            }
            socket.leave(data.roomid);
        }
    });

});

mongoose.connect(dbUrl,(err) => {
    console.log('mongodb connected',err);
});

var server = http.listen(8000, () => {
    console.log('server is running on port', server.address().port);
});