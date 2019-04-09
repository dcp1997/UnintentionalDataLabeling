import React, { Component } from 'react';
import firebase from '../firebase'
import { storage } from 'firebase';
import Button from 'react-bootstrap/Button';
import { Route, Link, BrowserRouter as Router } from 'react-router-dom';
import Lobby from './Lobby';

class Create extends Component {
    
    constructor(props)
    {
        super(props);
        
        this.state = {
          hostUserName:'',
          numberOfPlayers: '',
          numberofRounds:'',
          mode:'image',
          dbKey: '',
          showStart:false,
          showSubmit:true,
        }

        this.updateUserName = this.updateUserName.bind(this);
        this.updateNumberOfPlayers = this.updateNumberOfPlayers.bind(this);
        this.updateNumberOfRounds = this.updateNumberOfRounds.bind(this);
        this.updateMode = this.updateMode.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
        this.addSubmissions = this.addSubmissions.bind(this);
        this.addPlayersToSubmissions = this.addPlayersToSubmissions.bind(this);
        this.addPlayers = this.addPlayers.bind(this);
        this.addPlayersToVoting = this.addPlayersToVoting.bind(this);
        this.addHands = this.addHands.bind(this);
    }

    updateMode(event) {
        this.setState({value: event.target.value});
    }

    updateUserName(event)
    {
        this.setState({hostUserName: event.target.value})
    }

    updateNumberOfPlayers(event)
    {
        this.setState({numberOfPlayers : event.target.value})
    }
    updateNumberOfRounds(event)
    {
        this.setState({numberofRounds : event.target.value})
    }  
    
    addSubmissions(k){
        // add submissions part to each round
        for (var i = 1; i < this.state.numberofRounds; i++){
            var submissions = {
                players : [ null],
                promptID : this.getRandomInt(1,27),
                type : "",
                voting : [null, {
                  nickname : 0
                },],
                winner : "",
                submittedAmount: 0
            }

        firebase.database().ref('game-session/' + k + '/round/' + (i+1)).update({submissions})
        }
    }

    addHands(k){
        var user = this.state.hostUserName;
        for (var i = 1; i <= this.state.numberofRounds; i++){   
            var hand = {
                username: user,
                tile1: this.getRandomInt(1,800),
                tile2: this.getRandomInt(1,800),
                tile3: this.getRandomInt(1,800),
                tile4: this.getRandomInt(1,800)
            }         
            firebase.database().ref('game-session/' + k + '/round/' + i + '/hand/1').update(hand)
        }
    }

    addPlayers(k){
        var player = {
            nickname: "",
            powerups: 0,
            score: 0
        }
        for (var i = 2; i <= this.state.numberOfPlayers; i++){
            firebase.database().ref('game-session/' + k + '/players/' + (i)).update(player)
        }
    }

    addPlayersToSubmissions(k){
        var playerSubmission = {
            nickname : "",
            submissionID: 0
        }
        
        for (var roundNum=0; roundNum<this.state.numberofRounds; roundNum++){
            for (var playerNum=0; playerNum<this.state.numberOfPlayers; playerNum++){
                if (playerNum==0){
                    playerSubmission = {
                        nickname : this.state.hostUserName,
                        submissionID: 0
                    }
                    firebase.database().ref('game-session/' + k + '/round/' + (roundNum+1) + '/submissions/players/' + (playerNum+1)).update({playerSubmission})
                    playerSubmission = {
                        nickname : "",
                        submissionID: 0
                    }
                } else{
                    firebase.database().ref('game-session/' + k + '/round/' + (roundNum+1) + '/submissions/players/' + (playerNum+1)).update({playerSubmission})
                }
            }
        }
    }

