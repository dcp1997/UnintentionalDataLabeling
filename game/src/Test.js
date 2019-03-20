import React, { Component } from 'react';
import './App.css';
import firebase from './firebase'
import { storage } from 'firebase';



class App extends Component {
    // constructor(props){
    //     super(props);
    //     const img0 = 'https://d3n8a8pro7vhmx.cloudfront.net/taxpayers/pages/679/attachments/original/1499663166/4-ways-cheer-up-depressed-cat.jpg?1499663166';
    //         this.state = {
    //             urlValue: '',
    //             pictures : [img0],
    //         };
    // }
    readDB()
    {
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
          var elem = document.createElement("img")
          elem.setAttribute("src", snapshot.val().url)
          elem.setAttribute("class", "random")
          document.getElementById("Pictures").appendChild(elem)
       });

    }  

    onClearArray = () => {
        //this.setState({ pictures: [] });
        var myNode = document.getElementById("Pictures");
        while (myNode.firstChild) {
        myNode.removeChild(myNode.firstChild);
        }
      };
    

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
        <button type="button" onClick={this.onClearArray}>
          Clear Pictures
        </button>
        <div className = "Pictures" id = "Pictures">
            {/* {this.state.pictures.map(image => (
                <img key = {image} src = {image} alt = "random"/>
        ))} */}
        
        </div>
        </div>
    );
  }
}

export default App;
