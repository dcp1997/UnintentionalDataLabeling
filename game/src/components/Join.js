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
            userKey: '',
            dbKey: ''
        }
                
        this.updateUserName = this.updateUserName.bind(this);
        this.updateGameCode = this.updateGameCode.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
        this.updatePlayer = this.updatePlayer.bind(this);
        this.addHands = this.addHands.bind(this);
        this.getRandomInt = this.getRandomInt.bind(this);
        this.checkImage = this.checkImage.bind(this);
        this.checkHand = this.checkHand.bind(this);
    }

    updateGameCode(event) {
        this.setState({gameCode: event.target.value});
    }

    updateUserName(event)
    {
        this.setState({userName: event.target.value})
    }

    getRandomInt(min, max) 
    {
        min = Math.ceil(min);
        max = Math.floor(max);
        return Math.floor(Math.random() * (max - min + 1)) + min;
    }

    updatePlayer(k, i){
        // alert("Updating player")
        // alert("Key" + k)
        // alert("Player " + i)
        var numberofRounds = 0;
        var user = this.state.userName;
        firebase.database().ref('game-session/' + k + '/numberRounds').once('value', function(snapshot) {
            numberofRounds = snapshot.val()
            // alert("Rounds " + numberofRounds)
            for (var roundNum=0; roundNum<numberofRounds; roundNum++){
                var playerSubmission = {
                    nickname : user,
                    submissionID: 0
                }
                var playerVoted = {
                    nickname : user,
                    ballot: 0
                }
                firebase.database().ref('game-session/' + k + '/round/' + (roundNum+1) + '/submissions/players/' + (i+1)).update({playerSubmission});
                firebase.database().ref('game-session/' + k + '/round/' + (roundNum+1) + '/submissions/voting/' + (i+1)).update(playerVoted)
            }
        });
    }

    addHands(k, i){
        var game = this;
        var user = this.state.userName;
        var numberofRounds = 3;
        firebase.database().ref('game-session/' + k + '/numberRounds').once('value').then(function(snapshot) {
            numberofRounds = snapshot.val()
            for (var round = 1; round <= numberofRounds; round++){   
                var hand = {
                    username: user,
                    tile1: Math.floor(Math.random() * (800 - 1 + 1)) + 1,
                    tile2: Math.floor(Math.random() * (800 - 1 + 1)) + 1,
                    tile3: Math.floor(Math.random() * (800 - 1 + 1)) + 1,
                    tile4: Math.floor(Math.random() * (800 - 1 + 1)) + 1
                }         
                firebase.database().ref('game-session/' + k + '/round/' + round + '/hand/' +(i+1)).update(hand);
                game.checkHand(k, round, i);
                console.log("made it past check hand");
            } 
        }); 
    }
    checkHand(k, round, i){
        console.log('made it into check hand');
        var game = this;
        firebase.database().ref('game-session/' + k + '/round/'+ round + '/hand/'+(i+1)).once('value').then(function(snapshot){
            game.checkImage(snapshot.val().tile1, 'tile1', k, round, i);
            game.checkImage(snapshot.val().tile2, 'tile2', k, round, i);
            game.checkImage(snapshot.val().tile3, 'tile3', k, round, i);
            game.checkImage(snapshot.val().tile4, 'tile4', k, round, i);
        })
        firebase.database().ref('game-session/'+k+'/round/'+round+'/hand/'+(i+1)).once('value').then(function(snapshot){console.log(snapshot.val())});
    }
    checkImage(index, tile, k, round, i){
        console.log('checking image');
        var game = this;
        firebase.database().ref('images/'+index).once('value').then(function(snapshot){
            if(snapshot.exists()){
                console.log(index);
                console.log(snapshot.val())
                var source = snapshot.val().url;
                fetch('https://cors-anywhere.herokuapp.com/'+source).then((response)=>{
                    console.log(response.ok);
                    if(!response.ok){
                        var ind = game.getRandomInt(1,2020);
                        game.checkImage(ind, tile, k, round, i);
                        console.log(index+" had a 404");
                    }
                    else if(response.ok){
                        console.log(index+" is okay");
                        var fix;
                        if(tile==='tile1'){
                            fix={'tile1':index};
                        }
                        if(tile==='tile2'){
                            fix={'tile2':index};
                        }
                        if(tile==='tile3'){
                            fix={'tile3':index};
                        }
                        if(tile==='tile4'){
                            fix={'tile4':index};
                        }
                        return firebase.database().ref('game-session/'+k+'/round/'+round+'/hand/'+(i+1)).update(fix)
                    }
                })
        }
            else{
                var ind = game.getRandomInt(1,2020);
                game.checkImage(ind, tile, k, round, i);
                console.log(index+" no longer exists");
            }})
        };
    handleSubmit()
    {   
        var gc_sub = '';
        var gc = '';
        var user_GC = this.state.gameCode;
        var user = this.state.userName;
        var joined = 0;
        var maxPlayers = 0;
        var current = 0;
        var found = false;
        
        // var qaz = firebase.database().ref('game-session/').child();
        // console.log(qaz);
        let usersRef = firebase.database().ref('game-session');
        usersRef.orderByValue().on("value", function(snapshot) {
            console.log(snapshot.val());
            snapshot.forEach(function(data) {
                var db_Key = data.key;
                console.log(data.key);
                gc_sub = db_Key.substring(14);
                console.log(gc_sub);
                if (gc_sub == user_GC){
                    gc = db_Key;
                    found = true;
                }
            });
        }.bind(this));;
        if (found){
            this.setState({dbKey: gc});
            firebase.database().ref('game-session/' + gc + '/numberPlayers').once('value', function(snapshot) {
                maxPlayers = snapshot.val()
            });

            if (gc!=null && user!=null){
                firebase.database().ref('game-session/' + gc + '/playersJoined').once('value', function(snapshot) {
                    joined = snapshot.val()
                    // console.log(joined);
                    // console.log(maxPlayers);
                    if (joined < maxPlayers) {
                        firebase.database().ref('game-session/' + gc + '/players').child(joined+1).update({
                            nickname : user,
                            powerups : 0,
                            score : 0
                            }).then((snap) => {
                                joined++;
                                this.setState({userKey: joined});
                                var playersJoined = joined;
                                firebase.database().ref('game-session/' + gc).update({playersJoined});
                        });
                    }
                    else {
                        alert("You cannot join this game")
                    } 
                }.bind(this));
                
                firebase.database().ref('game-session/' + gc + '/players').once('value', function(snapshot) {
                }).then((snapshot)=>{
                    current = snapshot.numChildren();
                    console.log(joined)
                    console.log(current)
                    if (current > joined){
                        this.updatePlayer(gc, joined);
                        this.addHands(gc, joined);
                        this.setState({showStart: true});  
                        this.setState({showSubmit:false});
                    }
                }); 
            }
        } 
        // else {
        //     alert("1You cannot join this game")
        // } 
    }

    render() { 
        var lobbyLink = "/lobby/" + this.state.userKey + "/" + this.state.dbKey;
        console.log("userkey " + this.state.userKey);
        return   (
            <div>
                <header class='icon'> 
                    <div>
                        <Link to="/"> 
                            <i class="fas fa-home"></i>
                        </Link>   
                    </div>
                </header>
                <header>
                    Join A Game
                </header>
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
                    <div >
                    {this.state.showStart ?
                        <Link to={lobbyLink}><Button >Go To Lobby</Button></Link>:null
                    }
                    </div>
                </div>
        </div>
        );
    }
}
export default Join;