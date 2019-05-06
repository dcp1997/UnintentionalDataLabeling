import React, { Component } from 'react';
import '../App.css';
import firebase from '../firebase'
import Button from 'react-bootstrap/Button';
import { Route, Link, BrowserRouter as Router } from 'react-router-dom';

class Winning extends Component{

    constructor(props) {
        super(props);
    
        this.state = {
          username: "",
          dbKey: "",
          round:"",
          allSubmitted: false,
          winnerFound: false,
          numberOfPlayers: 3,
          init: 1,
          voteImage: 0,
          winningIndex: "",
          nextRoundReady: false, 
          endGame: false,
          totalRounds: "", //hardcoded rn
          totalRoundsUpdated:false
          
        };
        this.test = this.test.bind(this);
        this.getSubmittedImages = this.getSubmittedImages.bind(this);
      }


    getSubmittedImages(){

        this.getRoundCaption()
        var playersVoted = 0;
        var winningPic = 0;
    

        firebase.database().ref('game-session/' + this.state.dbKey).once('value').then(function(snap){
            var playerNumber = snap.val().numberPlayers;

            firebase.database().ref('game-session/'+ this.state.dbKey +'/round/'+ this.state.round+'/submissions/voting/').once('value').then(function(snapshot){
                playersVoted = snapshot.val().numVoted
                var winArray = new Array(playerNumber); 
                var i = 0;
                if(playerNumber == playersVoted){
                    snapshot.forEach(child => {
                        const indexofPic = parseInt(child.val().ballot);
                        if(i != playerNumber){
                            winArray[i] = indexofPic;
                        }
                        i++;
                    });
                }

                function mode(arr){
                    return arr.sort((a,b) =>
                        arr.filter(v => v===a).length
                        - arr.filter(v => v===b).length
                    ).pop();
                }
                winningPic = mode(winArray);
                
                var winner = {"winner": winningPic}
                firebase.database().ref('game-session/'+ this.state.dbKey +'/round/'+this.state.round + '/submissions/').update(winner)
                
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

                        var query = firebase.database().ref('/game-session/'+ this.state.dbKey + '/round/'+ this.state.round + '/submissions/players').orderByKey();
                        query.once('value').then(function (snap){
                            snap.forEach(child =>{
                                if(child.val().playerSubmission.submissionID == winningPic)
                                {
                                    var winDiv = document.createElement("div");
                                    winDiv.setAttribute("class", "winningUser");

                                    var winningUser = document.createTextNode("Player: " + child.val().playerSubmission.nickname);   
                                    winDiv.appendChild(winningUser);
                                    elem.appendChild(winDiv);
                                }
                            });
                        });
                       

                    }.bind(this));
                    
                    

            
                
                }
                        
            }.bind(this));

        }.bind(this));

        this.setState({winnerFound: true});

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
        
        firebase.database().ref('game-session/'+ this.state.dbKey +'/players/'+ this.state.username + '/score/').once('value').then(function(snapshot){
            var currentScore = parseInt(snapshot.val());
            document.getElementById("score").innerHTML = "Score: " + currentScore;
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

    addWinScore(){
        
        var winPic
        firebase.database().ref('game-session/'+ this.state.dbKey +'/round/'+this.state.round+'/submissions/winner/').once('value').then(function(snapshot){
            winPic = snapshot.val();

       
         firebase.database().ref('game-session/'+ this.state.dbKey +'/round/'+ this.state.round+'/submissions/players/').once('value').then(function(snapshot){
            
            var i = 0
            snapshot.forEach(function(childSnapshot) {
                i++

                var indexofPic = parseInt(childSnapshot.val().playerSubmission.submissionID);
                console.log(indexofPic)
                var nickname = childSnapshot.val().playerSubmission.nickname;
                console.log(nickname)
                if(indexofPic === this.state.winningIndex){
                    console.log(nickname)
                    firebase.database().ref('game-session/'+ this.state.dbKey +'/players/'+ childSnapshot.key + '/score/').once('value').then(function(snapshot){
                            var currentScore = parseInt(snapshot.val())
                            console.log(" currecnt score:"+ currentScore)
                            var updateScore = currentScore + 1
                            console.log(updateScore)
                            var upscore = {"score": updateScore}
                            firebase.database().ref('game-session/'+ this.state.dbKey +'/players/'+childSnapshot.key).update(upscore)
                       
                    }.bind(this)); 
                }
            }.bind(this));       
        }.bind(this));
           
        }.bind(this)) 
    }

    waitForAllSubmitted(){
        firebase.database().ref('game-session/' +  this.state.dbKey +'/round/' + this.state.round+'/submissions/voting/numVoted/').on('value', snapshot => {
            var currentAmountofSubmissions = snapshot.val();
            firebase.database().ref('game-session/' + this.state.dbKey).once('value').then(function(snap){

                if(currentAmountofSubmissions >= snap.val().numberPlayers)
                {
                    this.setState({allSubmitted: true});
                    this.setState({winnerFound: false})
                    //this should be setting the winner        
                    
                }
            }.bind(this));

        }); 
    }

    
    componentDidMount(){
  
        this.waitForAllSubmitted();

        console.log("dbkey " + this.state.dbKey);
        firebase.database().ref('game-session/'+ this.state.dbKey +'/numberRounds/').once('value').then(function(snapshot){
            console.log("orig totalRounds " + snapshot.val());
            this.setState({totalRounds: snapshot.val()});
            this.setState({totalRoundsUpdated: true});
            }.bind(this));
    }
    componentWillMount(){
        var pathname = window.location.pathname.split('/');
        this.setState({username: pathname[2]});
        this.setState({dbKey: pathname[3]});
        this.setState({round: pathname[4]});

        
    }


    componentDidUpdate(){
        //this.waitForAllSubmitted();

        if(this.state.allSubmitted === true && this.state.init === 1)
        {
            this.getSubmittedImages();
            this.setState({init: 0});
           
        }
        if(this.state.winnerFound){
            this.addWinScore();
            this.setState({winnerFound: false});
        }
        this.nextRoundHelper();

    }

    nextRoundHelper(){
        if(this.state.totalRoundsUpdated === true)
        {

            var newRound = parseInt(this.state.round) + 1;
            if(newRound > this.state.totalRounds)
            {
                this.setState({endGame:true});
                this.setState({nextRoundReady:false});
            }
            else
            {
                this.setState({nextRoundReady:true});
            }

            this.setState({totalRoundsUpdated:false});
        }

    }
    test(){
        console.log("allsubmitted: " + this.state.allSubmitted); 
    }
    
    render() {

        var endGame = this.state.endGame;
        var nextRound = this.state.nextRoundReady;
        var nextRoundValue = parseInt(this.state.round) + 1;

        var gameLink = "/game/" + this.state.username + "/" + this.state.dbKey + "/" + nextRoundValue;
        var endGameLink = "/final/" + this.state.username + "/" + this.state.dbKey

        return (
            <div>
                <header id="win" class='icon'>
                    <div>
                    <Link to="/">
                        <i class="fas fa-sign-out-alt fa-xs"></i>
                    </Link>   
                    </div>
                </header>
                <header id="win">
                    Round {this.state.round} Winner
                </header>
        
                <div className="gameInfo" id = "score"><h2>Your Score: 0</h2></div>
                <div className="container">

                    <div className="caption" id="caption">
                    {this.state.allSubmitted ? null :<h4>*Waiting on other players...*</h4>}
                    </div>
                    <div class="grid-container">
                    <div className="grid" id="winner">
                    </div>  
                    </div>
                    <div id="center">
                       {nextRound ?
                        <Link to={gameLink}><Button >Next Round</Button></Link>:null
                    }
                    {
                        endGame ?
                        <Link to={endGameLink}><Button >Final Scores</Button></Link>:null
                    }
                    </div>
            </div>
            </div>
        );
      }
    }
export default Winning;
