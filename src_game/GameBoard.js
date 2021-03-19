import React, {
    Component
} from 'react';
import pressed from "pressed"
// Initialize the system
pressed.start()

class GameBoard extends Component {

    constructor(props) {
        super(props)
        this.state = {
            board: [],
            entityStates: {
                //
                entrance: '╬',
                empty: '　',
                player: '♂'
            }
        }
        this.setPlayerPosition = this.setPlayerPosition.bind(this)
        this.setBoard = this.setBoard.bind(this)
    }
    
    componentWillMount() {
        let {
            boardHeight,
            boardWidth,
            areaHeight,
            areaWidth,
            playerPosition
        } = this.props
        let board = []
        for (let j = 0; j < boardHeight; j++) {
            let tempArray_1 = []
            for (let i = 0; i < boardWidth; i++) {
                let tempArray_2 = []
                for (let y = 0; y < areaHeight; y++) {
                    let tempArray_3 = []
                    for (let x = 0; x < areaWidth; x++) {
                        //tempArray_3.push(x + '' + y)
                        
                        if ((x === 0 && y === 0) || (x === areaWidth - 1 && y === 0) || (x === areaWidth - 1 && y === areaHeight - 1) || (x === 0 && y === areaHeight - 1)) {
                            tempArray_3.push(this.state.entityStates.entrance)
                        } else if (playerPosition.x === i * areaWidth + x && playerPosition.y === j * areaHeight + y) {
                            tempArray_3.push(this.state.entityStates.player)
                        } else {
                            tempArray_3.push(this.state.entityStates.empty)
                        }
                        
                    }
                    tempArray_2.push(tempArray_3)
                }
                tempArray_1.push(tempArray_2)
            }
            board.push(tempArray_1)
        }
        board[2][1][2][3] = '??'
        this.setState({
            board: board,
            areaHeight,
            areaWidth,
            playerPosition
        }, () => {
            this.setPlayerPosition(playerPosition)
        })
    }

    setPlayerPosition(playerPosition) {
        let {
            board,
            areaHeight,
            areaWidth
        } = this.state
        //alert(areaWidth)
        let px = playerPosition.x, py = playerPosition.y
        board[Math.floor(py / areaHeight)][Math.floor(px / areaWidth)][py % areaHeight][px % areaWidth] = this.state.entityStates.player
        this.setState({
            board
        })
    }

    componentWillReceiveProps(nextProps) {
        if (nextProps === this.props) {} else {
            this.setBoard(nextProps)
        }
    }

    setBoard(props) {
        let {
            playerPosition,
            prevPlayerPos,
            areaHeight,
            areaWidth
        } = props
        let {
            board
        } = this.state
        let px = prevPlayerPos.x, py = prevPlayerPos.y
        let nx = playerPosition.x, ny = playerPosition.y
        board[Math.floor(py / areaHeight)][Math.floor(px / areaWidth)][py % areaHeight][px % areaWidth] = this.state.entityStates.empty
        board[Math.floor(ny / areaHeight)][Math.floor(nx / areaWidth)][ny % areaHeight][nx % areaWidth] = this.state.entityStates.player
        this.setState({
            board: board,
            playerPosition
        }, () => {
            this.setPlayerPosition(playerPosition)
        })
    }

    render() {
        let {
            board
        } = this.state
        //console.log(board);
        return(
            <div>
                {board.map(function(boardRow, i) {
                return (
                    <tr>
                    {boardRow.map(function(area, j) {
                        let fontColour = "black"
                        let backgroundColour = "yellow"
                        if ((i + j) % 2 == 0) {
                            fontColour = "white"
                            backgroundColour = "blue"
                        }
                        return (
                            <td
                                style = {
                                    {
                                        textAlign: "center",
                                        verticalAlign: "middle",
                                        backgroundColor: backgroundColour,
                                        color: fontColour
                                    }
                                }
                            >
                            <table
                                className = "area"
                                cellSpacing = "0"
                                id = "table"
                                border = "3px"
                                width = "100"
                                height = "100"
                                textAlign = "center"
                            >
                                <tbody>
                                    {area.map(function(areaRow) {
                                    return (
                                        <tr>
                                        {areaRow.map(function(cell) {
                                            return ( 
                                            <td className = "area">
                                                {cell}
                                                </td>
                                            )
                                        })}
                                        </tr>
                                    );
                                    })}
                                </tbody>
                            </table>
                            </td>
                        )
                    })}
                    </tr>
                );
                })}
            </div>
        )
    }
}

export default GameBoard
