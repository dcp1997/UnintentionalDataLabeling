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
            showStart: false,
            showSubmit: true,
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
        var current = 0;
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
                       }).then(() => {
                        alert("You have been added to this game."); 
                     });
               } else {
                   alert("You cannot join this game")
                    
               }  
           })
            firebase.database().ref('game-session/' + gc + '/players').once('value', function(snapshot) {
            }).then((snapshot)=>{
                current = snapshot.numChildren();
                if (current!=0){
                    this.setState({showStart: true});  
                    this.setState({showSubmit:false});
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
                        {this.state.showSubmit ?
                            <Button onClick={this.handleSubmit}>Submit</Button>:null
                        }
                    </form>
                    {this.state.showStart ?
                        <Link to="/game"><Button >Start</Button></Link> :null
                    }
                </div>
        </div>
        );
    }
}
export default Join;