import React, { Component } from 'react';
import firebase from '../firebase'
import Button from 'react-bootstrap/Button'
import { Route, Link, BrowserRouter as Router } from 'react-router-dom';


class Join extends Component {
    
    constructor(props)
    {
        super(props);

        this.state = {
            userName:'',
            gameCode: '',
            showStart: false,
            showSubmit: true,
            userKey: '2'
        }
                
        this.updateUserName = this.updateUserName.bind(this);
        this.updateGameCode = this.updateGameCode.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
        this.updatePlayer = this.updatePlayer.bind(this);
        this.addHands = this.addHands.bind(this);
        this.getRandomInt = this.getRandomInt.bind(this);
    }

    updateGameCode(event) {
        this.setState({gameCode: event.target.value});
    }

    updateUserName(event)
    {
        this.setState({userName: event.target.value})
    }

    getRandomInt(min, max) 
    {
        min = Math.ceil(min);
        max = Math.floor(max);
        return Math.floor(Math.random() * (max - min + 1)) + min;
    }

    updatePlayer(k, i){
        // alert("Updating player")
        // alert("Key" + k)
        // alert("Player " + i)
        var numberofRounds = 0;
        var user = this.state.userName;
        firebase.database().ref('game-session/' + k + '/numberRounds').once('value', function(snapshot) {
            numberofRounds = snapshot.val()
            // alert("Rounds " + numberofRounds)
            for (var roundNum=0; roundNum<numberofRounds; roundNum++){
                var playerSubmission = {
                    nickname : user,
                    submissionID: 0
                }
                var playerVoted = {
                    nickname : user,
                    ballot: 0
                }
                firebase.database().ref('game-session/' + k + '/round/' + (roundNum+1) + '/submissions/players/' + (i+1)).update({playerSubmission});
                firebase.database().ref('game-session/' + k + '/round/' + (roundNum+1) + '/submissions/voting/' + (i+1)).update(playerVoted)
            }
        });
    }

    addHands(k, i){
        var user = this.state.userName;
        var numberofRounds = 3;
        firebase.database().ref('game-session/' + k + '/numberRounds').once('value').then(function(snapshot) {
            numberofRounds = snapshot.val()
            for (var round = 1; round <= numberofRounds; round++){   
                var hand = {
                    username: user,
                    tile1: Math.floor(Math.random() * (800 - 1 + 1)) + 1,
                    tile2: Math.floor(Math.random() * (800 - 1 + 1)) + 1,
                    tile3: Math.floor(Math.random() * (800 - 1 + 1)) + 1,
                    tile4: Math.floor(Math.random() * (800 - 1 + 1)) + 1
                }         
                firebase.database().ref('game-session/' + k + '/round/' + round + '/hand/' +(i+1)).update(hand);
            } 
        }); 
    }

    handleSubmit()
    {   
        var gc = this.state.gameCode;
        var user = this.state.userName;
        var joined = 0;
        var maxPlayers = 0;
        var current = 0;
        
        firebase.database().ref('game-session/' + gc + '/numberPlayers').once('value', function(snapshot) {
            maxPlayers = snapshot.val()
        });

        if (gc!=null && user!=null){
            firebase.database().ref('game-session/' + gc + '/playersJoined').once('value', function(snapshot) {
                joined = snapshot.val()
                // console.log(joined);
                // console.log(maxPlayers);
                if (joined < maxPlayers) {
                    firebase.database().ref('game-session/' + gc + '/players').child(joined+1).update({
                        nickname : user,
                        powerups : 0,
                        score : 0
                        }).then((snap) => {
                            // this.state.userKey = snap.key;
                            //trying to find a way to log the userKey, as in the number associated with this user in the db
                            joined++;
                            var playersJoined = joined;
                            firebase.database().ref('game-session/' + gc).update({playersJoined});
                      });
                }
                else {
                    alert("You cannot join this game")
                } 
            });
            
            firebase.database().ref('game-session/' + gc + '/players').once('value', function(snapshot) {
            }).then((snapshot)=>{
                current = snapshot.numChildren();
                console.log(joined)
                console.log(current)
                if (current > joined){
                    this.updatePlayer(gc, joined);
                    this.addHands(gc, joined);
                    this.setState({showStart: true});  
                    this.setState({showSubmit:false});
                }
            }); 
        }
    }

    render() { 
        var lobbyLink = "/lobby/" + this.state.userKey + "/" + this.state.gameCode ;

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
                        <Link to={lobbyLink}><Button >Go To Lobby</Button></Link>:null
                    }
                </div>
        </div>
        );
    }
}
export default Join;