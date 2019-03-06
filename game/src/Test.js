import React, { Component } from 'react';
import './App.css';
import firebase from './firebase'


class App extends Component {

    readDB()
    {
        for(var i = 0; i < 4; i++)
        {
            var randomIndex = this.getRandomInt(0,833);
            this.appendImage(randomIndex, i);
        }
    }

    appendImage(index, currentCardNumber)
    {
        var ref = firebase.database().ref("images/"+ index);
        ref.on("value", function (snapshot) {
            console.log(snapshot.val().url);
            test = snapshot.val().url;
        }, function (error) {
            console.log("Error: " + error.code);
        });
        console.log(test);
    }

    getRandomInt(min, max) 
    {
        min = Math.ceil(min);
        max = Math.floor(max);
        return Math.floor(Math.random() * (max - min + 1)) + min;
    }

  render() {
    return (
        <div>

        <button onClick={ () => this.readDB()}>
            Get Random Images
        </button>
        <img src={this.test} />
        </div>
    );
  }
}

export default App;
