import React, {
    Component, useEffect
} from 'react';
import GameBoard from './GameBoard'
import background from "./picture/background.jfif";
import _ from 'lodash'
import KeyHandler, {KEYDOWN} from 'react-key-handler';

class Game extends Component {

    constructor(props) {
        super(props)
        this.state = {
            gameOver: false,
            playerIndex: 0,
            startTime: 0,
            currentTime: 0,
            showGameBoard: false,
            boardHeight: 0,
            boardWidth: 0,
            areaHeight: 0,
            areaWidth: 0,
            randomEntrances: [],
            randomPositions: [],
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
        this.setEntrances = this.setEntrances.bind(this)
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
        let boardWidth = 5
        let boardHeight = 5
        let areaWidth = 5
        let areaHeight = 5
        let playerNumber = 4
        let playerFacing = []
        let playerLevel = []
        let levelCounter = []
        let startTime = 0
        let currentTime = 0
        let nowTime = new Date()
        startTime = nowTime.getHours() * 3600 + nowTime.getMinutes() * 60 + nowTime.getSeconds()
        /*let playerPosition = []
        let prevPlayerPos = []*/
        for (let i = 0; i < boardWidth + boardHeight - 1; i++) levelCounter.push([])
        for (let i = 0; i < playerNumber; i++) {
            playerFacing.push(1)
            /*playerPosition.push({x: Math.floor(areaWidth / 2), y: Math.floor(areaHeight / 2)})
            prevPlayerPos.push({x: Math.floor(areaWidth / 2), y: Math.floor(areaHeight / 2)})*/
            
        }
        playerFacing[0] = 0
        playerFacing[1] = 1
        playerFacing[2] = 2
        playerFacing[3] = 3
        let playerPosition = [
            {x: Math.floor(areaWidth / 2), y: Math.floor(areaHeight / 2)}, 
            {x: Math.floor(areaWidth / 2) + 5, y: Math.floor(areaHeight / 2) + 15}, 
            {x: Math.floor(areaWidth / 2) + 10, y: Math.floor(areaHeight / 2) + 10}, 
            {x: Math.floor(areaWidth / 2) + 15, y: Math.floor(areaHeight / 2) + 5}]
        let prevPlayerPos = [
            {x: Math.floor(areaWidth / 2), y: Math.floor(areaHeight / 2)}, 
            {x: Math.floor(areaWidth / 2) + 5, y: Math.floor(areaHeight / 2) + 15}, 
            {x: Math.floor(areaWidth / 2) + 10, y: Math.floor(areaHeight / 2) + 10}, 
            {x: Math.floor(areaWidth / 2) + 15, y: Math.floor(areaHeight / 2) + 5}]
        let level = 0
        for (let i = 0; i < playerNumber; i++) {
            level = Math.floor(playerPosition[i].x / areaWidth) + Math.floor(playerPosition[i].y / areaHeight)
            playerLevel.push(level)
            levelCounter[level].push(i)
        }
        this.setState({
            boardHeight: boardHeight,
            boardWidth: boardWidth,
            areaWidth: areaWidth,
            areaHeight: areaHeight,
            playerNumber: playerNumber,
            playerFacing: playerFacing,
            playerPosition: playerPosition,
            prevPlayerPos: prevPlayerPos,
            playerLevel: playerLevel,
            levelCounter: levelCounter,
            startTime: startTime,
            currentTime: currentTime,
            showGameBoard: true
        }, () => {
            this.startGame()
        })
    }

    startGame() {
        this.setEntrances()
        this.setRanking()
    }

    setEntrances() {
        let {
            randomEntrances,
            boardHeight,
            boardWidth
        } = this.state
        let randomValues
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
        this.setState({
            randomEntrances
        })
    }

    countTotalMoves() {
        this.setState({
            totalMoves: ++this.state.totalMoves
        })
    }

    setTime() {
        let {
            currentTime
        } = this.state
        let nowTime = new Date()
        currentTime = nowTime.getHours() * 3600 + nowTime.getMinutes() * 60 + nowTime.getSeconds()
        this.setState({
            currentTime: currentTime
        })
    }

    countTime() {
        setInterval(this.setTime, 1)
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
        /*
        if (maxLevel > 4) {
            alert(ranking[0])
            alert(ranking[1])
            alert(ranking[2])
            alert(ranking[3])
        }*/
        this.setState({
            ranking
        })
    }

    handleKeyUp(e) {
        e.preventDefault()
        let {
            playerPosition,
            areaHeight,
            playerFacing,
            playerIndex,
            gameOver
        } = this.state
        if (gameOver === false) {
            playerFacing[playerIndex] = 0
            if (Number(playerPosition[playerIndex].y) % areaHeight - 1 >= 0) this.makeMove(playerPosition[playerIndex].x, playerPosition[playerIndex].y - 1)
        }
    }

    handleKeyDown(e) {
        e.preventDefault()
        let {
            playerPosition,
            areaHeight,
            playerFacing,
            playerIndex,
            gameOver
        } = this.state
        if (gameOver === false) {
            playerFacing[playerIndex] = 1
            if (Number(playerPosition[playerIndex].y) % areaHeight + 1 < areaHeight) this.makeMove(playerPosition[playerIndex].x, playerPosition[playerIndex].y + 1)
        }
    }

    handleKeyRight(e) {
        e.preventDefault()
        let {
            playerPosition,
            areaWidth,
            playerFacing,
            playerIndex,
            gameOver
        } = this.state
        if (gameOver === false) {
            playerFacing[playerIndex] = 3
            if (Number(playerPosition[playerIndex].x) % areaWidth + 1 < areaWidth) this.makeMove(playerPosition[playerIndex].x + 1, playerPosition[playerIndex].y)
        }
    }

    handleKeyLeft(e) {
        e.preventDefault()
        let {
            playerPosition,
            areaWidth,
            playerFacing,
            playerIndex,
            gameOver
        } = this.state
        if (gameOver === false) {
            playerFacing[playerIndex] = 2
            if (Number(playerPosition[playerIndex].x) % areaWidth - 1 >= 0) this.makeMove(playerPosition[playerIndex].x - 1, playerPosition[playerIndex].y)
        }
    }

    makeMove(newX, newY) {
        let {
            playerPosition,
            prevPlayerPos,
            randomEntrances,
            boardHeight,
            boardWidth,
            areaWidth,
            areaHeight,
            playerIndex,
            playerLevel,
            levelCounter,
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
            if (Math.floor(tx / areaWidth) === boardWidth - 1 && Math.floor(ty / areaHeight) === boardHeight - 1) gameOver = true
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
        this.setState({
            playerPosition,
            prevPlayerPos,
            playerLevel,
            levelCounter,
            gameOver
        })
        this.countTotalMoves()
        this.setRanking()
    }

    render() {

        let {
            playerPosition,
            prevPlayerPos,
            randomEntrances,
            boardWidth,
            areaWidth,
            areaHeight,
            totalMoves,
            gameOver
        } = this.state
        /*ranking[0] + ranking[1] + ranking[2] + ranking[3]*/
        let status = '*GM Mode* Coordinates: (' + playerPosition[0].x + ', ' + playerPosition[0].y + ') '
        let temp = Math.floor(playerPosition[0].x / areaWidth) + Math.floor(playerPosition[0].y / areaHeight) * boardWidth
        status += 'Entrance: '
        status += ' ' + prevPlayerPos[0].y
        if (randomEntrances[temp]) {
            for (let i = 0; i < 4; i++) {
                status += '(' + randomEntrances[temp][i][0] + ', ' + randomEntrances[temp][i][1] + ') '
            }
        }
        if (gameOver) {
            gameOver = false
            alert("You win! Total moves: " + totalMoves)
        }

        return(<div>
            <div style={{
                backgroundImage: `url(${background})`,
                height:'100%',
                color: "white"
                }}>
                <div className = "status">
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
                        ( < GameBoard randomPositions = {
                                this.state.randomPositions
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
                            playerNumber = {
                                this.state.playerNumber
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
    }

    export default Game;
