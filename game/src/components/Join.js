import React, { Component } from 'react';
import firebase from '../firebase'
import Button from 'react-bootstrap/Button'
import { Route, Link, BrowserRouter as Router } from 'react-router-dom';


class Join extends Component {
    
    constructor(props)
    {
        super(props);

        this.state = {
            userName:'',
            gameCode: '',
            showStart: false,
            showSubmit: true,
            userKey: '2'
        }
                
        this.updateUserName = this.updateUserName.bind(this);
        this.updateGameCode = this.updateGameCode.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
    }

    updateGameCode(event) {
        this.setState({gameCode: event.target.value});
    }

    updateUserName(event)
    {
        this.setState({userName: event.target.value})
    }

    handleSubmit()
    {   
        var gc = this.state.gameCode;
        var user = this.state.userName;
        var maxPlayers = 0;
        var current = 0;
        firebase.database().ref('game-session/' + gc + '/numberPlayers').once('value', function(snapshot) {
            maxPlayers = snapshot.val()
        });
        if (gc!=null && user!=null){
            firebase.database().ref('game-session/' + gc + '/players').once('value', function(snapshot) {
                if (snapshot.numChildren()<maxPlayers){ 
                   firebase.database().ref('game-session/' + gc + '/players').child(snapshot.numChildren()+1).update({
                       nickname : user,
                       powerups : 0,
                       score : 0
                       }).then((snap) => {
                         //   console.log(snap);
                        //    this.state.userKey = snap.key;
                        //trying to find a way to log the userKey, as in the number associated with this user in the db
                        alert("You have been added to this game."); 
                     });
               } else {
                   alert("You cannot join this game")
                    
               }  
           })
            firebase.database().ref('game-session/' + gc + '/players').once('value', function(snapshot) {
            }).then((snapshot)=>{
                current = snapshot.numChildren();
                if (current!=0){
                    this.setState({showStart: true});  
                    this.setState({showSubmit:false});
                }
            });
           
        }
    }

    render() { 
        var lobbyLink = "/lobby/" + this.state.userKey + "/" + this.state.gameCode ;

        return   (
            <div>
                <div>
                <Link to="/">
                    <Button id="exit">Home</Button>
                </Link>   
                </div>
                <header>Join A Game</header>
                <div id="gameOptions">
                    <form>
                        <p>Enter Your Nickname </p>
                            <input type="text" onChange={this.updateUserName}></input>
                        <p>Enter Game Code<br></br>
                            <input type="text" name="gameCode" onChange={this.updateGameCode}></input>
                        </p>
                        {this.state.showSubmit ?
                            <Button onClick={this.handleSubmit}>Submit</Button>:null
                        }
                    </form>
                    {this.state.showStart ?
                        <Link to={lobbyLink}><Button >Go To Lobby</Button></Link>:null
                    }
                </div>
        </div>
        );
    }
}
export default Join;