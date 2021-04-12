import React, { Component } from 'react';
import Game from './Game';
import { useState } from 'react';
import App from './App.css';
import Countdownlist from './Countdownlist';

class App extends Component {
  render() { 
    const [countdown, setCountdown] = useState(false);
    return (
      <div className="main-app-container">
        <Game />
      <Countdownlist setCountdown={setCountdown}/>
      </div>
    );
  }
}    
export default App;
