import React, { Component } from 'react';
import '../App.css';
import firebase from '../firebase'
import { storage } from 'firebase';
import Button from 'react-bootstrap/Button';
import { Route, Link, BrowserRouter as Router } from 'react-router-dom';

class Game extends Component{



    readDB(){
        var clicks = [0, 0, 0, 0];
        this.appendCaption()
        for(var i = 0; i < 4; i++){
            var randomIndex = this.getRandomInt(0,833);
            this.appendImage(randomIndex, i, clicks);
        };
        
        
    }
    
    //TODO: need to put caption indexes for each round in the init in setup, then this function will just pull that out from the correct gamecode
    appendCaption(){
        var randomIndex = this.getRandomInt(1,27);
        return firebase.database().ref('captions/'+randomIndex).once('value').then(function(snapshot){
            console.log("Caption Index: " + randomIndex);
            window.caption = snapshot.val().caption
            document.getElementById('caption').innerHTML = snapshot.val().caption
            //when not hardcoding we will have to replace "oneGame" with the sessionID
            //also will have to keep trak of the round number so it is not 1 each time
            firebase.database().ref('game-session/oneGame/round/1/submissions/').update({
                promptID: randomIndex,
                });
            
        })
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
          document.getElementById("grid").appendChild(elem)
          elem.addEventListener('click', function(){
            console.log(document.getElementById('img'+currentCardNumber).getAttribute('alt'));
            let imageNumber = document.getElementById('img'+currentCardNumber).getAttribute('alt')
            if (clicks[currentCardNumber] === 0){
                console.log(clicks[currentCardNumber])
                //this makes it so that if you click a picture it submits it and over writes if you click another picture
                //so when you click submit all it does is go to the voting page and the submit button does not really 
                //push anything to the database in a submission way
                //the voting page will grab the images from the database 
                //currently this is hard coded so we have to make the "oneGame" and actual dynamic sessionID
                //and make the username and the child dynamic as well
                firebase.database().ref('game-session/oneGame/round/1/submissions/players/').child(1).update({
                    nickname: "Alex",
                    submissionID: {imageNumber},
                    });
                this.style.border = "solid";
                this.style.borderColor = "#17C490";
                for(var l=0; l<clicks.length; l++){
                    if(clicks[l]===1){
                         document.getElementById(l).style.border = 'none';
                         clicks[l]--;
                    }
                }
                clicks[currentCardNumber]++;

            }
            else if (clicks[currentCardNumber]=== 1){
                
                
                console.log(clicks[currentCardNumber])
                this.style.border = 'none';
                clicks[currentCardNumber]--;
            }
            
        })     
       });

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
        return (
            <div>
                <div>
                <Link to="/">
                    <Button id="exit">Exit Game</Button>
                </Link>   
                </div>
                <header>
                    Round 1 
                </header>
                <div className="gameInfo"><h2>Your Score: 0</h2></div>
                <div className="container">

                    <div className="caption" id="caption">
                    </div>

                    <div className="grid" id="grid">
                       </div> 
                    <Link to="/vote">
                    <Button id="Submit">Submit</Button>
                </Link>  
            </div>
            </div>
        );
      }
    }
export default Game;
