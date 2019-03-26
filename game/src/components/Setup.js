import React, { Component } from 'react';
import firebase from '../firebase'
import Button from 'react-bootstrap/Button'
import { Route, Link, BrowserRouter as Router } from 'react-router-dom';
import Lobby from './Lobby';


class Setup extends Component {
    
    constructor(props)
    {
        super(props);
        
        this.state = {
          hostUserName:'',
          numberOfPlayers: '',
          numberofRounds:'',
          dbKey: 'oneGame',
          settingUpGame: true
        }

        this.updateUserName = this.updateUserName.bind(this);
        this.updateNumberOfPlayers = this.updateNumberOfPlayers.bind(this);
        this.updateNumberOfRounds = this.updateNumberOfRounds.bind(this);
        this.updateMode = this.updateMode.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
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
    
    handleSubmit()
    {

        if (this.state.numberOfPlayers!=null && 
            this.state.numberofRounds!=null && this.state.hostUserName!=null && 
            this.state.numberOfPlayers>=3 && this.state.numberofRounds>=1){
                firebase.database().ref('game-session/oneGame').update({
                    currentRoundNumber : 1,
                    imagesUsed : null,
                    numberPlayers : this.state.numberOfPlayers,
                    numberRounds : this.state.numberofRounds,
                    players : 
                    [ null, {
                        nickname : this.state.hostUserName,
                        powerups : 0,
                        score : 0
                        },
                        // {
                        // nickname : "",
                        // powerups : 0,
                        // score : 0
                        // },
                        // {
                        // nickname : "",
                        // powerups : 0,
                        // score : 0
                        // },
                    ],
                    round : [ null, {
                        submissions : {
                          players : [ null, {
                            nickname : "",
                            submissionID : 1
                          }, {
                            nickname : "",
                            submissionID : 2
                          } ],
                          promptID : 1,
                          type : "",
                          winner : ""
                        }
                    } ],
                });
                 this.start = true;
            }

                  
        if (this.state.numberOfPlayers<3){
            alert("Not enough players")
        }
        if (this.state.numberOfRounds<3){
            alert("Not enough rounds")
        } 
        
    }

    render() { 
        return   (
            
            <div>
                    <div>
                <Link to="/">
                    <Button id="exit">Exit</Button>
                </Link>   
                </div>
            <header>Create a new game </header>
            <div id="gameOptions">
                <form>
                    <p>Enter Your Nickname </p>
                    <input type="text" onChange={this.updateUserName}></input>

                    <p>Number of Players                     
                        <input type="number" min="3" max="8" default="3" name="players" onChange={this.updateNumberOfPlayers}></input>
                    </p>

                    <p>Number of Rounds
                    <input type="number" min="3" max="50" default="3" name="rounds" onChange={this.updateNumberOfRounds}></input>
                    </p>

                    <p>Play with </p>
                    <select name="prompt">
                        <option value="image">Image</option>
                        <option value="caption">Caption</option>
                    </select>
                </form>

                <input type="submit" onClick={this.handleSubmit} ></input>
                <p> Your Shareable GameCode: {this.state.dbKey}</p>

                <Link to="/game">
                    <Button id ="startGame" variant="primary" disabled={!this.start}>Start Game</Button>
                </Link>  
                Current Players in Your Game:
                
            </div>
            <Lobby hostUserName = {this.state.hostUserName} />

            </div>
        );
    }
}
export default Setup;