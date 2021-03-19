import React, { Component } from 'react';

class Playerline extends Component{
    render(){
        let str = "Ready"
        if (this.props.isready){
            str = "Cancel"
        }
        return (<tr>
            <td>
            {this.props.playername}</td>
            <td><button onClick={this.props.handleready}>{str}</button>
            </td>
            </tr>
            )
    }
}

class Gameroom extends Component{
    constructor(props) {
        super(props);
        this.state = {room_name: this.props.roomname, player_list: this.props.player_list, player_num: this.props.player_num, ready_num: 0 ,ready_state: Array(4).fill(false)};
        this.addready = this.addready.bind(this)
        this.minusready = this.minusready.bind(this)
    }

    addready(i){
        let array = this.state.ready_state
        array[i] = true
        let ready_num = this.state.ready_num + 1;
        this.setState({ready_num: ready_num,ready_state:array});
        if (ready_num>=4){
            return;
        }
    }

    minusready(i){
        let array = this.state.ready_state
        array[i] = false
        let ready_num = this.state.ready_num - 1;
        if (ready_num<0){
            return;
        }
        this.setState({ready_num: ready_num,ready_state:array});
    }

    render(){
        let list = [0,0,0,0];
        for (let i=0;i<4;i++){
            if (this.state.ready_state[i])
                list[i] = () => this.minusready(i)
            else list[i] = () => this.addready(i)
        }
        return (<div>
            <h1>{this.props.room_name}</h1>
            <table>
                <Playerline isready={this.state.ready_state[0]}
                playername={this.props.player_list[0]} handleready={list[0]} />
            <Playerline isready={this.state.ready_state[1]}
                        playername={this.props.player_list[1]} handleready={list[1]} />
                <Playerline isready={this.state.ready_state[2]}
                        playername={this.props.player_list[2]} handleready={list[2]} />
                <Playerline isready={this.state.ready_state[3]}
                        playername={this.props.player_list[3]} handleready={list[3]} />
            </table>
            <h2>Number of ready: {this.state.ready_num}</h2>
        </div>)
    }
}

export default Gameroom;