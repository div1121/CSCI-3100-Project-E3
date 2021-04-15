import express from 'express';
import mongoose from 'mongoose';
import { createServer } from 'http';
import { Server, Socket } from "socket.io";
import Cors from 'cors';
import nodemailer from 'nodemailer';

const app = express();
const port = process.env.PORT || 9000;
const http = createServer(app);
const io = new Server(http, {
    cors: {
        origin: '*',	
    }
});

const Schema = mongoose.Schema;

app.use(express.json());
app.use(Cors());

const User = mongoose.model('userinfo', new Schema({	
	name: String,	
	email: String,	
	password: String,	
    score: Number	
}));

const Room = mongoose.model('Room',new Schema({
    roomname: String,
    numofusers: Number
}));

const RoomMember = mongoose.model('RoomMember',new Schema({
    roomid: String,
    userid : String,
    name: String,
    socketID : String,
    ready: Boolean
}));

const Message = mongoose.model('Message',new Schema({
    roomid: String,
    userid : String,
    name: String,
    message : String
}));

const dbUrl = 'mongodb+srv://csci3100e3:magicmaze@cluster0.ablzq.mongodb.net/userdb?retryWrites=true&w=majority';

mongoose.connect(dbUrl,{
	useCreateIndex: true,
	useNewUrlParser: true,
	userUnifiedTopology: true
});

app.get('/', (req,res) => {
    res.send('App Works !!!!');
});

const db = mongoose.connection;

const transporter = nodemailer.createTransport({
	service: 'gmail',
	auth: {
		user: 'csci3100magicmaze@gmail.com',
		pass: 'magicmazecsci3100'
	}
});

app.post('/forgetPassword', (req, res) => {
	const dbUser = req.body;
	User.find(dbUser, {"email" : 1}, (err, data) => {
		if (err) {
			res.status(500).send(err);
		} else {
			res.status(200).send(data);
			console.log(data[0]);
			const mailOptions = {
				from: 'csci3100magicmaze@gmail.com',
				to: data[0].email,
				subject: 'Sending Email using Node.js',
				text: 'That was easy!'
			};
			transporter.sendMail(mailOptions, (error, info) => {
				if (error) {
					console.log(error);
				} else {
					console.log('Email sent: ' + info.response);
				}
			});
		}
	})
})

app.post('/findAccount', (req, res) => {
	const dbUser = req.body;
	
	User.find(dbUser, {"_id" : 1, "name" : 1, "score" : 1}, (err, data) => {
		if (err) {
			res.status(500).send(err);
		} else {
			res.status(200).send(data);
		}
	})
})

app.post('/createAccount', (req, res) => {
	const dbUser = req.body;
	
	User.create(dbUser, (err, data) => {
		if (err) {
			res.status(500).send(err);
		} else {
			res.status(201).send(data);
		}
	})
})

app.post('/updateAccount', (req, res) => {
	const id = req.body._id;
	const password = req.body.password;
	
	User.update({ "_id": id }, { "password": password }, {}, (err, data) => {
		if (err) {
			res.status(500).send(err);
		} else {
			res.status(201).send(data);
		}
	})
})

app.post('/updateScore', (req, res) => {
	const id = req.body._id;
	const password = req.body.score;
	
	User.update({ "_id": id }, { "score": score }, {}, (err, data) => {
		if (err) {
			res.status(500).send(err);
		} else {
			res.status(201).send(data);
		}
	})
})

app.get('/messages', (req, res) => {
    const id = req.query.roomid;
    //console.log(id);
    Message.find({"roomid": id}, (err, messages) => {
		res.status(200).send(messages);
        //console.log(messages);
		/*if (err) {
			res.status(500).send(err);
		} else {
			res.status(200).send(messages);
		}*/
    });
});

app.get('/roommember', (req, res) => {
    const id = req.query.roomid;
    //console.log(name);
    RoomMember.find({"roomid": id}, (err, messages) => {
        //console.log(messages);
        res.send(messages);
    });
});

app.get('/room', (req, res) => {
    Room.find({}, (err, messages) => {
        res.send(messages);
    });
});

var globalplayer = [];
		
