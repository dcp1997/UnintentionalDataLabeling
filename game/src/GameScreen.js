import React, { Component } from 'react';
import './App.css';
import firebase from './firebase'
import { storage } from 'firebase';
import Button from 'react-bootstrap/Button';
import { Route, Link, BrowserRouter as Router } from 'react-router-dom';

class App extends Component{
    readDB(){
        this.appendCaption()
        for(var i = 0; i < 4; i++){
            var randomIndex = this.getRandomInt(0,833);
            this.appendImage(randomIndex, i);     
        };
    }
    appendCaption(){
        var randomIndex = this.getRandomInt(1,7);
        return firebase.database().ref('captions/'+randomIndex).once('value').then(function(snapshot){
            console.log(snapshot);
            console.log(snapshot.val());
            console.log(snapshot.val().caption);
            window.caption = snapshot.val().caption
            document.getElementById('caption').innerHTML = snapshot.val().caption
            
        })
    }
      appendImage(index, currentCardNumber)
    {
        // var pictureURL;

        return firebase.database().ref('images/' + index).once('value').then(function(snapshot) {
          //pictureURL = (snapshot.val().url);
          console.log(snapshot.val().url)
          window.url = snapshot.val().url
          var pic = document.createElement("img");
          pic.setAttribute("class", "randomPictures");
          pic.setAttribute("src", snapshot.val().url);
          var elem = document.createElement("div")
          elem.setAttribute('height', '300px')
          elem.setAttribute('width', '300px')
          elem.setAttribute("class", "grid-item");
          elem.setAttribute('id', currentCardNumber)
          elem.appendChild(pic);
          document.getElementById("grid").appendChild(elem)
          
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
                    <button className= "gameOption" onClick="window.location.href = 'vote.html';">Submit</button>
                </div>
            </div>
        );
      }
    }
export default App;
