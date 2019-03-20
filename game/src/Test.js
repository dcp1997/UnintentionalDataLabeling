import React, { Component } from 'react';
import './App.css';
import firebase from './firebase'
import { storage } from 'firebase';



class App extends Component {
    constructor(props){
        super(props);
        const img0 = 'https://d3n8a8pro7vhmx.cloudfront.net/taxpayers/pages/679/attachments/original/1499663166/4-ways-cheer-up-depressed-cat.jpg?1499663166';
            this.state = {
                urlValue: '',
                pictures : [img0],
            };
    }
    readDB(){
       //let imageURL = 'https://d3n8a8pro7vhmx.cloudfront.net/taxpayers/pages/679/attachments/original/1499663166/4-ways-cheer-up-depressed-cat.jpg?1499663166';
        for(var i = 0; i < 4; i++){
            var randomIndex = this.getRandomInt(0,833);
            this.appendImage(randomIndex, i);
            
        };
        // return (
        //     <div>
        //     <img src = {imageURL} alt = "random"/>
        //     </div>
        // )
    }

    appendImage(index, currentCardNumber)
    {
        // var pictureURL;

        return firebase.database().ref('images/' + index).once('value').then(function(snapshot) {
          //pictureURL = (snapshot.val().url);
          console.log(snapshot.val().url)
          //window.url = snapshot.val().url
          var elem = document.createElement("img")
          elem.setAttribute("src", snapshot.val().url)
          document.getElementById("Pictures").appendChild(elem)
       });

    }


        
        // const addPicture = firebase.database().ref('images/' + index);
        // addPicture.on('value',
        // (snapshot) => {

        // },
        // (error) => {
        //     console.log("Error: " + error.code);
        // },
        // () => {
        //     storage.ref('images/' + index).val().then(url =>{
        //         console.log(url);
        //     })
        // });



        // var ref = firebase.database().ref("images/"+ index);
        // ref.on("value", function (snapshot) {
        //         console.log(snapshot.val().url)             
        //         var test = snapshot.val().url;
        //         if(test != null){
        //             this.addImage(test);
        //         }
                    
        //         //this.append(<img src = {test} alt = "random"/>);
                
            
    
        // }, function (error) {
        //     console.log("Error: " + error.code);
        // });
       

    

    addImage(url)
    {
        //console.log(url);
        this.setState({urlValue: url});
        this.setState(state =>{
            const pictures = state.pictures.concat(state.urlValue);
       
            return{
                pictures,
                urlValue: '',
            }
       
        });
        
    }

    onClearArray = () => {
        this.setState({ pictures: [] });
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
        <div class = "Pictures" id = "Pictures">
            {this.state.pictures.map(image => (
                <img key = {image} src = {image} alt = "random"/>
        ))}
        
        </div>
        </div>
    );
  }
}

export default App;
