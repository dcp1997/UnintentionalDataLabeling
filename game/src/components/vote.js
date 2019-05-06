import React, { Component } from 'react';
import '../App.css';
import firebase from '../firebase'
import Button from 'react-bootstrap/Button';
import { Route, Link, BrowserRouter as Router } from 'react-router-dom';

class Voting extends Component{


    constructor(props) {
        super(props);
    
        this.state = {
          username: "",
          dbKey: "",
          round:"",
          allSubmitted: false,
          init: 1,
          voteImage: 0,
          round: 1,
          selected: false,
          clicks: [0,0,0,0,0,0,0,0]
        };
        this.test = this.test.bind(this);
        this.getSubmittedImages = this.getSubmittedImages.bind(this);
        this.submitVote = this.submitVote.bind(this);
    }

    getSubmittedImages(){
        var clicks = [0,0,0,0,0,0,0];
        var gc = this.state.dbKey
        var usern = this.state.username;
        this.getRoundCaption();
        var currentCardNumber = 0;

        //current card number and clicks is hard coded
        
        var query = firebase.database().ref("game-session/"+ this.state.dbKey +"/round/" + this.state.round +"/submissions/players").orderByKey();
        query.once("value").then(function (snapshot) {
            snapshot.forEach(child => {
            const index = parseInt(child.val().playerSubmission.submissionID);
            
            firebase.database().ref('images/' + index).once('value').then(function(snapshot) {
                
                window.url = snapshot.val().url;
                var pic = document.createElement("img");
                pic.setAttribute("class", "randomPictures");
                pic.setAttribute("src", snapshot.val().url);
                pic.setAttribute('id', "img"+currentCardNumber);
                pic.setAttribute('alt', index);
                
                var elem = document.createElement("div");
                elem.setAttribute('height', '200px');
                elem.setAttribute('width', '200px');
                elem.setAttribute("class", "grid-item");
                elem.setAttribute('id', currentCardNumber);
                elem.appendChild(pic);
                document.getElementById("grid").appendChild(elem);
                elem.addEventListener('click', function(e) {
                    //let imageIndex = document.getElementById('img'+currentCardNumber).getAttribute('alt');       
        
                
    
                
                    //meaning the card selected has not been clicked
                    if (this.state.clicks[currentCardNumber] === 0){
        
                        elem.style.border = "solid";
                        elem.style.borderColor = "#17C490";
                        this.setState({voteImage: index});
                        this.setState({selected:true});

                        //all other images lose their borders
                        console.log(this.state.clicks);
                        console.log(currentCardNumber);
                        for(var l=0; l<this.state.clicks.length; l++){
                            if(this.state.clicks[l]===1){
                                 document.getElementById(l).style.border = 'none';
                                 clicks[l]--;
                                 console.log("here");
                            }
                        }
                        clicks[currentCardNumber]++;
                        console.log(clicks);
                    }
                    else if (this.state.clicks[currentCardNumber]=== 1){
                        elem.style.border = 'none';
                        clicks[currentCardNumber]--;
                        this.setState({selected:false});
                    }
                    
                }.bind(this));
             }.bind(this));
      
            });
            currentCardNumber++;
        }.bind(this));
    }

    submitVote(){

        firebase.database().ref('game-session/'+ this.state.dbKey +'/round/'+this.state.round +'/submissions/voting/'+ this.state.username +"/" ).update({
            ballot: this.state.voteImage
        });

        firebase.database().ref('game-session/' +  this.state.dbKey +'/round/' + this.state.round+'/submissions/promptID').once('value').then(function(snapshot){
            var capIndex = snapshot.val();
            firebase.database().ref('collectedData').push({
                imageIndex: this.state.voteImage,
                captionIndex: capIndex
            });
        }.bind(this));

        //updates round with the amount of submitted images
        firebase.database().ref('game-session/'+ this.state.dbKey +'/round/'+this.state.round +'/submissions/voting/numVoted/' ).once('value').then(function(snapshot){
            console.log(snapshot.val())
            firebase.database().ref('game-session/'+ this.state.dbKey +'/round/'+this.state.round +'/submissions/voting/').update({
                numVoted: snapshot.val() + 1
            });
        }.bind(this));
    }

    //gets this rounds caption and appends it to the current page
    getRoundCaption(){
        firebase.database().ref('game-session/' +  this.state.dbKey +'/round/' + this.state.round+'/submissions/promptID').once('value').then(function(snapshot){
            var index = snapshot.val();
            firebase.database().ref('captions/'+index).once('value').then(function(snapshot){
                window.caption = snapshot.val().caption
                document.getElementById('caption').innerHTML = snapshot.val().caption      
            });
        }); 
        firebase.database().ref('game-session/'+ this.state.dbKey +'/players/'+ this.state.username + '/score/').once('value').then(function(snapshot){
            var currentScore = parseInt(snapshot.val())
            document.getElementById("score").innerHTML = "Score: " + currentScore;
        })
    }

    getRandomInt(min, max) 
    {
        min = Math.ceil(min);
        max = Math.floor(max);
        return Math.floor(Math.random() * (max - min + 1)) + min;
    }

    waitForAllSubmitted(){
        firebase.database().ref('game-session/' +  this.state.dbKey +'/round/' + this.state.round+'/submissions/submittedAmount').on('value', snapshot => {
            var currentAmountofSubmissions = snapshot.val();
            firebase.database().ref('game-session/' + this.state.dbKey).once('value').then(function(snap){
                if(currentAmountofSubmissions >= snap.val().numberPlayers)
                {
                    this.setState({allSubmitted: true});
                }
            }.bind(this));

        }); 
    }

    componentDidMount(){
        //window.addEventListener('load', this.getSubmittedImages());
        this.waitForAllSubmitted(); 
    }

    componentWillMount(){
        var pathname = window.location.pathname.split('/');
        this.setState({username: pathname[2]});
        this.setState({dbKey: pathname[3]});
        this.setState({round: pathname[4]});
    }

    componentDidUpdate(){
        //this.waitForAllSubmitted();
        if(this.state.allSubmitted == true && this.state.init == 1)
        {
            this.getSubmittedImages();
            this.setState({init: 0});
        }
    }

    test(){
        console.log("allsubmitted: " + this.state.allSubmitted); 
    }
    
    render() {
        var winLink = "/win/" + this.state.username + "/" + this.state.dbKey + "/" + this.state.round;

        return (
            <div>
                <header id="vote" class='icon'>
                    <div>
                    <Link to="/">
                        <i class="fas fa-sign-out-alt fa-xs"></i>
                    </Link>   
                    </div>
                </header>
                <header id="vote">
                    Round {this.state.round} Voting
                </header>
        
                <div className="gameInfo" id = "score"><h2>Your Score: 0</h2></div>
                <div className="container">

                    <div className="caption" id="caption">
                    {this.state.allSubmitted ? null :<h4>*Waiting on other players...*</h4>}
                    </div>

                    <div className="grid" id="grid">
                       </div> 
                    <div id="center">
                       {this.state.selected ?
                    <Link to={winLink}>
                    <Button id="Submit"onClick={this.submitVote}>Submit</Button>
                    </Link> : null
                       } 
                    </div>
            </div>
            </div>
        );
      }
    }
export default Voting;
