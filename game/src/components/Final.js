import React, { Component } from 'react';
import '../App.css';
import firebase from '../firebase'
import Button from 'react-bootstrap/Button';
import { Route, Link, BrowserRouter as Router } from 'react-router-dom';


class Final extends Component
{
    constructor(props) {
        super(props);
    
        this.state = {
          username: "",
          dbKey: "",
          players:[],
          scores:[],
          playerRef: '',
          scoreList:"",
          scoreUpdated: false
        };

      }


    componentWillMount(){
        var pathname = window.location.pathname.split('/');
        this.setState({username: pathname[2]});
        this.setState({dbKey: pathname[3]});
    }

    componentDidMount() {
        this.updatePlayers();
      }

      componentDidUpdate(){
        if(this.state.scoreUpdated === false)
        {
          this.updatePlayers();
        }

      }

    updatePlayers() {
        var query = firebase.database().ref("game-session/"+ this.state.dbKey + "/players").orderByKey();
        query.once("value" , snap => {
          this.state.players = [];
          this.state.scores = [];
          snap.forEach(child => {
            this.setState({
              players : this.state.players.concat([child.val().nickname]),
              scores: this.state.scores.concat([child.val().score])

            });
    
            const playerList = this.state.players.map((player) =>
              <p class="player">
                {player}                      
                <br/>
              </p>
            );

            const scoreL = this.state.scores.map((score) =>
              <p class="score">
                {score}
                <br/>
              </p>
            );

            
    
            this.setState({
              playerRef: playerList,
              scoreList: scoreL,
              scoreUpdated:true
            });
          });
        });
    
    
      }

    render() {

        return (
            <div>
                <header id="final" class='icon'>
                    <div>
                    <Link to="/">
                        <i class="fas fa-sign-out-alt fa-xs"></i>
                    </Link>   
                    </div>
                </header>
                <header id="final">
                    Final Scores
                </header>

                <div className="container">

                    <div className="caption" id="caption">

                    </div>
                    <div className="scores">
                      <div id = "playerName"><p className="scoreHeader">Player</p>{this.state.playerRef} </div>
                      <div id = "playerScore"><p className="scoreHeader">Score</p>{this.state.scoreList}</div>
                    </div> 
                    <br></br> 
                    <div id="center">
                    {
                        <Link to='/'><Button >End Game</Button></Link>
                    }
                    </div>
                </div>
            </div>
        );
      }
}
export default Final;