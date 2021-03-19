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

var Message = mongoose.model('Message',new Schema({
    name : String,
    message : String
}));

var dbUrl = 'mongodb+srv://div1121:chuchunto1121@cluster0.gpxvi.mongodb.net/myFirstDatabase?retryWrites=true&w=majority';

app.get('/', (req,res) => {
    res.send('App Works !!!!');
});

app.get('/messages', (req, res) => {
    Message.find({},(err, messages)=> {
        res.send(messages);
    })
});


app.get('/messages/:user', (req, res) => {
    var user = req.params.user
    Message.find({name: user},(err, messages)=> {
        res.send(messages);
    })
});


app.post('/messages', async (req, res) => {
    try{
        console.log(req.body);
        var message = new Message(req.body);
        console.log(message)
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

io.on('connection', () =>{
    console.log('a user is connected')
});

mongoose.connect(dbUrl,(err) => {
    console.log('mongodb connected',err);
});

var server = http.listen(8000, () => {
    console.log('server is running on port', server.address().port);
});