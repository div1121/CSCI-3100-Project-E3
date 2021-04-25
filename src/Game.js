import React, {
    Component
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
			scoreUpdate: false,
            showGameBoard: false,
            gameStart: false,
            gameOver: false,
            gameTime: 0,
            playerIndex: 0,
            startTime: 0,
            currentTime: 0,
            timePass: 0,
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
            prevPlayerPos: []
        }
        this.initializeBoardPlayer = this.initializeBoardPlayer.bind(this)
        this.startGame = this.startGame.bind(this)
        this.setRanking = this.setRanking.bind(this)
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
        let playerID = []
        let playerNumber = 0
        let playerName = ["Robot_0", "Robot_1", "Robot_2", "Robot_3"]
        let preScore = [-1, -1, -1, -1]
        let playerScore = [-1, -1, -1, -1]
        let playerFacing = []
        let playerLevel = []
        let levelCounter = []
        let currentTime = 0
        fetch(baseURL + '/roommember?' + new URLSearchParams({roomid:this.props.roomid}))
            .then(res => res.json())
            .then(res => {
                playerID = []
                playerName = []
                playerNumber = res.length
                this.setState({playerNumber: playerNumber})
                for (let i = 0; i < res.length; i++) {
                    if (res[i].userid === this.props.userid) playerIndex = i
                    playerID.push(res[i].userid);
                    playerName.push(res[i].name);
                }
                
                for (let i = 0; i < playerNumber; i++) {
                    axios.post("/findAccount", {
                        _id: playerID[i],
                    }).then(res => {
                        preScore[i] = res.data[0].score
                        playerScore[i] = res.data[0].score
                        this.setState({
                            preScore: preScore,
                            playerScore: playerScore
                        })
                    })
                }
                if (playerIndex === 0) {
                    ws.emit('entrances', {roomid: this.props.roomid, boardWidth: boardWidth, boardHeight: boardHeight});
                }
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
                        playerIndex: playerIndex,
                        playerName: playerName,
                        playerID: playerID,
                        preScore: preScore,
                        playerScore: playerScore,
                        playerFacing: playerFacing,
                        playerPosition: playerPosition,
                        prevPlayerPos: prevPlayerPos,
                        playerLevel: playerLevel,
                        levelCounter: levelCounter,
                        currentTime: currentTime,
                        showGameBoard: true
                    }, () => {
                        this.startGame()
                    })
                })
    }

    startGame() {
        this.setRanking()
        this.setTime()
    }

    setTime() {
        let {
            gameStart,
            startTime,
            gameTime,
            gameOver
        } = this.state
        if (gameStart) {
            let nowTime = new Date()
            let currentTime = nowTime.getHours() * 3600000 + nowTime.getMinutes() * 60000 + nowTime.getSeconds() * 1000 + nowTime.getMilliseconds()
            if (startTime === 0) {
                startTime = currentTime
            }
            let timePass = Math.floor((currentTime - startTime) / 1000)
            if (timePass >= gameTime + 5) {
                gameOver = true
            }
            this.setState({
                currentTime: currentTime,
                startTime,
                timePass: timePass,
                gameOver: gameOver
            })
        }
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
        if (playerLevel[playerIndex] < boardWidth + boardHeight - 2 && timePass <= gameTime + 4 && timePass > 3 && gameOver === false) {
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
        if (playerLevel[playerIndex] < boardWidth + boardHeight - 2 && timePass <= gameTime + 4 && timePass > 3 && gameOver === false) {
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
        if (playerLevel[playerIndex] < boardWidth + boardHeight - 2 && timePass <= gameTime + 4 && timePass > 3 && gameOver === false) {
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
        if (playerLevel[playerIndex] < boardWidth + boardHeight - 2 && timePass <= gameTime + 4 && timePass > 3 && gameOver === false) {
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
            let tx = randomEntrances[ax + ay * boardWidth][temp][0] * areaWidth + Math.floor(areaWidth / 2)
            let ty = randomEntrances[ax + ay * boardWidth][temp][1] * areaHeight + Math.floor(areaHeight / 2)
            playerPosition[playerIndex].x = tx
            playerPosition[playerIndex].y = ty
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
        gameOver = true
        for (let i = 0; i < playerNumber; i++) {
            if (playerLevel[i] < boardHeight + boardWidth - 2) gameOver = false
            else if (timePass < gameTime - 1) startTime = currentTime - (gameTime * 1000 - 1000)
        }
        if (gameOver) startTime = currentTime - (gameTime * 1000 + 5000)
        this.setState({
            playerPosition,
            prevPlayerPos,
            playerLevel,
            levelCounter,
            startTime,
            gameOver
        })
        let obj = {roomid: this.props.roomid, facing:this.state.playerFacing[this.state.playerIndex], level:this.state.playerLevel[this.state.playerIndex], prevpos:this.state.prevPlayerPos[this.state.playerIndex], pos: this.state.playerPosition[this.state.playerIndex], playerindex: this.state.playerIndex, levelcounter: this.state.levelCounter};
        ws.emit('move', obj);
        this.setRanking()
    }

    componentDidMount() {
        ws.on('move', (data) => {
            let pos = this.state.playerPosition;
            let prevpos = this.state.prevPlayerPos;
            let level = this.state.playerLevel;
            let face = this.state.playerFacing;
            pos[data.playerindex] = data.pos;
            prevpos[data.playerindex] = data.prevpos;
            level[data.playerindex] = data.level;
            face[data.playerindex] = data.facing;
            this.setState({
                playerPosition: pos,
                prevPlayerPos: prevpos,
                playerLevel: level,
                playerFacing: face,
                levelCounter:data.levelcounter});
            let {
                gameStart,
                gameOver,
                gameTime,
                boardWidth,
                boardHeight,
                startTime,
                currentTime,
                timePass,
                playerLevel,
                playerNumber
            } = this.state
            if (gameStart) {
                gameOver = true
                for (let i = 0; i < playerNumber; i++) {
                    if (playerLevel[i] < boardHeight + boardWidth - 2) gameOver = false
                    else if (timePass < gameTime - 1) startTime = currentTime - (gameTime * 1000 - 1000)
                }
                if (gameOver) startTime = currentTime - (gameTime * 1000 + 5000)
                this.setState({
                    gameOver,
                    startTime});
            }
            this.setRanking();
        })
        ws.on('entrances',(data)=>{
            this.setState({randomEntrances: data});
        });
        this.interval = setInterval(this.setTime, 10);
    }
    
    render() {

        let {
			scoreUpdate,
            gameStart,
            gameOver,
            boardWidth,
            boardHeight,
            randomEntrances,
            playerIndex,
            playerID,
            playerName,
            preScore,
            playerScore,
            playerLevel,
            levelCounter,
            ranking,
            playerNumber,
            playerFacing,
            playerPosition,
            prevPlayerPos,
        } = this.state
        
        // Display info
		let status = ""

        if (gameStart) {
            if (gameOver && !scoreUpdate && playerIndex === 0) {
                scoreUpdate = true
                this.setState({
                    scoreUpdate
                })
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
					axios.post("/updateScore", {
                        _id: playerID[i],
                        score: playerScore[i],
					})
                }
				this.props.setMode("GameEnd")
            }

            status = "Number of players:" + playerNumber
            return(<div>
                <div style={{
                    backgroundImage: `url(${background})`,
                    color: "white"
                    }}>
                    <div 
                        className = "status"
                        style = {{textAlign: "center"}}
                    >
                        {status}
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
                </div>
            )
        }
        else {
            let loaded = 0
            let haha = ""
            if (playerNumber > 0) loaded++
            if (randomEntrances.length > 0) loaded++
            if (playerID.length === playerNumber) loaded++
            if (playerName.length === playerNumber) loaded++
            if (preScore[0] !== -1) loaded++
            if (playerScore[0] !== -1) loaded++
            if (playerLevel.length === playerNumber) loaded++
            if (levelCounter.length > 0) loaded++
            if (ranking.length > 0) loaded++
            if (playerFacing.length === playerNumber) loaded++
            if (playerPosition.length === playerNumber) loaded++
            if (prevPlayerPos.length === playerNumber) loaded++
            if (loaded === 12) {
                this.setState({
                    gameStart: true
                })
            }
            let loadedPercent = Math.floor(100 * loaded / 12)
            return(
                <div
                    style = {
                        {
                            backgroundImage: `url(${background})`,
                            textAlign: "center",
                            verticalAlign: "center"
                        }
                    }>
                Loading... {loadedPercent}% {haha}
                </div>
            )
        }
    }
}

export default Game;
