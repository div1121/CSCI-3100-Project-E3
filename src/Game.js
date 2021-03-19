import React, {
    Component
} from 'react';
import GameBoard from './GameBoard'
import _ from 'lodash'
import KeyHandler from 'react-key-handler';

class Game extends Component {

    constructor(props) {
        super(props)
        this.state = {
            showGameBoard: false,
            boardHeight: 0,
            boardWidth: 0,
            cellHeight: 0,
            cellWidth: 0,
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
        this.generateRandomObstacles = this.generateRandomObstacles.bind(this)
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
            x: 0,
            y: 0
        }
        this.setState({
            boardHeight,
            boardWidth,
            areaWidth,
            areaHeight,
            playerPosition,
            showGameBoard: true
        }, () => {
            this.startGame()
        })
    }

    startGame() {
        this.generateRandomObstacles()
        this.setEntrances()
    }
    /*
    setPlayerPosition() {
        let {
            boardHeight,
            boardWidth
        } = this.state
        let playerPosition = {
            x: Math.floor(boardHeight / 2),
            y: Math.floor(boardWidth / 2)
        }
        this.setState({
            playerPosition,
            showGameBoard: true
        })
    }*/

    generateRandomObstacles() {
        let {
            randomPositions
        } = this.state
        let randomValues = []
        let {
            boardHeight,
            boardWidth
        } = this.state
        let smallest = 0
        if (Number(boardHeight) < Number(boardWidth)) {
            smallest = boardHeight
        } else {
            smallest = boardWidth
        }
        for (let i = 0; i < Math.ceil(smallest / 2); i++) {
            randomValues.push(_.random(0, smallest - 1))
        }
        for (let i = 0; i < randomValues.length; i++) {
            for (let j = 0; j < randomValues.length; j++) {
                let newRandomPosition = {
                    x: randomValues[i],
                    y: randomValues[j]
                }
                if (!randomPositions.includes(newRandomPosition)) {
                    randomPositions.push(newRandomPosition)
                }
            }
        }
        this.setState({
            randomPositions
        })
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
        } = this.state

        let prevPos = {
            x: playerPosition.x,
            y: playerPosition.y
        }
        let newX = playerPosition.x
        if (Number(newX) - 1 >= 0) {
            --newX
            playerPosition['x'] = newX
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
            playerPosition['x'] = newX
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
            playerPosition['y'] = newY
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
            playerPosition['y'] = newY
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
        let temp = playerPosition['x'] + playerPosition['y'] * boardWidth
        let status = 'Entrance: '
        if (randomEntrances[temp]) {
            for (let i = 0; i < 4; i++) {
                status += '(' + randomEntrances[temp][i][0] + ', ' + randomEntrances[temp][i][1] + ') '
            }
        }

        return(<div>
            <div className = 'status'>
                {status}
            </div>
            <
                KeyHandler keyValue = 'ArrowUp'
                onKeyHandle = {
                    this.handleKeyUp
                }
            /> <
            KeyHandler keyValue = 'ArrowDown'
            onKeyHandle = {
                this.handleKeyDown
            }
            /> <
            KeyHandler keyValue = 'ArrowRight'
            onKeyHandle = {
                this.handleKeyRight
            }
            /> <
            KeyHandler keyValue = 'ArrowLeft'
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