import React, { Component } from 'react';
import ws from './service';

class Roomline extends Component{
    render(){
        // invite button display (to be implemented)
        return (<tr>
                    <td>
                        {this.props.roomname}
                    </td>
                    <td>
                        {this.props.numofusers}
                    </td>
                    <td>
                        <button onClick={this.props.handleadd}>Add</button>
                    </td>
            </tr>
        )
    }
}

class Roomlist extends React.Component {
    constructor(props) {
        super(props);
        this.state = {roomlist:[]};
    }

    componentDidMount(){
        fetch('/room')
            .then(res=>res.json())
            .then(res=>this.setState({roomlist:res}));
        ws.on('createroom', data => {
            //console.log(data);
            let display = this.state.roomlist;
            display.push(data);
            //console.log(display);
            this.setState({roomlist:display});
        });
        ws.on('addroomlist', data => {
            let display = this.state.roomlist;
            const isMatch = (element) => element.roomname === data.roomname;
            display[display.findIndex(isMatch)].numofusers = data.numofusers;
            this.setState({roomlist:display});
        });
        ws.on('downroomlist', data => {
            let display = this.state.roomlist;
            const isMatch = (element) => element.roomname === data.roomname;
            display[display.findIndex(isMatch)].numofusers = data.numofusers;
            this.setState({roomlist:display});
        });
        ws.on('deleteroom', data => {
            let display = this.state.roomlist;
            const isMatch = (element) => element.roomname === data.roomname;
            display.splice(display.findIndex(isMatch),1);
            this.setState({roomlist:display});
        });
    }

    render() {
        let roomlist = this.state.roomlist;
        //console.log(roomlist);
        const displaylist = roomlist.map((room) =>
            <Roomline roomname={room.roomname} numofusers={room.numofusers} handleadd={()=>this.props.handleadd(room.roomname)}></Roomline>
        );
        return (
                <table>
                    {displaylist}
                </table>
        );
    }
}
export default Roomlist;