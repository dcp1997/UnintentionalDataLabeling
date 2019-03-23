import React, { Component } from 'react';
import firebase from '../firebase'
import { storage } from 'firebase';




class Game extends Component {

    initNewGame(hostPlayerID)
    {
        firebase.database().ref('Games/').push({
            Players:
            {
                
                
            }
        }).then((snap) => {
            const key = snap.key;
            console.log(key);
            return key;
         }); 
    }

    test()
    {

    }

    formNewHand(playerID)
    {
        firebase.database().ref('PlayerHand/'+playerID).remove();
        for(var i = 0; i < 5; i++){
            var randomIndex = this.getRandomInt(0,833);
            firebase.database().ref('images/' + randomIndex).once('value').then(function(snapshot) {
                console.log(snapshot.val().url);
                firebase.database().ref('PlayerHand/'+playerID).push({
                        url:snapshot.val().url
                });
             });
               
        }
    }


    
    submitCard(cardGuid)
    {

    }

    getRandomInt(min, max) 
    {
        min = Math.ceil(min);
        max = Math.floor(max);
        return Math.floor(Math.random() * (max - min + 1)) + min;
    }


    render() { 
        return   (
            <div>
        <button onClick={ () => this.formNewHand("guid")}>
        Get Random Images
        </button>
        <button onClick={ () => this.initNewGame("guid")}>
        Make new Game
        </button>
        <button onClick={ () => this.test()}>
        test
        </button>
        </div>


        );
    }

    createNewGameEntry(){
        
    }
}
 
export default Game;