import React, { Component } from 'react';
import '../App.css';
import firebase from '../firebase'
import { storage } from 'firebase';
import Button from 'react-bootstrap/Button';
import { Route, Link, BrowserRouter as Router } from 'react-router-dom';

class Game extends Component{

    //can prob keep track of rounds in the url {^o^}
    constructor(props) {
        super(props);
    
        this.state = {
          username: "",
          dbKey: "",
          round: 1,
          submittedImage: "",
          selected: false
        };

        this.submitImage = this.submitImage.bind(this);
      }

    readDB(){
        var clicks = [0, 0, 0, 0];
        this.appendCaption();
        for(var i = 0; i < 4; i++){
            var randomIndex = this.getRandomInt(0,833);
            this.appendImage(randomIndex, i, clicks);
        };  
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
                this.setState({selected:false})
            }
            
        }.bind(this));     
       }.bind(this));

    }  

    //TODO
    submitImage(){
        console.log(this.state.submittedImage);
        //updates db with players submitted image index, this.state.username is actually the users id key 
        firebase.database().ref('game-session/'+  this.state.dbKey +'/round/'+ this.state.round +'/submissions/players/' + this.state.username).update({
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
        firebase.database().ref('game-session/' +  this.state.dbKey +'/round/' + this.state.round +'/submissions/promptID').once('value').then(function(snapshot){
            console.log("Caption Index: " + snapshot.val());
            return firebase.database().ref('captions/'+snapshot.val()).once('value').then(function(snap){
                window.caption = snap.val().caption
                document.getElementById('caption').innerHTML = snap.val().caption 
            })
        })
    }

    getRandomInt(min, max) 
    {
        min = Math.ceil(min);
        max = Math.floor(max);
        return Math.floor(Math.random() * (max - min + 1)) + min;
    }
    
    componentDidMount(){
        window.addEventListener('load', this.readDB());
    }
    

    
    render() {
        var pathname = window.location.pathname.split('/');
        this.state.username = pathname[2];
        this.state.dbKey = pathname[3];

        var voteLink = "/vote/" + this.state.username + "/" + this.state.dbKey ;

        return (
            <div>
                <div>
                <Link to="/">
                    <Button id="exit">Exit Game</Button>
                </Link>   
                </div>
                <header>
                    Round {this.state.round}
                </header>
                <div className="gameInfo"><h2>Your Score: 0</h2></div>
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
