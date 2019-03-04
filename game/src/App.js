import React, { Component } from 'react';
import ReactDOM from 'react-dom';

import './index.css';
import * as serviceWorker from './serviceWorker;';
im
import logo from './logo.svg';
import './App.css';
import 
class App extends Component {
  render() {
    return (
    <div> 
      <div id={usernameShow}>Guest</div>
      <textarea id="usernameBox" placeholder="enter Username here"></textarea>
      <button id="submit" onclick="tempUserLogin()">makeUser</button>
      <button id="submit" onclick="readDB()">getRandomImages</button>
      <button id="submit" onclick="createLobby()">createLobby</button>
      <div id="gameLobby">
        <span v-if="seen"> Lobby{} </span>
      </div>
      <button id="submit" onclick="createNewGame()">Create New Game</button>
      </div>
    );
  }
}

export default App;
