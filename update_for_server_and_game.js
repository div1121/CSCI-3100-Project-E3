// for move
//backend
socket.on('move', (data)=>{
    io.to(data.roomid).emit('move',data);
});


//frontend
import ws from './service';

//inside makeMove
let obj = {roomid: this.state.roomid, pos: this.state.playerPosition};
ws.emit('move',obj);

componentDidUpdate(prevProps, prevState) {
    if (prevState.playerPosition !== this.state.playerPosition) {
        ws.on('move', (data)=>{
            //render all players' positions
        })
    }
}



//for entrance
//backend
const Entrances = mongoose.model('Entrances',new Schema({
    roomid: String,
    randomEntrances: Array
}));

app.get('/entrances', (req, res) => {
    const id = req.query.roomid;
    
    let randomEntrances=[], boardHeight=0, boardWidth=0,randomValues;
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
    
    Entrances.create({ roomid: id, randomEntrances: randomEntrances}, function (err, user) { if (err) return handleError(err);});  
    Entrances.find({"roomid": id}, (err, messages) => {
        res.send(messages);
    });
}


//frontend
//delete startGame and setEntrances
const baseURL = "https://magic-maze-backend.herokuapp.com";

componentDidMount() {
    fetch(baseURL+'/entrances?'+new URLSearchParams({roomid:this.props.roomid}))
            .then(res=>res.json())
            .then(res=>{
                this.setState({randomEntrances:res})
            });
}



//for score
//backend
const userSchema = mongoose.Schema({
	name: String,
	email: String,
	password: String,
    score: Number
});
