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
          scoreList:""
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

    updatePlayers() {
        var i = 0;
        var query = firebase.database().ref("game-session/"+ this.state.dbKey + "/players").orderByKey();
        query.on("value" , snap => {
          this.state.players = [];
          snap.forEach(child => {
            this.setState({
              players : this.state.players.concat([child.val().nickname]),
              scores: this.state.scores.concat([child.val().score])

            });
    
            const playerList = this.state.players.map((player) =>
              <p>
                {player}:                
                <br/>
              </p>
            );

            const scoreL = this.state.scores.map((score) =>
              <p>
                {score}
                <br/>
              </p>
            );

            
    
            this.setState({
              playerRef: playerList,
              scoreList: scoreL
            });
          });
        });
    
    
      }

    render() {

        return (
            <div>
                <header id="win" class='icon'>
                    <div>
                    <Link to="/">
                        <i class="fas fa-sign-out-alt fa-xs"></i>
                    </Link>   
                    </div>
                </header>
                <header>
                    Final Scores
                </header>

                <div className="container">

                    <div className="caption" id="caption">

                    </div>

                    <div className="scores">
                    <p> Player Scores:</p>
                    <div id = "scoreFloat">{this.state.playerRef} </div>

                    <div id = "scoreFloat">{this.state.scoreList}</div>


                    </div>  
                    <div id="center">

                    
                    {
                        <Link to='/'><Button >Go to Main Menu</Button></Link>
                    }
                    </div>
                </div>
            </div>
        );
      }
}
export default Final;