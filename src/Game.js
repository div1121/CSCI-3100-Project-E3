import React, {
    Component, useEffect
} from 'react';
import GameBoard from './GameBoard'
import background from "./picture/background.jfif";
import _ from 'lodash'
import KeyHandler, {KEYDOWN} from 'react-key-handler';
import ws from './service';
import axios from './Axios';
import {PATH_TO_BACKEND} from './baseURL';
const baseURL = PATH_TO_BACKEND;

class Game extends Component {

    constructor(props) {
        super(props)
        this.state = {
            gameOver: false,
            gameTime: 0,
            playerIndex: 0,
            startTime: 0,
            currentTime: 0,
            timePass: 0,
            showGameBoard: false,
            boardHeight: 0,
            boardWidth: 0,
            areaHeight: 0,
            areaWidth: 0,
            randomEntrances: [],
            playerID: [],
            playerName: [],
            preScore: [],
            playerScore: [],
            playerLevel: [],
            levelCounter: [],
            ranking: [0, 1, 2, 3],
            playerNumber: 0,
            playerFacing: [],
            playerPosition: [],
            prevPlayerPos: [],
            totalMoves: 0
        }
        this.initializeBoardPlayer = this.initializeBoardPlayer.bind(this)
        this.startGame = this.startGame.bind(this)
        this.setRanking = this.setRanking.bind(this)
        this.countTotalMoves = this.countTotalMoves.bind(this)
        this.setTime = this.setTime.bind(this)
        this.handleKeyUp = this.handleKeyUp.bind(this)
        this.handleKeyDown = this.handleKeyDown.bind(this)
        this.handleKeyRight = this.handleKeyRight.bind(this)
        this.handleKeyLeft = this.handleKeyLeft.bind(this)
        this.makeMove = this.makeMove.bind(this)
    }

    componentWillMount() {
        this.initializeBoardPlayer()
    }

    initializeBoardPlayer() {
        let gameTime = 30
        let boardWidth = 5
        let boardHeight = 5
        let areaWidth = 5
        let areaHeight = 5
        let playerIndex = -1
        let randomEntrances = []
        let playerID = []
        let playerNumber = 0
        let playerName = ["Jason", "Kenny", "Benny", "Knife"]
        let preScore = [1000, 900, 800, 700]
        let playerScore = [1000, 900, 800, 700]
        let playerFacing = []
        let playerLevel = []
        let levelCounter = []
        let startTime = 0
        let nowTime = new Date()
        startTime = nowTime.getHours() * 3600000 + nowTime.getMinutes() * 60000 + nowTime.getSeconds() * 1000 + nowTime.getMilliseconds()
        fetch(baseURL + '/roommember?' + new URLSearchParams({roomid:this.props.roomid}))
            .then(res => res.json())
            .then(res => {
                playerID = []
                playerName = []
                playerNumber = res.length
                for (let i = 0; i < res.length; i++) {
                    if (res[i].userid === this.props.userid) playerIndex = i
                    playerID.push(res[i].userid);
                    playerName.push(res[i].name);
                }
                preScore = []
                playerScore = []
				axios.post("/findAccount", {
					_id: playerID[0],
				}).then(res => {
                    preScore.push(res.data[0].score)
                    playerScore.push(res.data[0].score)
                    //alert(res[0].score)
					axios.post("/findAccount", {
						_id: playerID[1],
					}).then(res => {
						preScore.push(res.data[0].score)
						playerScore.push(res.data[0].score)
						//alert(res[0].score)
						axios.post("/findAccount", {
							_id: playerID[2],
						}).then(res => {
							preScore.push(res.data[0].score)
							playerScore.push(res.data[0].score)
							//alert(res[0].score)
							axios.post("/findAccount", {
								_id: playerID[3],
							}).then(res => {
								preScore.push(res.data[0].score)
								playerScore.push(res.data[0].score)
								//alert(res[0].score)
							});
						});
					});
				});
                if (this.state.playerIndex === 0) {
                    ws.emit('entrances', {roomid: this.props.roomid})
                }
                ws.on('entrances', (data) => {
                    randomEntrances = data
                    //alert(randomEntrances.length)
                    let playerPosition = []
                    let prevPlayerPos = []
                    for (let i = 0; i < boardWidth + boardHeight - 1; i++) levelCounter.push([])
                    for (let i = 0; i < playerNumber; i++) {
                        playerFacing.push(1)
                        playerPosition.push({x: Math.floor(areaWidth / 2), y: Math.floor(areaHeight / 2)})
                        prevPlayerPos.push({x: Math.floor(areaWidth / 2), y: Math.floor(areaHeight / 2)})
                    }
                    let level = 0
                    for (let i = 0; i < playerNumber; i++) {
                        level = Math.floor(playerPosition[i].x / areaWidth) + Math.floor(playerPosition[i].y / areaHeight)
                        playerLevel.push(level)
                        levelCounter[level].push(i)
                    }
                    this.setState({
                        gameTime: gameTime,
                        boardHeight: boardHeight,
                        boardWidth: boardWidth,
                        areaWidth: areaWidth,
                        areaHeight: areaHeight,
                        randomEntrances: randomEntrances,
                        playerIndex: playerIndex,
                        playerNumber: playerNumber,
                        playerName: playerName,
                        preScore: preScore,
                        playerID: playerID,
                        playerScore: playerScore,
                        playerFacing: playerFacing,
                        playerPosition: playerPosition,
                        prevPlayerPos: prevPlayerPos,
                        playerLevel: playerLevel,
                        levelCounter: levelCounter,
                        startTime: startTime,
                        showGameBoard: true
                    }, () => {
                        this.startGame()
                    })
                })
            })
    }

