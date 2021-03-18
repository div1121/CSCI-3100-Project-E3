import React, {
    Component
} from 'react';
import GameBoard from './GameBoard'
import _ from 'lodash'
import KeyHandler, {KEYDOWN} from 'react-key-handler';

class Game extends Component {

    constructor(props) {
        super(props)
        this.state = {
            showGameBoard: false,
            boardHeight: 0,
            boardWidth: 0,
            areaHeight: 0,
            areaWidth: 0,
            randomEntrances: [],
            randomPositions: [],
            playerPosition: {
                x: 0,
                y: 0
            },
            prevPlayerPos: {
                x: 0,
                y: 0
            },
            totalMoves: 0
        }
        this.setEntrances = this.setEntrances.bind(this)
        this.handleKeyUp = this.handleKeyUp.bind(this)
        this.handleKeyDown = this.handleKeyDown.bind(this)
        this.handleKeyRight = this.handleKeyRight.bind(this)
        this.handleKeyLeft = this.handleKeyLeft.bind(this)
        this.countTotalMoves = this.countTotalMoves.bind(this)
        //this.setPlayerPosition = this.setPlayerPosition.bind(this)
        this.initializeBoardPlayer = this.initializeBoardPlayer.bind(this)
        this.startGame = this.startGame.bind(this)
    }

    componentWillMount() {
        this.initializeBoardPlayer()
    }

    initializeBoardPlayer() {
        // TODO
        let boardWidth = 5
        let boardHeight = 5
        let areaWidth = 5
        let areaHeight = 5
        let playerPosition = {
            //x: Math.floor(areaWidth / 2),
            //y: Math.floor(areaHeight / 2)
            x: 2,
            y: 2
        }
        let prevPlayerPos = {
            //x: Math.floor(areaWidth / 2),
            //y: Math.floor(areaHeight / 2)
            x: 2,
            y: 2
        }
        this.setState({
            boardHeight,
            boardWidth,
            areaWidth,
            areaHeight,
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
                    let targetWidth = i + entranceDifferences[randomValues][0]
                    let targetHeight = j + entranceDifferences[randomValues][1]
                    if (targetWidth < 0 || targetWidth >= boardHeight || targetHeight < 0 || targetHeight >= boardHeight) {
                        randomEntrances[j + i * boardWidth].push([])
                        randomEntrances[j + i * boardWidth][4 - temp].push(i)
                        randomEntrances[j + i * boardWidth][4 - temp].push(j)
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
            randomEntrances,
            boardHeight,
            boardWidth,
            areaWidth,
            areaHeight
        } = this.state

        let prevPos = {
            x: playerPosition.x,
            y: playerPosition.y
        }
        let newX = playerPosition.x
        let newY = playerPosition.y
        if (Number(newX) - 1 >= 0) {
            --newX
            let x = newX % areaWidth
            let y = newY % areaHeight
            if ((x === 0 && y === 0) || (x === areaWidth - 1 && y === 0) || (x === areaWidth - 1 && y === areaHeight - 1) || (x === 0 && y === areaHeight - 1)) {
                let temp
                if (x === 0 && y === 0) temp = 0
                else if (x === areaWidth - 1 && y === 0) temp = 1
                else if (x === areaWidth - 1 && y === areaHeight - 1) temp = 2
                else temp = 3
                let ax = Math.floor(x / boardWidth), ay = Math.floor(y / boardHeight)
                x = randomEntrances[ax + ay * boardWidth][temp][0] * areaWidth + 2
                y = randomEntrances[ax + ay * boardWidth][temp][1] * areaHeight + 2
                playerPosition["x"] = x
                playerPosition["y"] = y
            }
            else playerPosition["x"] = newX
            this.setState({
                playerPosition,
                prevPlayerPos: prevPos
            })
            this.countTotalMoves()
        }
    }
    handleKeyDown(e) {
        e.preventDefault()
        let {
            playerPosition,
            boardHeight,
        } = this.state

        let prevPos = {
            x: playerPosition.x,
            y: playerPosition.y
        }

        let newX = playerPosition.x
        if (Number(newX) + 1 < boardHeight) {
            ++newX
            playerPosition["x"] = newX
            this.setState({
                playerPosition,
                prevPlayerPos: prevPos
            })
            this.countTotalMoves()
        }
    }
    handleKeyRight(e) {
        e.preventDefault()
        let {
            playerPosition,
            boardWidth
        } = this.state

        let prevPos = {
            x: playerPosition.x,
            y: playerPosition.y
        }

        let newY = playerPosition.y
        if (Number(newY) + 1 < boardWidth) {
            ++newY
            playerPosition["y"] = newY
            this.setState({
                playerPosition,
                prevPlayerPos: prevPos
            })
            this.countTotalMoves()
        }
    }
    handleKeyLeft(e) {
        e.preventDefault()
        let {
            playerPosition,
        } = this.state

        let prevPos = {
            x: playerPosition.x,
            y: playerPosition.y
        }
        let newY = playerPosition.y
        if (Number(newY) - 1 >= 0) {
            --newY
            playerPosition["y"] = newY
            this.setState({
                playerPosition,
                prevPlayerPos: prevPos
            })
            this.countTotalMoves()
        }
    }

    render() {

        let {
            playerPosition,
            randomEntrances,
            boardWidth
        } = this.state
        let temp = playerPosition["x"] + playerPosition["y"] * boardWidth
        let status = 'Entrance: '
        if (randomEntrances[temp]) {
            for (let i = 0; i < 4; i++) {
                status += '(' + randomEntrances[temp][i][0] + ', ' + randomEntrances[temp][i][1] + ') '
            }
        }

        return(<div>
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
                    } </div>
            )
        }
    }

    export default Game;