io.on('connection', (socket) =>{
    // data -> roomname / userid / user name (name)
    console.log('a user is connected')
    socket.on('createroom',async (data) => {
        console.log('create room')

        const rom = {roomname: data.roomname, numofusers: 1};
        const room = new Room(rom);
        let obj = await room.save();

        const id = obj._id.toString();
        const memberdata = {roomid: id, userid: data.userid, name:data.name, socketID: socket.id, ready: false};
        const roommember = new RoomMember(memberdata);
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
        const id = mongoose.Types.ObjectId(data.roomid);
        //console.log(typeof id);
        //console.log(id);
        let doc = await Room.findOneAndUpdate({_id: id, roomname:data.roomname},{$inc : {'numofusers' : 1}},{new: true});
        //console.log(doc);
        if (doc.numofusers>4) {
            doc = await Room.findOneAndUpdate({_id: id,roomname:data.roomname},{$inc : {'numofusers' : -1}},{new: true});
            socket.emit('failjoin',{roomname: data.roomname});
        }
        else {
            const rdata = {roomid: data.roomid, userid: data.userid, name:data.name, socketID: socket.id, ready: false};
            const roommember = new RoomMember(rdata);
            let obj = await roommember.save();

            io.emit('addroomlist', doc);
            socket.join(data.roomid);
            socket.broadcast.to(data.roomid).emit('addroommember', {roomid:data.roomid, userid: data.userid, name: data.name});
            socket.emit('getroominfo',{roomid:id, roomname:data.roomname});
        }
    });

    socket.on('messages',async (data)=>{
        //roomid, userid, name, message
        const message = new Message(data);
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
        var info = {userid:data.userid,name:data.name,usersocket:socket,socketid:socket.id};
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
                var s = temp[i].usersocket;
                s.join(id);
            }
            io.to(id).emit('getroominfo',{roomid:id, roomname:"Ranking"});
            io.emit('createroom',obj);
        }
    });
	
    socket.on("leaveroom", async (data) => {
        // data -> roomid, roomname / userid / user name (name)
        await RoomMember.deleteOne({roomid:data.roomid, userid:data.userid});
        const id = mongoose.Types.ObjectId(data.roomid);
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
        const isMatch = (element) => element.socketid === socket.id;
        var match = globalplayer.findIndex(isMatch);
        if (match!==-1)
            globalplayer.splice(globalplayer.findIndex(isMatch),1);
        let data = await RoomMember.findOne({socketID:socket.id});
        if (data) {
            await RoomMember.deleteOne({roomid:data.roomid, userid:data.userid});
            const id = mongoose.Types.ObjectId(data.roomid);
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

    socket.on("cancelrank",(data)=>{
        const isMatch = (element) => element.userid === data.userid;
        var match = globalplayer.findIndex(isMatch);
        if (match!==-1)
            globalplayer.splice(globalplayer.findIndex(isMatch),1);
        console.log(globalplayer);
    });

    socket.on('move', (data)=>{
        socket.broadcast.to(data.roomid).emit('move',data);
	});
    socket.on('startgame', async (data) => {
        io.to(data.roomid).emit('startgame');
    });

	socket.on('entrances', (data) => {

		const id = data.roomid;
		
		let randomEntrances=[], boardHeight=data.boardHeight, boardWidth=data.boardWidth,randomValues;
		for (let i = 0; i < boardHeight; i++) {
			for (let j = 0; j < boardWidth; j++) {
				randomEntrances.push([])
				let entranceDifferences = [[1, -1], [1, 0], [0, 1], [-1, 1]]
				let temp = 4
				while (temp > 0) {
					randomValues = Math.floor(Math.random() * temp)
					let targetWidth = j + entranceDifferences[randomValues][0]
					let targetHeight = i + entranceDifferences[randomValues][1]
					if (targetWidth < 0 || targetWidth >= boardHeight || targetHeight < 0 || targetHeight >= boardHeight) {
						randomEntrances[j + i * boardWidth].push([])
						randomEntrances[j + i * boardWidth][4 - temp].push(j)
						randomEntrances[j + i * boardWidth][4 - temp].push(i)
					}
					else {
						randomEntrances[j + i * boardWidth].push([])
						randomEntrances[j + i * boardWidth][4 - temp].push(targetWidth)
						randomEntrances[j + i * boardWidth][4 - temp].push(targetHeight)
					}
					temp--
					entranceDifferences.splice(randomValues, 1)
				}
			}
		}
		io.to(data.roomid).emit('entrances',randomEntrances);
	});
});

http.listen(port, ()=>console.log(`Listening on: ${port}`));