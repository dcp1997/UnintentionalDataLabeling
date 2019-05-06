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

        this.updateDatabase = this.updateDatabase.bind(this);

      }


    componentWillMount(){
        this.updatePlayers();
        var pathname = window.location.pathname.split('/');
        this.setState({username: pathname[2]});
        this.setState({dbKey: pathname[3]});
    }

    componentDidMount() {
        this.updatePlayers();
      }

    //Constantly calls updatePlayers until it happens, sometimes it was not happening so this ensures it will
    componentDidUpdate(){
        if(this.state.scoreUpdated == false)
        {
          this.updatePlayers();
        }

      }

    //gets all players from the database and their score, also tracks players leaving the game. 
    updatePlayers() {
      var gc = this.state.dbKey;
        var query = firebase.database().ref("game-session/"+ this.state.dbKey + "/players").orderByKey();
        query.once('value').then(function(snap){
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
        }.bind(this));
        firebase.database().ref("game-session/"+ this.state.dbKey).once('value', function(snapshot) {
          var exit = snapshot.child("playersExited").val();
          firebase.database().ref('game-session/' + gc).update({
            playersExited : (exit+1),});
        });
        
        firebase.database().ref("game-session/"+ this.state.dbKey).once('value', function(snapshot) {
          console.log(snapshot.val());
          var exit = snapshot.child("playersExited").val();
          var numPlayers = snapshot.child("numberPlayers").val();
          // console.log(snapshot.child("playersExited").val());
          // console.log(snapshot.child("numberPlayers").val());
          if (exit == numPlayers){
              this.updateDatabase();
          }
        }.bind(this));
  
    
      }
    
      //moves all the game information to a timestamped archive as to free up the key for new games
    updateDatabase() {
      var newKey = this.state.dbKey + this.getDateString();
      var currentKey = this.state.dbKey;
      firebase.database().ref("game-session/"+ this.state.dbKey).once('value', function(snapshot) {
        console.log(snapshot.val());
        var current = snapshot.val();
        firebase.database().ref('game-session/' + newKey).push(current);
        firebase.database().ref('game-session/' + currentKey).update({'active': false});      
    });
  }

    getDateString(){
      var today = new Date();
      var date = today.getFullYear()+'-'+(today.getMonth()+1)+'-'+today.getDate();
      var time = today.getHours() + ":" + today.getMinutes();
      return date+time;
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