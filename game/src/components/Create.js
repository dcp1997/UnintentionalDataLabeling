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
        this.continueSetup = this.continueSetup.bind(this);
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
    
    continueSetup(k){
        var prompt = Math.floor(Math.random() * (833 - 1 + 1)) + 1;
        var submissions = {
              players : [ null, {
                nickname : "",
                submissionID : 1
              },],
              promptID : prompt,
              type : "",
              voting : [null, {
                nickname : 0
              },],
              winner : ""
            }
        
        for (var i = 1; i < this.state.numberofRounds; i++){
            firebase.database().ref('game-session/' + k + '/round/' + (i+1)).update({submissions})
        }
    }
    
    handleSubmit()
    {
        var oneRound = {
            submissions : {
              players : [ null, {
                nickname : "",
                submissionID : 1
              },],
              promptID : 1,
              type : "",
              voting : [null, {
                nickname : 0
              },],
              winner : ""
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
                }).then((snap) => {
                    const key = snap.key;
                    console.log(key);
                    this.setState({dbKey: key});
                    this.setState({showStart: true});
                    this.setState({showSubmit: false});
                    this.continueSetup(key);
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

    render() { 
        
        var lobbyLink = "/lobby/" + this.state.hostUserName + "/" + this.state.dbKey ;

        return   (
            <div>
                <div>
                <Link to="/"> 
                    <Button id="exit">Home</Button>
                </Link>   
                </div>
            <header>Create a New Game </header>
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
                        <Link to="/game"><Button >Start</Button></Link> :null
                }
                
                <Link to={lobbyLink}><Button >Go To Lobby</Button></Link>
    
                <p> Your Shareable GameCode: {this.state.dbKey}</p>
            </div>
        </div>
        );
    }
}
export default Create;