import React, {
    Component
} from 'react';
import pressed from "pressed"

import red_floor from "./picture/red_floor.jpg";
import blue_floor from "./picture/blue_floor.jpg";
import black_floor from "./picture/black_floor.jpg";
import fire from "./picture/fire.gif";
import red_entrance_img from "./picture/red_entrance.gif";
import blue_entrance_img from "./picture/blue_entrance.gif";
import vanish_img from "./picture/vanish.gif"
import man_1_back from "./picture/man/man_1_back.gif";
import man_1_front from "./picture/man/man_1_front.gif";
import man_1_left from "./picture/man/man_1_left.gif";
import man_1_right from "./picture/man/man_1_right.gif";
import man_2_back from "./picture/man/man_2_back.gif";
import man_2_front from "./picture/man/man_2_front.gif";
import man_2_left from "./picture/man/man_2_left.gif";
import man_2_right from "./picture/man/man_2_right.gif";
import man_3_back from "./picture/man/man_3_back.gif";
import man_3_front from "./picture/man/man_3_front.gif";
import man_3_left from "./picture/man/man_3_left.gif";
import man_3_right from "./picture/man/man_3_right.gif";
import man_4_back from "./picture/man/man_4_back.gif";
import man_4_front from "./picture/man/man_4_front.gif";
import man_4_left from "./picture/man/man_4_left.gif";
import man_4_right from "./picture/man/man_4_right.gif";
import gold_border_square from "./picture/border/gold_border_square.gif"
import silver_border_square from "./picture/border/silver_border_square.gif"
import bronze_border_square from "./picture/border/bronze_border_square.gif"
import stone_border_square from "./picture/border/stone_border_square.gif"
import gold_border_long from "./picture/border/gold_border_long.gif"
import silver_border_long from "./picture/border/silver_border_long.gif"
import bronze_border_long from "./picture/border/bronze_border_long.gif"
import stone_border_long from "./picture/border/stone_border_long.gif"
import border_long_2 from "./picture/border/border_long_2.gif"
import empty_img from "./picture/empty.gif"
pressed.start()

// GameBoard.js is to display the game board of the game
class GameBoard extends Component {

    constructor(props) {
        super(props)
        this.state = {
            board: [],
            vanish: [],
            entityStates: {
                /*empty: '　',
                player: '♂',
                entrance: '╬'*/
                empty: 0,
                entrance: 1,
                player: 2
                /*player: 2 ~ 5*/
            }
        }
        this.setPlayer = this.setPlayer.bind(this)
    }
    
    // Initialize the display of game board at beginning
    componentWillMount() {
        this.initializeGameBoard()
    }

    // Initialize the display of game board
    initializeGameBoard() {
        let {
            boardHeight,
            boardWidth,
            areaHeight,
            areaWidth,
            playerPosition
        } = this.props
        let {
            entityStates
        } = this.state
        let board = []
        let vanish = []
        for (let i = 0; i < boardWidth + boardHeight - 1; i++) vanish.push(false)
        vanish[boardWidth + boardHeight - 2] = true
        
        for (let j = 0; j < boardHeight; j++) {
            let tempArray_1 = []
            for (let i = 0; i < boardWidth; i++) {
                let tempArray_2 = []
                for (let y = 0; y < areaHeight; y++) {
                    let tempArray_3 = []
                    for (let x = 0; x < areaWidth; x++) {                        
                        if ((x === 0 && y === 0) || (x === areaWidth - 1 && y === 0) || (x === areaWidth - 1 && y === areaHeight - 1) || (x === 0 && y === areaHeight - 1)) {
                            tempArray_3.push(entityStates.entrance)
                        } else {
                            tempArray_3.push(entityStates.empty)
                        }
                    }
                    tempArray_2.push(tempArray_3)
                }
                tempArray_1.push(tempArray_2)
            }
            board.push(tempArray_1)
        }
        this.setState({
            board: board,
            vanish: vanish,
            areaHeight,
            areaWidth,
            playerPosition
        })
    }

    // Update the player info when game info is changed
    componentWillReceiveProps(nextProps) {
        this.setPlayer(nextProps)
    }

