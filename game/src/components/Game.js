import React, { Component } from 'react';
import '../App.css';
import firebase from '../firebase'
import { storage } from 'firebase';
import Button from 'react-bootstrap/Button';
import { Route, Link, BrowserRouter as Router } from 'react-router-dom';

class Game extends Component{

    constructor(props) {
        super(props);
    
        this.state = {
          username: "",
          dbKey: "",
          round: "",
          submittedImage: "",
          selected: false,
          Score: 0
        };

        this.submitImage = this.submitImage.bind(this);
      }

      readDB(){
        firebase.database().ref('game-session/' +  this.state.dbKey).once('value').then(function(snapshot){
            console.log("current round: " + snapshot.val().currentRoundNumber);
            this.setState({round: snapshot.val().currentRoundNumber});
            console.log("inside readDB 1: " + this.state.round);
        }.bind(this));


        console.log("inside readDB 2: " + this.state.round);


        var clicks = [0, 0, 0, 0];
        this.appendCaption();
        var game = this;
        return firebase.database().ref(`game-session/` +  this.state.dbKey +`/round/` + this.state.round+`/hand/`+this.state.username).once('value').then(function(snapshot)
        {
                    console.log(game);
                    game.appendImage(snapshot.child(`tile1`).val(), 0, clicks);
                    game.appendImage(snapshot.child(`tile2`).val(), 1, clicks);
                    game.appendImage(snapshot.child(`tile3`).val(), 2, clicks);
                    game.appendImage(snapshot.child(`tile4`).val(), 3, clicks);
                
        });
    }

    
    
      appendImage(index, currentCardNumber, clicks)
    {

        // var pictureURL;
        
        return firebase.database().ref('images/' + index).once('value').then(function(snapshot) {
          //pictureURL = (snapshot.val().url);
          console.log("Image Url: " + snapshot.val().url)
          window.url = snapshot.val().url
          var pic = document.createElement("img");
          pic.setAttribute("class", "randomPictures");
          pic.setAttribute("src", snapshot.val().url);
          pic.setAttribute('id', "img"+currentCardNumber)
          pic.setAttribute('alt', index);
          
          var elem = document.createElement("div")
          elem.setAttribute('height', '200px')
          elem.setAttribute('width', '200px')
          elem.setAttribute("class", "grid-item");
          elem.setAttribute('id', currentCardNumber)
          elem.appendChild(pic);
          document.getElementById("grid").appendChild(elem);

          elem.addEventListener('click', function(e) {
            let imageIndex = document.getElementById('img'+currentCardNumber).getAttribute('alt'); 
        
      

            //meaning the card selected has not been clicked
            if (clicks[currentCardNumber] === 0){

                elem.style.border = "solid";
                elem.style.borderColor = "#17C490";
                this.setState({submittedImage: imageIndex, selected: true});
                
                //all other images lose their borders
                for(var l=0; l<clicks.length; l++){
                    if(clicks[l]===1){
                         document.getElementById(l).style.border = 'none';
                         clicks[l]--;
                    }
                }
                clicks[currentCardNumber]++;

            }
            else if (clicks[currentCardNumber]=== 1){
                elem.style.border = 'none';
                clicks[currentCardNumber]--;
                this.setState({selected:false});
            }
            
        }.bind(this));     
       }.bind(this));

    }  

    //TODO
    submitImage(){
        console.log(this.state.submittedImage);
        //updates db with players submitted image index, this.state.username is actually the users id key 
        firebase.database().ref('game-session/'+  this.state.dbKey +'/round/'+ this.state.round +'/submissions/players/' + this.state.username + '/playerSubmission').update({
            submissionID: this.state.submittedImage
        });

        //updates round with the amount of submitted images
        firebase.database().ref('game-session/'+  this.state.dbKey +'/round/'+ this.state.round +'/submissions/submittedAmount/').once('value').then(function(snapshot){
            console.log("current submitted amount: " + snapshot.val());
            firebase.database().ref('game-session/'+  this.state.dbKey +'/round/'+ this.state.round +'/submissions/').update({
                submittedAmount: snapshot.val() + 1
            });
        }.bind(this));
    }

    //grabs the index of the caption for the current round.
    appendCaption(){
        console.log("round: " + this.state.round);
        firebase.database().ref('game-session/' +  this.state.dbKey +'/round/' + this.state.round +'/submissions/promptID').once('value').then(function(snapshot){
            console.log("Caption Index: " + snapshot.val());
            return firebase.database().ref('captions/'+snapshot.val()).once('value').then(function(snap){
                window.caption = snap.val().caption
                document.getElementById('caption').innerHTML = snap.val().caption 
            })
        })
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
    
    componentDidMount(){
        this.getCurrentRound();
        console.log(this.state.username);
        window.addEventListener('load', this.readDB());
        
    }
    componentWillMount(){
        var pathname = window.location.pathname.split('/');
        this.state.username = pathname[2];
        this.state.dbKey = pathname[3];
        this.state.round = pathname[4];


        this.getCurrentRound();
    }

    getCurrentRound(){
        firebase.database().ref('game-session/' +  this.state.dbKey).once('value').then(function(snapshot){
            console.log("current round: " + snapshot.val().currentRoundNumber);
            this.setState({round: snapshot.val().currentRoundNumber});
        }.bind(this));
    }
    

    
    render() {


        var voteLink = "/vote/" + this.state.username + "/" + this.state.dbKey + "/" + this.state.round;

        return (
            <div>
                <header class='icon'>
                    <div>
                    <Link to="/">
                        <i class="fas fa-sign-out-alt fa-xs"></i>
                    </Link>   
                    </div>
                </header>
                <header>
                    Round {this.state.round}
                </header>
                <div className="gameInfo" id = "score"><h2>Your Score: 0</h2></div>
                <div className="container">

                    <div className="caption" id="caption">
                    </div>

                    <div className="grid" id="grid">

                       </div> 

                       {this.state.selected ?
                         <Link to={voteLink}>
                         <Button id="Submit" onClick={this.submitImage}>Submit</Button>
                            </Link>   :null
                        }
                   
            </div>
        </div>
        );
      }
    }
export default Game;