    startGame() {
        this.setRanking()
        this.setTime()
    }

    countTotalMoves() {
        this.setState({
            totalMoves: ++this.state.totalMoves
        })
    }

    setTime() {
        let {
            gameTime,
            startTime,
            currentTime,
            timePass,
            gameOver
        } = this.state
        let nowTime = new Date()
        currentTime = nowTime.getHours() * 3600000 + nowTime.getMinutes() * 60000 + nowTime.getSeconds() * 1000 + nowTime.getMilliseconds()
        timePass = Math.floor((currentTime - startTime) / 1000)
        if (timePass >= (gameTime + 5)) {
            gameOver = true
        }
        this.setState({
            currentTime: currentTime,
            timePass: timePass,
            gameOver: gameOver
        })
    }

    setRanking() {
        let {
            playerLevel,
            levelCounter,
            playerNumber,
            ranking
        } = this.state
        let maxLevel = 0, count = 0, length
        ranking = []
        let ranked = []
        for (let i = 0; i < playerNumber; i++) {
            if (playerLevel[i] > maxLevel) maxLevel = playerLevel[i]
            ranked.push(false)
        }
        for (let i = maxLevel; i >= 0; i--) {
            if (count === playerNumber) break
            length = levelCounter[i].length
            for (let j = 0; j < length; j++) {
                if (ranked[levelCounter[i][j]] === false) {
                    ranked[levelCounter[i][j]] = true
                    ranking.push(levelCounter[i][j])
                    count++
                }
            }
        }
        this.setState({
            ranking
        })
    }

    handleKeyUp(e) {
        e.preventDefault()
        let {
            gameTime,
            playerPosition,
            areaHeight,
            boardWidth,
            boardHeight,
            playerFacing,
            playerIndex,
            timePass,
            playerLevel,
            gameOver
        } = this.state
        if (playerLevel[playerIndex] < boardWidth + boardHeight - 2 && timePass <= (gameTime + 4) && timePass > 3 && gameOver === false) {
            playerFacing[playerIndex] = 0
            if (Number(playerPosition[playerIndex].y) % areaHeight - 1 >= 0) this.makeMove(playerPosition[playerIndex].x, playerPosition[playerIndex].y - 1)
        }
    }

    handleKeyDown(e) {
        e.preventDefault()
        let {
            gameTime,
            playerPosition,
            areaHeight,
            boardWidth,
            boardHeight,
            playerFacing,
            playerIndex,
            timePass,
            playerLevel,
            gameOver
        } = this.state
        if (playerLevel[playerIndex] < boardWidth + boardHeight - 2 && timePass <= (gameTime + 4) && timePass > 3 && gameOver === false) {
            playerFacing[playerIndex] = 1
            if (Number(playerPosition[playerIndex].y) % areaHeight + 1 < areaHeight) this.makeMove(playerPosition[playerIndex].x, playerPosition[playerIndex].y + 1)
        }
    }

