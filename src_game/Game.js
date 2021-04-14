import React, {
    Component
} from 'react';
import GameBoard from './GameBoard'
import background from "./picture/bakground.jpg";
import _ from 'lodash'
import KeyHandler, {KEYDOWN} from 'react-key-handler';

class Game extends Component {

    constructor(props) {
        super(props)
        this.state = {
            win: false,
            showGameBoard: false,
            boardHeight: 0,
            boardWidth: 0,
            areaHeight: 0,
            areaWidth: 0,
            randomEntrances: [],
            randomPositions: [],
            playerNumber: 0,
            playerFacing: [],
            playerPosition: [],
            prevPlayerPos: [],
            totalMoves: 0
        }
        this.initializeBoardPlayer = this.initializeBoardPlayer.bind(this)
        this.startGame = this.startGame.bind(this)
        this.setEntrances = this.setEntrances.bind(this)
        this.countTotalMoves = this.countTotalMoves.bind(this)
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
        /*let playerPosition = []
        let prevPlayerPos = []*/
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
        this.setState({
            boardHeight,
            boardWidth,
            areaWidth,
            areaHeight,
            playerNumber,
            playerFacing,
            playerPosition,
            prevPlayerPos,
            showGameBoard: true
        }, () => {
            this.startGame()
        })
    }

    startGame() {
        this.setEntrances()
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

    handleKeyUp(e) {
        e.preventDefault()
        let {
            playerPosition,
            areaHeight,
            playerFacing
        } = this.state
        playerFacing[0] = 0
        if (Number(playerPosition[0].y) % areaHeight - 1 >= 0) this.makeMove(playerPosition[0].x, playerPosition[0].y - 1)
    }

    handleKeyDown(e) {
        e.preventDefault()
        let {
            playerPosition,
            areaHeight,
            playerFacing
        } = this.state
        playerFacing[0] = 1
        if (Number(playerPosition[0].y) % areaHeight + 1 < areaHeight) this.makeMove(playerPosition[0].x, playerPosition[0].y + 1)
    }

    handleKeyRight(e) {
        e.preventDefault()
        let {
            playerPosition,
            areaWidth,
            playerFacing
        } = this.state
        playerFacing[0] = 3
        if (Number(playerPosition[0].x) % areaWidth + 1 < areaWidth) this.makeMove(playerPosition[0].x + 1, playerPosition[0].y)
    }

    handleKeyLeft(e) {
        e.preventDefault()
        let {
            playerPosition,
            areaWidth,
            playerFacing
        } = this.state
        playerFacing[0] = 2
        if (Number(playerPosition[0].x) % areaWidth - 1 >= 0) this.makeMove(playerPosition[0].x - 1, playerPosition[0].y)
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
            win
        } = this.state
        let prevPos = {
            x: playerPosition[0].x,
            y: playerPosition[0].y
        }
        prevPlayerPos[0] = prevPos
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
            playerPosition[0].x = tx
            playerPosition[0].y = ty
            if (Math.floor(tx / areaWidth) === boardWidth - 1 && Math.floor(ty / areaHeight) === boardHeight - 1) win = true
        }
        else {
            playerPosition[0].x = newX
            playerPosition[0].y = newY
        }
        this.setState({
            playerPosition,
            prevPlayerPos,
            win
        })
        this.countTotalMoves()
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
            win
        } = this.state

        let status = '*GM Mode* Coordinates: (' + playerPosition[0].x + ', ' + playerPosition[0].y + ') '
        let temp = Math.floor(playerPosition[0].x / areaWidth) + Math.floor(playerPosition[0].y / areaHeight) * boardWidth
        status += 'Entrance: '
        status += prevPlayerPos[0].x + ' ' + prevPlayerPos[0].y
        if (randomEntrances[temp]) {
            for (let i = 0; i < 4; i++) {
                status += '(' + randomEntrances[temp][i][0] + ', ' + randomEntrances[temp][i][1] + ') '
            }
        }
        if (win) {
            win = false
            alert("You win! Total moves: " + totalMoves)
        }

        return(<div>
            <div style={{
                backgroundImage: `url(${background})`,
                height:'800px'
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
                            totalMoves = {
                                this.state.totalMoves
                            }
                            />)
                    }
                </div>
            </div>
            )
        }
    }

    export default Game;
