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
            gameCode: '',
        }

        this.updateUserName = this.updateUserName.bind(this);
        this.updateGameCode = this.updateGameCode.bind(this);
        
        this.handleSubmit = this.handleSubmit.bind(this);
    }

    updateGameCode(event) {
        this.setState({gameCode: event.target.value});
    }

    updateUserName(event)
    {
        this.setState({hostUserName: event.target.value})
    }

    handleSubmit()
    {   
        var gc = this.state.gameCode;
        var user = this.state.hostUserName;
        var maxPlayers = 0;
        firebase.database().ref('game-session/' + gc + '/numberPlayers').once('value', function(snapshot) {
            maxPlayers = snapshot.val()
        });
        if (gc!=null && user!=null){
            firebase.database().ref('game-session/' + gc + '/players').once('value', function(snapshot) {
                if (snapshot.numChildren()<maxPlayers){ 
                   firebase.database().ref('game-session/' + gc + '/players').child(snapshot.numChildren()+1).update({
                       nickname : user,
                       powerups : 0,
                       score : 0
                       });
                    alert("You have been added to this game.")
               } else {
                   alert("You cannot join this game")
               } 
           });
        }  
    }

    render() { 
        return   (
            <div>
                <div>
                <Link to="/">
                    <Button id="exit">Home</Button>
                </Link>   
                </div>
                <header>Join A Game</header>
                <div id="gameOptions">
                    <form>
                        <p>Enter Your Nickname </p>
                            <input type="text" onChange={this.updateUserName}></input>
                        <p>Enter Game Code<br></br>
                            <input type="text" name="gameCode" onChange={this.updateGameCode}></input>
                        </p>
                        <Button onClick={this.handleSubmit}>Submit</Button>
                    </form>
                    <div id="next" >
                        <Link to="/game">
                            <Button disabled={!this.start}>Start Game</Button>
                        </Link> 
                    </div>
                </div>
        </div>
        );
    }
}
export default Join;