    handleKeyRight(e) {
        e.preventDefault()
        let {
            gameTime,
            playerPosition,
            areaWidth,
            boardWidth,
            boardHeight,
            playerFacing,
            playerIndex,
            timePass,
            playerLevel,
            gameOver
        } = this.state
        if (playerLevel[playerIndex] < boardWidth + boardHeight - 2 && timePass <= (gameTime + 4) && timePass > 3 && gameOver === false) {
            playerFacing[playerIndex] = 3
            if (Number(playerPosition[playerIndex].x) % areaWidth + 1 < areaWidth) this.makeMove(playerPosition[playerIndex].x + 1, playerPosition[playerIndex].y)
        }
    }

    handleKeyLeft(e) {
        e.preventDefault()
        let {
            gameTime,
            playerPosition,
            areaWidth,
            boardWidth,
            boardHeight,
            playerFacing,
            playerIndex,
            timePass,
            playerLevel,
            gameOver
        } = this.state
        if (playerLevel[playerIndex] < boardWidth + boardHeight - 2 && timePass <= (gameTime + 4) && timePass > 3 && gameOver === false) {
            playerFacing[playerIndex] = 2
            if (Number(playerPosition[playerIndex].x) % areaWidth - 1 >= 0) this.makeMove(playerPosition[playerIndex].x - 1, playerPosition[playerIndex].y)
        }
    }

    makeMove(newX, newY) {
        let {
            gameTime,
            playerPosition,
            prevPlayerPos,
            randomEntrances,
            boardHeight,
            boardWidth,
            areaWidth,
            areaHeight,
            playerNumber,
            playerIndex,
            playerLevel,
            levelCounter,
            startTime,
            currentTime,
            timePass,
            gameOver
        } = this.state
        let prevPos = {
            x: playerPosition[playerIndex].x,
            y: playerPosition[playerIndex].y
        }
        prevPlayerPos[playerIndex] = prevPos
        let x = newX % areaWidth
        let y = newY % areaHeight
        if ((x === 0 && y === 0) || (x === areaWidth - 1 && y === 0) || (x === areaWidth - 1 && y === areaHeight - 1) || (x === 0 && y === areaHeight - 1)) {
            let temp
            if (x === 0 && y === 0) temp = 0
            else if (x === areaWidth - 1 && y === 0) temp = 1
            else if (x === areaWidth - 1 && y === areaHeight - 1) temp = 2
            else temp = 3
            let ax = Math.floor(newX / areaWidth), ay = Math.floor(newY / areaHeight)
            let tx = randomEntrances[ax + ay * boardWidth][temp][playerIndex] * areaWidth + Math.floor(areaWidth / 2)
            let ty = randomEntrances[ax + ay * boardWidth][temp][1] * areaHeight + Math.floor(areaHeight / 2)
            playerPosition[playerIndex].x = tx
            playerPosition[playerIndex].y = ty
            if (Math.floor(tx / areaWidth) === boardWidth - 1 && Math.floor(ty / areaHeight) === boardHeight - 1) {
                if (timePass > 5) startTime = currentTime - (gameTime * 1000 - 1000)
            }
        }
        else {
            playerPosition[playerIndex].x = newX
            playerPosition[playerIndex].y = newY
        }
        let level = Math.floor(playerPosition[playerIndex].x / areaWidth) + Math.floor(playerPosition[playerIndex].y / areaHeight)
        if (level > playerLevel[playerIndex]){
            playerLevel[playerIndex] = level
            levelCounter[level].push(playerIndex)
        }
        let b = true
        for (let i = 0; i < playerNumber; i++) {
            if (playerLevel[i] < 8) b = false
        }
        if (b) {
            startTime = currentTime - (gameTime * 1000 + 5000)
        }
        this.setState({
            playerPosition,
            prevPlayerPos,
            playerLevel,
            levelCounter,
            startTime,
            gameOver
        })
        let obj = {roomid: this.state.roomid, pos: this.state.playerPosition};
        ws.emit('move',obj);
        this.countTotalMoves()
        this.setRanking()
    }

