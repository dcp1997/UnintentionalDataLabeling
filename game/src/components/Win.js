import React, { Component } from 'react';
import firebase from '../firebase'
import { storage } from 'firebase';
import Button from 'react-bootstrap/Button'
import { Route, Link, BrowserRouter as Router } from 'react-router-dom';




class Winning extends Component {

    getWinningImage(){

        this.getRoundCaption()
        firebase.database().ref('game-session/oneGame/round/1/submissions/winner').once('value').then(function(snapshot){
            console.log(snapshot)
            console.log(parseInt(snapshot.val()))
            var winningPic = parseInt(snapshot.val())
            console.log(winningPic)
            firebase.database().ref('images/' + winningPic).once('value').then(function(snapshot) {
                console.log(snapshot.val().url)
                window.url = snapshot.val().url
                var pic = document.createElement("img");
                pic.setAttribute("class", "randomPictures");
                pic.setAttribute("src", snapshot.val().url)
                pic.setAttribute('alt', winningPic);
                
                var elem = document.createElement("div")
                elem.setAttribute('height', '200px')
                elem.setAttribute('width', '200px')
                elem.setAttribute("class", "grid-item");
                elem.appendChild(pic);
                document.getElementById("grid").appendChild(elem)

            });               
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

    getScore(){
        
        firebase.database().ref('game-session/oneGame/players/1/score').once('value').then(function(snapshot){
            console.log(snapshot.val());
            
            document.getElementById('winScore').innerHTML = "Your Score: " + snapshot.val()
            
         });
    }

    componentDidMount(){
        window.addEventListener('load', this.getWinningImage());
        }

    render() { 
        return   (
            <div>
                <div>
                <Link to="/">
                    <Button id="exit">Exit Game</Button>
                </Link>   
                </div>
                <header>
                    Round 1 Winner
                </header>
                <div className="gameInfo"><h2 id = "winScore">{this.getScore()}</h2></div>
                <div className="container">

                    <div className="caption" id="caption">
                    </div>

                    <div className="grid" id="grid">
                       </div>  
            </div>
            </div>
        );
            


    }
}
export default Winning;