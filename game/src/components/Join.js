import React, { Component } from 'react';
import firebase from '../firebase'
import { storage } from 'firebase';
import Button from 'react-bootstrap/Button'
import { Route, Link, BrowserRouter as Router } from 'react-router-dom';



class Join extends Component {
    constructor(props)
    {
        super(props);
        
        this.state = {
          hostUserName:'',
          gameCode: ''
        }
        
        this.updateUserName = this.updateUserName.bind(this);
        this.updateGameCode = this.updateGameCode.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
    }
    updateGameCode(event)
    {
        this.setState({gameCode: event.target.value})
    }
    updateUserName(event)
    {
        this.setState({hostUserName: event.target.value})
    }
    handleSubmit()
    {
        var newPlayer = {
            nickname: this.state.hostUserName,
            powerups : 0,
            score : 0
          };

        if (this.state.gameCode!=null && this.state.hostUserName!=null){
            firebase.database().ref('game-session/' + this.state.gameCode + '/players/').set({newPlayer}).then((snap) => {
                // const key = snap.key;
                // console.log(key);
                // this.setState({dbKey: key});
                }); 
                // this.start = true;
                alert(this.state.hostUserName)
        }
    }
    render() { 
        return   (
            <div>
                <header>Join</header>
                <div id="gameOptions">
                    <form>
                        <p>Enter Your Nickname </p>
                        <input type="text" onChange={this.updateUserName}></input>
                        <p>Enter Game Code</p>
                        <input type="text" name="gameCode" onChange={this.updateGameCode}></input>
                        <input type="submit" onClick={this.handleSubmit} ></input>
                    </form>
                </div>
        </div>
        );
    }
}
export default Join;