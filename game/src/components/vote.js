import React, { Component } from 'react';
import '../App.css';
import firebase from '../firebase'
import { storage } from 'firebase';
import Button from 'react-bootstrap/Button';
import { Route, Link, BrowserRouter as Router } from 'react-router-dom';

class Voting extends Component{

    constructor(props) {
        super(props);
    
        this.state = {
          username: "",
          dbKey: "",
          round:1,
          allSubmitted: false,
          numberOfPlayers: 3,
          init: 1,
          voteImage: 0
        };
        this.test = this.test.bind(this);
        this.getSubmittedImages = this.getSubmittedImages.bind(this);
      }


    getSubmittedImages(){
        
        var gc = this.state.dbKey
        var usern = this.state.username;
        var clicks = [0, 0, 0, 0];
        this.getRoundCaption();
        var currentCardNumber = 0;
        
        var query = firebase.database().ref("game-session/"+ this.state.dbKey +"/round/" + this.state.round +"/submissions/players").orderByKey();
        query.once("value").then(function (snapshot) {
            snapshot.forEach(child => {
            const index = parseInt(child.val().playerSubmission.submissionID);
            
            firebase.database().ref('images/' + index).once('value').then(function(snapshot) {
                
                window.url = snapshot.val().url
                var pic = document.createElement("img");
                pic.setAttribute("class", "randomPictures");
                pic.setAttribute("src", snapshot.val().url);
                pic.setAttribute('id', "img"+currentCardNumber)
                pic.setAttribute('alt', index);
                
                var elem = document.createElement("div");
                elem.setAttribute('height', '200px');
                elem.setAttribute('width', '200px');
                elem.setAttribute("class", "grid-item");
                elem.setAttribute('id', currentCardNumber);
                elem.appendChild(pic);
                document.getElementById("grid").appendChild(elem);
                //we really need to rethink how we do this in the database
                //we need to store what each person votes for and then choose the pic with the most votes
                //right now we are only hardcoding what the image that we are voting for is and setting that as the winner
                elem.addEventListener('click', function(e) {
                    //let imageIndex = document.getElementById('img'+currentCardNumber).getAttribute('alt');       
        
                    //meaning the card selected has not been clicked
                    if (clicks[currentCardNumber] === 0){
        
                        elem.style.border = "solid";
                        elem.style.borderColor = "#17C490";
                        //all other images lose their borders
                        for(var l=0; l<clicks.length; l++){
                            if(clicks[l]===1){
                                 document.getElementById(l).style.border = 'none';
                                 clicks[l]--;
                            }
                        }
                        clicks[currentCardNumber]++;
                        console.log(gc)
                        //updates db with players submitted image index, this.state.username is actually the users id key 
                        firebase.database().ref('game-session/'+ gc +'/round/1/submissions/voting/'+ usern +"/" ).update({
                            ballot: index
                        });
                
                        //updates round with the amount of submitted images
                        firebase.database().ref('game-session/'+ gc +'/round/1/submissions/voting/numVoted/' ).once('value').then(function(snapshot){
                            console.log(snapshot.val())
                            firebase.database().ref('game-session/'+ gc +'/round/1/submissions/voting/').update({
                                numVoted: snapshot.val() + 1
                            });
                        })
                        
                        
        
                    }
                    else if (clicks[currentCardNumber]=== 1){
                        elem.style.border = 'none';
                        clicks[currentCardNumber]--;
                    }
                    
                })
             });
      
            });
            currentCardNumber++;
        });
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
                //console.log(snap.val().numberPlayers);
                //console.log("current amount submit: " + currentAmountofSubmissions + "|number players: " + snap.val().numberPlayers)
                if(currentAmountofSubmissions >= snap.val().numberPlayers)
                {
                    this.setState({allSubmitted: true});
                }
                if(this.state.numberOfPlayers != snapshot.val().numberOfPlayers){
                    this.setState({numberOfPlayers: snapshot.val().numberPlayers});
                }
            }.bind(this));

        }); 
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
        //window.addEventListener('load', this.getSubmittedImages());

        this.waitForAllSubmitted();
        
    }
    componentWillMount(){
        var pathname = window.location.pathname.split('/');
        this.setState({username: pathname[2]});
        this.setState({dbKey: pathname[3]});
        this.getNumberOfPlayers();
    }


    componentDidUpdate(){
        this.waitForAllSubmitted();
        if(this.state.allSubmitted === true && this.state.init === 1)
        {
            this.getSubmittedImages();
            this.setState({init: 0});
        }
        //this.getNumberOfPlayers();

    }
    test(){
        console.log("#players: " + this.state.numberOfPlayers);
        console.log("allsubmitted: " + this.state.allSubmitted); 
    }
    
    render() {


        var winLink = "/win/" + this.state.username + "/" + this.state.dbKey ;

        return (
            <div>
                <div>
                <Link to="/">
                    <Button id="exit">Exit Game</Button>
                </Link>   
                </div>
                <header>
                    Round {this.state.round} Voting
                </header>
        
                <div className="gameInfo"><h2>Your Score: 0</h2></div>
                <div className="container">

                    <div className="caption" id="caption">
                    {this.state.allSubmitted ? null :<h4>*Waiting on other players...*</h4>}
                    </div>

                    <div className="grid" id="grid">
                       </div> 
                    <Link to={winLink}>
                    <Button id="Submit">Submit</Button>
                </Link>  
            </div>
            </div>
        );
      }
    }
export default Voting;
