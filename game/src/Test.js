import React, { Component } from 'react';
import './App.css';
import firebase from './firebase'

class App extends Component {

    

    appendImage()
    {
        var ref = firebase.database().ref("images/"+ 1);
        ref.on("value", function (snapshot) {
            console.log(snapshot.val());
        }, function (error) {
            console.log("Error: " + error.code);
        });
    }


  render() {
    return (
        <div>

        <button onClick={this.appendImage}>
            Get Random Images
        </button>
        </div>
    );
  }
}

export default App;