    addPlayersToVoting(k){
        var playerVoted = {
            nickname : "",
            ballot: 0
        }
        for (var roundNum=0; roundNum<this.state.numberofRounds; roundNum++){
            for (var playerNum=0; playerNum<this.state.numberOfPlayers; playerNum++){
                if (playerNum==0){
                    playerVoted = {
                        nickname : this.state.hostUserName,
                        ballot: 0
                    }
                    firebase.database().ref('game-session/' + k + '/round/' + (roundNum+1) + '/submissions/voting/' + (playerNum+1)).update(playerVoted)
                    playerVoted = {
                        nickname : "",
                        ballot: 0
                    }
                } else{
                    firebase.database().ref('game-session/' + k + '/round/' + (roundNum+1) + '/submissions/voting/' + (playerNum+1)).update(playerVoted)
                }
            
            }
        }
    }

    
    handleSubmit()
    {     
        var user = this.state.hostUserName.toString();   
        var oneRound = {
            hands : [null],
            // {
            //     // [user]: [null, this.getRandomInt(1,800), this.getRandomInt(1,800), this.getRandomInt(1,800), this.getRandomInt(1,800)]
            // },
            submissions : {
              players : [ null],
              promptID : this.getRandomInt(1,27),
              type : "",
              voting : [null, {
                nickname : "",
                ballot: 0
              },],
              winner : "",
              submittedAmount: 0
            }
        };
        
        if (this.state.mode!=null && this.state.numberOfPlayers!=null && 
            this.state.numberofRounds!=null && this.state.hostUserName!='' && 
            this.state.numberOfPlayers>=3 && this.state.numberofRounds>=3){
                firebase.database().ref('game-session/').push({
                    currentRoundNumber : 1,
                    imagesUsed : null,
                    mode : this.state.mode,
                    numberPlayers : this.state.numberOfPlayers,
                    numberRounds : this.state.numberofRounds,
                    players : 
                    [ null, {
                        nickname : this.state.hostUserName,
                        powerups : 0,
                        score : 0
                        },
                    ],
                    round : [ null, oneRound ],
                    playersJoined: 1
                }).then((snap) => {
                    const key = snap.key;
                    console.log(key);
                    this.setState({dbKey: key});
                    this.setState({showStart: true});
                    this.setState({showSubmit: false});
                    this.addPlayers(key);
                    this.addSubmissions(key);
                    this.addHands(key);
                    this.addPlayersToSubmissions(key);
                    this.addPlayersToVoting(key);
                 }); 
                 this.start = true;
                //  this.continueSetup();
            }
        
        if (this.state.numberOfPlayers<3){
            alert("Not enough players")
        }
        if (this.state.numberOfRounds<3){
            alert("Not enough rounds")
        } 
        if (this.state.hostUserName==''){
            alert("Enter a valid nickname")
        }
    }

    getRandomInt(min, max) 
    {
        min = Math.ceil(min);
        max = Math.floor(max);
        return Math.floor(Math.random() * (max - min + 1)) + min;
    }

    render() { 
        
        var lobbyLink = "/lobby/1/" + this.state.dbKey ;

        return   (
            <div>
            <header class='icon'> 
                <div>
                    <Link to="/"> 
                        <i class="fas fa-home"></i>
                    </Link>   
                </div>
            </header>
            <header>
                Create a New Game 
            </header>
            <div id="gameOptions">
                <form>
                    <p>Enter Your Nickname </p>
                    <input type="text" onChange={this.updateUserName}></input>

                    <p>Number of Players (3-8)                     
                        <br></br><input type="number" min="3" max="8" default="3" name="players" onChange={this.updateNumberOfPlayers}></input>
                    </p>

                    <p>Number of Rounds (min 3)
                        <br></br><input type="number" min="3" max="50" default="3" name="rounds" onChange={this.updateNumberOfRounds}></input>
                    </p>

                    <p>Prompt with: 
                        <div class='styled-select white semi-square '>
                            <select name="prompt">
                                <option value="image">Caption</option>
                                {/* <option value="caption">Caption</option> */}
                            </select>
                        </div>
                    </p>
                    
                </form>
                {this.state.showSubmit ?
                    <Button type="submit" onClick={this.handleSubmit} >Submit</Button> : null
                }
                {this.state.showStart ?
                    <div>
                    <p> Your Shareable GameCode: {this.state.dbKey}</p>
                    <Link to={lobbyLink}><Button >Go To Lobby</Button></Link> </div>
                    :null
                        
                }
            </div>
        </div>
        );
    }
}
export default Create;