    // Change the position of the players
    // We will clear the image of player on the previous position,
    // then display it on the current position
    setPlayer(props) {
        let {
            playerNumber,
            playerPosition,
            prevPlayerPos,
            boardHeight,
            boardWidth,
            areaHeight,
            areaWidth,
            gameOver
        } = props
        let {
            board,
            vanish,
            entityStates
        } = this.state
        let px, py, nx, ny, vanishNum = boardHeight + boardWidth - 2
        for (let i = 0; i < playerNumber; i++) {
            px = prevPlayerPos[i].x
            py = prevPlayerPos[i].y
            board[Math.floor(py / areaHeight)][Math.floor(px / areaWidth)][py % areaHeight][px % areaWidth] = entityStates.empty
        }
        for (let i = 0; i < playerNumber; i++) {
            nx = playerPosition[i].x
            ny = playerPosition[i].y
            board[Math.floor(ny / areaHeight)][Math.floor(nx / areaWidth)][ny % areaHeight][nx % areaWidth] = entityStates.player + i
            if (Math.floor(ny / areaHeight) + Math.floor(nx / areaWidth) - 1 < vanishNum) vanishNum = Math.floor(ny / areaHeight) + Math.floor(nx / areaWidth) - 1
        }
        if (gameOver) vanishNum = boardHeight + boardWidth - 2
        for (let i = 0; i <= vanishNum; i++) vanish[i] = true
        this.setState({
            board: board,
            playerPosition
        })
    }

