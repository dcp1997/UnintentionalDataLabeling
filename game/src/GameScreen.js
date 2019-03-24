import React, { Component } from 'react';
import './App.css';
import firebase from './firebase'
import { storage } from 'firebase';

class App extends Component{
    readDB(){
        for(var i = 0; i < 4; i++){
            var randomIndex = this.getRandomInt(0,833);
            this.appendImage(randomIndex, i);     
        };
    }
      appendImage(index, currentCardNumber)
    {
        // var pictureURL;

        return firebase.database().ref('images/' + index).once('value').then(function(snapshot) {
          //pictureURL = (snapshot.val().url);
          console.log(snapshot.val().url)
          window.url = snapshot.val().url
          var elem = document.createElement("div")
          elem.setAttribute('height', '300px')
          elem.setAttribute('width', '300px')
          elem.setAttribute("class", "grid-item");
          elem.setAttribute('id', currentCardNumber)
          document.getElementById("grid").appendChild(elem)
          var pic = document.createElement("img");
          pic.setAttribute("class", "randomPictures");
          pic.setAttribute("src", snapshot.val().url);
          document.getElementById(currentCardNumber).appendChild(pic);
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
                    <button id="exit"  onclick="window.location.href = 'index.html';">Exit Game</button>
                </div>
                <header>
                    Round 1
                </header>
                <div class="gameInfo"><h2>Your Score: 0</h2></div>
                <div class="container">

                    <div class="caption">
                        I don’t get paid enough for this
                    </div>

                    <div class="grid" id="grid">
                        
                    </div>
                    <button class = "gameOption" onclick="window.location.href = 'vote.html';">Submit</button>
                </div>
            </div>
        );
      }
    }
export default App;