    componentDidMount() {
        this.interval = setInterval(this.setTime, 10);
        ws.on('move', (data)=>{
	        let pos = this.state.playerPosition;
            pos.push(data);
            this.setState({playerPosition:pos});
        })
        /*
        fetch(baseURL+'/entrances?'+new URLSearchParams({roomid:this.props.roomid}))
            .then(res=>res.json())
            .then(res=>{
                this.setState({randomEntrances:res})
            });
         */
        if (this.state.playerIndex==0) {
            ws.emit('entrances', {roomid: this.props.roomid});
        }
        ws.on('entrances',(data)=>{
            this.setState({randomEntrances: data});
        });
    }
    
    render() {

        let {
            ranking,
            preScore,
            playerNumber,
            playerID,
            playerScore,
            playerLevel,
            boardWidth,
            boardHeight,
            gameOver
        } = this.state
		let status = playerNumber
        
        if (gameOver) {
            let finishLevel = boardWidth + boardHeight - 2
            if (playerLevel[ranking[0]] === finishLevel) {
                playerScore[ranking[0]] = preScore[ranking[0]] + 2
            }
            if (playerLevel[ranking[1]] === finishLevel) {
                playerScore[ranking[1]] = preScore[ranking[1]] + 1
            }
            else {
                playerScore[ranking[1]] = preScore[ranking[1]] - 1
            }
            if (playerLevel[ranking[2]] === finishLevel) {
                playerScore[ranking[2]] = preScore[ranking[2]] - 1
            }
            else {
                playerScore[ranking[2]] = preScore[ranking[2]] - 3
            }
            if (playerLevel[ranking[3]] === finishLevel) {
                playerScore[ranking[3]] = preScore[ranking[3]] - 2
            }
            else {
                playerScore[ranking[3]] = preScore[ranking[3]] - 4
            }
            for (let i = 0; i < playerNumber; i++) {
                fetch(baseURL + '/updateAccount?' + new URLSearchParams({
                    _id: playerID[i],
                    score: playerScore[i],
                }))
            }
        }


        return(
            <div style={{
                backgroundImage: `url(${background})`,
                height:'720px',
                color: "white"
                }}>
                <div className = "status">
                    Number of players: {status}
                </div>
                <KeyHandler
                    keyEventName = {KEYDOWN}
                    keyValue = "ArrowUp"
                    onKeyHandle = {
                        this.handleKeyUp
                    }
                />
                <KeyHandler
                    keyEventName = {KEYDOWN}
                    keyValue = "ArrowDown"
                    onKeyHandle = {
                        this.handleKeyDown
                    }
                />
                <KeyHandler
                    keyEventName = {KEYDOWN}
                    keyValue = "ArrowRight"
                    onKeyHandle = {
                        this.handleKeyRight
                    }
                />
                <KeyHandler
                    keyEventName = {KEYDOWN}
                    keyValue = "ArrowLeft"
                    onKeyHandle = {
                        this.handleKeyLeft
                    }
                />

                {
                    this.state.showGameBoard &&
                        ( <GameBoard
                            gameTime = {
                                this.state.gameTime
                            }
                            boardWidth = {
                                this.state.boardWidth
                            }
                            boardHeight = {
                                this.state.boardHeight
                            }
                            areaWidth = {
                                this.state.areaWidth
                            }
                            areaHeight = {
                                this.state.areaHeight
                            }
                            playerIndex = {
                                this.state.playerIndex
                            }
                            playerNumber = {
                                this.state.playerNumber
                            }
                            playerName = {
                                this.state.playerName
                            }
                            preScore = {
                                this.state.preScore
                            }
                            playerScore = {
                                this.state.playerScore
                            }
                            playerFacing = {
                                this.state.playerFacing
                            }
                            playerPosition = {
                                this.state.playerPosition
                            }
                            prevPlayerPos = {
                                this.state.prevPlayerPos
                            }
                            playerLevel = {
                                this.state.playerLevel
                            }
                            ranking = {
                                this.state.ranking
                            }
                            startTime = {
                                this.state.startTime
                            }
                            currentTime = {
                                this.state.currentTime
                            }
                            totalMoves = {
                                this.state.totalMoves
                            }
                            gameOver = {
                                this.state.gameOver
                            }
                            />)
                    }
            </div>
            )
        }
    }

    export default Game;