    // Display the board
    render() {
        let {
            gameTime,
            playerNumber,
            playerName,
            playerIndex,
            preScore,
            playerScore,
            playerPosition,
            playerFacing,
            playerLevel,
            boardWidth,
            boardHeight,
            startTime,
            currentTime,
            ranking,
            gameOver
        } = this.props
        let {
            board,
            vanish,
            entityStates
        } = this.state
        let playerImg = [
            [man_1_back, man_1_front, man_1_left, man_1_right],
            [man_2_back, man_2_front, man_2_left, man_2_right],
            [man_3_back, man_3_front, man_3_left, man_3_right],
            [man_4_back, man_4_front, man_4_left, man_4_right]
        ]
        // The following is to return the display of game board
        // Our game board is using table format
        return(
            <div>
                {board.map(function(boardRow, i) {
                    let playerPos = [{x: 0, y: 0}]
                    let border_square = border_long_2
                    let border_long = empty_img
                    let w_0 = "0", w_1 = "300", w_2 = "0"
                    let timePass = Math.floor(((gameTime * 1000 + 5000) + startTime - currentTime) / 1000)
                    let t_0 = "Time: " + timePass, t_1 = "", t_2 = "", t_3 = "", t_4 = "", t_5 = "", t_6 = ""
                    let colour_0 = "white", colour_1 = "white"
                    if (i < playerNumber) {
                        if (ranking[i] === playerIndex) {
                            if (i === 0) colour_1 = "yellow"
                            if (i === 1) colour_1 = "cyan"
                            if (i === 2) colour_1 = "orange"
                            if (i === 3) colour_1 = "gray"
                        }
                        playerPos[0].x = playerPosition[ranking[i]].x
                        playerPos[0].y = playerPosition[ranking[i]].y
                        w_1 = "100"
                        w_2 = "200"
                        w_0 = "80"
                        t_0 = ""
                        if (gameOver) {
                            t_1 = "Name: " + playerName[ranking[i]]
                            t_2 = "Position: (" + playerPos[0].x + ", " + playerPos[0].y + ")"
                            t_3 = "Level: " + playerLevel[ranking[i]]
                            let playerStatus = "Unfinished"
                            if (playerLevel[ranking[i]] === boardWidth + boardHeight - 2) playerStatus = "Finished"
                            t_4 = "Status: " + playerStatus
                            if (i === 0) {
                                if (playerStatus === "Finished") t_6 = " + 2 = "
                                else t_6 = " + 0 = "
                            }
                            if (i === 1) {
                                if (playerStatus === "Finished") t_6 = " + 1 = "
                                else t_6 = " - 1 = "
                            }
                            if (i === 2) {
                                if (playerStatus === "Finished") t_6 = " - 1 = "
                                else t_6 = " - 3 = "
                            }
                            if (i === 3) {
                                if (playerStatus === "Finished") t_6 = " - 2 = "
                                else t_6 = " - 4 = "
                            }
                            t_5 = "Score: " + preScore[ranking[i]] + t_6 + playerScore[ranking[i]]
                        }
                        else {
                            t_1 = "Name: " + playerName[ranking[i]]
                            t_2 = "Position: (" + playerPos[0].x + ", " + playerPos[0].y + ")"
                            t_3 = "Level: " + playerLevel[ranking[i]]
                            let playerStatus = "Unfinished"
                            if (playerLevel[ranking[i]] === boardWidth + boardHeight - 2) playerStatus = "Finished"
                            t_4 = "Status: " + playerStatus
                            t_5 = "Score: " + preScore[ranking[i]]
                        }
                        if (i === 0) {
                            border_square = gold_border_square
                            border_long = gold_border_long
                        }
                        if (i === 1) {
                            border_square = silver_border_square
                            border_long = silver_border_long
                        }
                        if (i === 2) {
                            border_square = bronze_border_square
                            border_long = bronze_border_long
                        }
                        if (i === 3) {
                            border_square = stone_border_square
                            border_long = stone_border_long
                        }
                    }
                    else {
                        if (gameOver) t_0 = "GAME OVER!"
                        if (timePass > (gameTime + 1)) {
                            t_0 = "Ready... " + (timePass - (gameTime + 1))
                        }
                        if (timePass === (gameTime + 1)) {
                            t_0 = "GO!!!"
                        }
                        if ((timePass <= 5 && timePass >= 0) || timePass >= (gameTime + 1)) {
                            colour_0 = "red"
                        }
                    }
                    return (
                        <tr>
                            {boardRow.map(function(area, j) {
                                let entrance_img = blue_entrance_img
                                let background = red_floor
                                if ((i + j) % 2 === 0) {
                                    entrance_img = red_entrance_img
                                    background = blue_floor
                                }
                                if (vanish[i + j]) {
                                    entrance_img = empty_img
                                    background = vanish_img
                                }
                                return (
                                    <td
                                        style = {
                                            {
                                                backgroundImage: `url(${background})`,
                                                textAlign: "center",
                                                verticalAlign: "middle"
                                            }
                                        }
                                    >
                                        <table
                                            className = "area"
                                            cellSpacing = "0"
                                            id = "table"
                                            border = "2px"
                                            width = "108"
                                            height = "100"
                                            textAlign = "center"
                                            RULES = "NONE"
                                            bordercolor = "black"
                                        >
                                            <tbody>
                                                {area.map(function(areaRow) {
                                                return (
                                                    <tr>
                                                    {areaRow.map(function(cell) {
                                                        let obj_img = empty_img
                                                        if (background === vanish_img) obj_img = empty_img
                                                        else if (cell === entityStates.entrance) obj_img = entrance_img
                                                        else if (cell >= entityStates.player) obj_img = playerImg[cell - entityStates.player][playerFacing[cell - entityStates.player]]
                                                        return (
                                                            <td className = "area">
                                                                <img align="center" height="15" width="15" src={obj_img}/>
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
                            <td style = {{backgroundImage: `url(${black_floor})`}}>
                                <table
                                    cellSpacing = "0"
                                    border = "0px"
                                    width = "105"
                                    height = "100"
                                    style = {{backgroundImage: `url(${fire})`}}
                                >
                                </table>
                            </td>
                            {playerPos.map(function(p) {
                                let obj_img = empty_img
                                if (i < playerNumber) obj_img = playerImg[ranking[i]][1]
                                return (
                                    <td
                                        style = {{
                                            backgroundImage: `url(${black_floor})`,
                                            verticalAlign: "middle",
                                            textAlign: "center"
                                        }}>
                                        <td
                                            width = {w_1}
                                            height = "100"
                                            style = {{
                                                backgroundImage: `url(${border_square})`,
                                                color: colour_0,
                                                fontSize: "40px"
                                            }}
                                        >
                                            {t_0}
                                            <img align="center" height="60" width={w_0} src={obj_img}/>
                                        </td>
                                        <td
                                            width = {w_2}
                                            height = "100"
                                            bordercolor = "black"
                                            style = {{
                                                backgroundImage: `url(${border_long})`,
                                                color: colour_1,
                                                fontSize: "12px"
                                            }}
                                        >
                                            <p>
                                                {t_1}
                                                <br></br>
                                                {t_2}
                                                <br></br>
                                                {t_3}
                                                <br></br>
                                                {t_4}
                                                <br></br>
                                                {t_5}
                                            </p>
                                        </td>
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