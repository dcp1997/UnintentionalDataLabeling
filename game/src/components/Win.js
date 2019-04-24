import React, { Component } from 'react';
import '../App.css';
import firebase from '../firebase'
import { storage } from 'firebase';
import Button from 'react-bootstrap/Button';
import { Route, Link, BrowserRouter as Router } from 'react-router-dom';

class Winning extends Component{

    constructor(props) {
        super(props);
    
        this.state = {
          username: "",
          dbKey: "",
          round:1,
          allSubmitted: false,
          numberOfPlayers: 3,
          init: 1,
          voteImage: 0,
          winningIndex: "",
          nextRoundReady: true,
          endGame: false,
          changedRound: false
        };
        this.test = this.test.bind(this);
        this.getSubmittedImages = this.getSubmittedImages.bind(this);
      }


    getSubmittedImages(){

        this.getRoundCaption()
        var playersVoted = 0;
        var playerNumber = this.state.numberOfPlayers
        var winArray = new Array(playerNumber);
        var winningPic = 0;
        firebase.database().ref('game-session/'+ this.state.dbKey +'/round/1/submissions/voting/').once('value').then(function(snapshot){
            console.log(snapshot.val().numVoted);
            console.log(playerNumber);
            playersVoted = snapshot.val().numVoted
            var i = 0;
            if(playerNumber === playersVoted){
                snapshot.forEach(child => {
                    const indexofPic = parseInt(child.val().ballot);
                    console.log(indexofPic);
                    console.log(child.val())
                    if(i !== playerNumber){
                        winArray[i] = indexofPic;
                    }
                    console.log(winArray)
                    i++;


                });
                console.log(winArray)
            }
            console.log(winArray)
            function mode(arr){
                return arr.sort((a,b) =>
                      arr.filter(v => v===a).length
                    - arr.filter(v => v===b).length
                ).pop();
            }
            winningPic = mode(winArray)

            console.log(winningPic);
            this.setState({winningIndex: winningPic});

            if(winningPic != null)
            {
                firebase.database().ref('images/' + winningPic).once('value').then(function(snapshot) {
                    window.url = snapshot.val()
                    var pic = document.createElement("img");
                    pic.setAttribute("class", "winnerPicture");
                    pic.setAttribute("src", snapshot.val().url);
                    pic.setAttribute('alt', winningPic);
                    
                    var elem = document.createElement("div");
                    elem.setAttribute('height', '200px');
                    elem.setAttribute('width', '200px');
                    elem.setAttribute("class", "grid-item");
                    elem.appendChild(pic);
                    document.getElementById("winner").appendChild(elem);
                });    
            }
                    
         }.bind(this));

    }

    //gets this rounds caption and appends it to the current page
    getRoundCaption(){
        firebase.database().ref('game-session/' +  this.state.dbKey +'/round/' + this.state.round+'/submissions/promptID').once('value').then(function(snapshot){
            var index = snapshot.val();
            firebase.database().ref('captions/'+index).once('value').then(function(snapshot){
                window.caption = snapshot.val().caption;
                document.getElementById('caption').innerHTML = snapshot.val().caption;    
            });
        }); 
    }

    //need a score function 
    //
    //
    //
    //
    //
    //
    //

    
    waiting(){
        console.log("update occured");

    }

    waitForAllSubmitted(){
        firebase.database().ref('game-session/' +  this.state.dbKey +'/round/' + this.state.round+'/submissions/voting/numVoted/').on('value', snapshot => {
            var currentAmountofSubmissions = snapshot.val();
            firebase.database().ref('game-session/' + this.state.dbKey).once('value').then(function(snap){
                //console.log(snap.val().numberPlayers);
                //console.log("current amount submit: " + currentAmountofSubmissions + "|number players: " + snap.val().numberPlayers)
                if(currentAmountofSubmissions >= snap.val().numberPlayers)
                {
                    this.setState({allSubmitted: true});
                    //console.log("all submitted");
                    var win = {
                        winner : this.state.winningIndex
                    }
                    //console.log(win);
                    firebase.database().ref('game-session/' +  this.state.dbKey +'/round/' + this.state.round+'/submissions/').update(win);
                    if(this.state.allSubmitted === true && this.state.init === 1)
                    {
                        this.getSubmittedImages();
                        this.setState({init: 0});
                        //this.updateRoundNumber();
                        //this.setState({nextRoundReady: true});
                    }
                }
                if(this.state.numberOfPlayers !== snapshot.val().numberOfPlayers){
                    this.setState({numberOfPlayers: snapshot.val().numberPlayers});
                }
            }.bind(this));

        }); 
    }

    updateRoundNumber(){
        console.log("username : " + this.state.username);
        firebase.database().ref('game-session/' + this.state.dbKey).once('value').then(function(snap){
            if(snap.val().currentRoundNumber >= snap.val().numberRounds)
            {
                this.setState({endGame: true});
            }

            if(this.state.username == 1 && this.state.changedRound == false && this.state.endGame == false)
            {
                console.log(snap.val().currentRoundNumber);
                //SHOULD ONLY UPDATE VALUE ONCE, YET KEEPS SAYING ROUND 3 FUCK THIS SHIT BULLSHIT
                var round =  parseInt(snap.val().currentRoundNumber) + 1;
                var nextRound = {
                    currentRoundNumber: 2
                }
                firebase.database().ref('game-session/' +  this.state.dbKey).update(nextRound);
                this.setState({changedRound: true});
                console.log(nextRound);
            }

            this.setState({nextRoundReady: true});

        }.bind(this));
        
        
    }

    getNumberOfPlayers(){
        firebase.database().ref('game-session/' + this.state.dbKey).once('value').then(function(snapshot){
            console.log(snapshot.val().numberPlayers);
            if(this.state.numberOfPlayers != snapshot.val().numberOfPlayers){
                this.setState({numberOfPlayers: snapshot.val().numberPlayers});
            }
        }.bind(this));

    }

    
    componentDidMount(){
  

        
        window.addEventListener('load',this.updateRoundNumber());

        window.addEventListener('load',this.waitForAllSubmitted());

        
    }
    componentWillMount(){
        var pathname = window.location.pathname.split('/');
        this.setState({username: pathname[2]});
        this.setState({dbKey: pathname[3]});
        this.getNumberOfPlayers();
    }


    componentDidUpdate(){
        this.waiting();

        //this.getNumberOfPlayers();

    }
    test(){
        console.log("#players: " + this.state.numberOfPlayers);
        console.log("allsubmitted: " + this.state.allSubmitted); 
    }
    
    render() {


        var gameLink = "/game/" + this.state.username + "/" + this.state.dbKey ;

        return (
            <div>
                <div>
                <Link to="/">
                    <Button id="exit">Exit Game</Button>
                </Link>   
                </div>
                <header>
                    Round {this.state.round} Winner
                </header>
        
                <div className="gameInfo"><h2>Your Score: 0</h2></div>
                <div className="container">

                    <div className="caption" id="caption">
                    {this.state.allSubmitted ? null :<h4>*Waiting on other players...*</h4>}
                    </div>

                    <div className="grid" id="winner">
                       </div>  
                       {this.state.nextRoundReady ?
                        <Link to={gameLink}><Button >Go To Next Round</Button></Link>:null
                    }
            </div>
            </div>
        );
      }
    }
export default Winning;
