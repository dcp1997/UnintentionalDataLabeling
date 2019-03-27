import React, { Component } from 'react';
import '../App.css';
import firebase from '../firebase'
import { storage } from 'firebase';
import Button from 'react-bootstrap/Button';
import { Route, Link, BrowserRouter as Router } from 'react-router-dom';

class Voting extends Component{



    getSubmittedImages(){

        var clicks = [0, 0, 0, 0];
        this.getRoundCaption()
        var currentCardNumber = 0;
        var query = firebase.database().ref("game-session/oneGame/round/1/submissions/players").orderByKey();
        query.once("value").then(function (snapshot) {
            snapshot.forEach(child => {
            console.log(child.val().submissionID.imageNumber);
            const index = parseInt(child.val().submissionID.imageNumber);
                
            firebase.database().ref('images/' + index).once('value').then(function(snapshot) {
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
                //we really need to rethink how we do this in the database
                //we need to store what each person votes for and then choose the pic with the most votes
                //right now we are only hardcoding what the image that we are voting for is and setting that as the winner
                elem.addEventListener('click', function(){
                    console.log(document.getElementById('img'+currentCardNumber).getAttribute('alt'));
                    let imageNumber = document.getElementById('img'+currentCardNumber).getAttribute('alt')
                    if (clicks[currentCardNumber] === 0){
                        console.log(clicks[currentCardNumber])
                        firebase.database().ref('game-session/oneGame/round/1/submissions/').update({
                            winner: imageNumber,
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
            //     elem.addEventListener('click', function(){
            //       console.log("wtf" + document.getElementById('img'+currentCardNumber).getAttribute('alt'));
            //       if (clicks[currentCardNumber] === 0){
            //           this.style.border = "solid";
            //           this.style.borderColor = "#17C490";
            //           for(var l=0; l<clicks.length; l++){
            //               if(clicks[l]===1){
            //                   document.getElementById(l).style.border = 'none';
            //                   clicks[l]--;
            //               }
            //           }
            //           clicks[currentCardNumber]++;
      
            //       }
            //       else if (clicks[currentCardNumber]=== 1){
            //           console.log(clicks[currentCardNumber])
            //           this.style.border = 'none';
            //           clicks[currentCardNumber]--;
            //       }
                  
            //   })
             });
      
            });
            currentCardNumber++;
        });
            
        
    }
    getRoundCaption(){

        firebase.database().ref('game-session/oneGame/round/1/submissions/promptID').once('value').then(function(snapshot){
            console.log(snapshot.val());
            var index = snapshot.val();
            firebase.database().ref('captions/'+index).once('value').then(function(snapshot){
                console.log(snapshot);
                console.log(snapshot.val());
                console.log(snapshot.val().caption);
                window.caption = snapshot.val().caption
                document.getElementById('caption').innerHTML = snapshot.val().caption
                
        });
      
        })
    }
    


    getRandomInt(min, max) 
    {
        min = Math.ceil(min);
        max = Math.floor(max);
        return Math.floor(Math.random() * (max - min + 1)) + min;
    }
    
    componentDidMount(){
        window.addEventListener('load', this.getSubmittedImages());
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
                    Round 1 Voting
                </header>
                <div className="gameInfo"><h2>Your Score: 0</h2></div>
                <div className="container">

                    <div className="caption" id="caption">
                    </div>

                    <div className="grid" id="grid">
                       </div> 
                    <Link to="/win">
                    <Button id="Submit">Submit</Button>
                </Link>  
            </div>
            </div>
        );
      }
    }
export default Voting;
