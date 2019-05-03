import React, { Component } from 'react';
import firebase from '../firebase'
import Button from 'react-bootstrap/Button';
import { Route, Link, BrowserRouter as Router } from 'react-router-dom';

class Create extends Component {
    
    constructor(props)
    {
        super(props);
        
        this.state = {
          hostUserName:'',
          numberOfPlayers: '',
          numberofRounds:'',
          mode:'image',
          dbKey: '',
          showStart:false,
          showSubmit:true,
          gameName:'',
        }

        this.updateUserName = this.updateUserName.bind(this);
        this.updateGameName = this.updateGameName.bind(this);
        this.updateNumberOfPlayers = this.updateNumberOfPlayers.bind(this);
        this.updateNumberOfRounds = this.updateNumberOfRounds.bind(this);
        this.updateMode = this.updateMode.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
        this.addSubmissions = this.addSubmissions.bind(this);
        this.addPlayersToSubmissions = this.addPlayersToSubmissions.bind(this);
        this.addPlayers = this.addPlayers.bind(this);
        this.addPlayersToVoting = this.addPlayersToVoting.bind(this);
        this.addHands = this.addHands.bind(this);
        this.checkHand = this.checkHand.bind(this);
        this.checkImage = this.checkImage.bind(this);
    }

    updateMode(event) {
        this.setState({value: event.target.value});
    }

    updateUserName(event)
    {
        this.setState({hostUserName: event.target.value})
    }

    updateGameName(event)
    {
        this.setState({gameName: event.target.value})
    }

    updateNumberOfPlayers(event)
    {
        this.setState({numberOfPlayers : event.target.value})
    }
    updateNumberOfRounds(event)
    {
        this.setState({numberofRounds : event.target.value})
    }  
    
    addSubmissions(k){
        // add submissions part to each round
        for (var i = 1; i < this.state.numberofRounds; i++){
            var submissions = {
                players : [ null],
                promptID : this.getRandomInt(1,99),
                type : "",
                voting : [null, {
                  nickname : 0
                },],
                winner : "",
                submittedAmount: 0
            }

        firebase.database().ref('game-session/' + k + '/round/' + (i+1)).update({submissions})
        }
    }

    addHands(k){
        var user = this.state.hostUserName;
        for (var i = 1; i <= this.state.numberofRounds; i++){   
            var hand = {
                username: user,
                tile1: this.getRandomInt(1,2020),
                tile2: this.getRandomInt(1,2020),
                tile3: this.getRandomInt(1,2020),
                tile4: this.getRandomInt(1,2020)
            }      
            firebase.database().ref('game-session/' + k + '/round/' + i + '/hand/1').update(hand)
            this.checkHand(k, i);
            console.log(hand); 
        }
    }
    checkHand(k, i){
        var game = this;
        firebase.database().ref('game-session/' + k + '/round/'+ i + '/hand/1').once('value').then(function(snapshot){
            game.checkImage(snapshot.val().tile1, 'tile1', k, i);
            game.checkImage(snapshot.val().tile2, 'tile2', k, i);
            game.checkImage(snapshot.val().tile3, 'tile3', k, i);
            game.checkImage(snapshot.val().tile4, 'tile4', k, i);
        })
        firebase.database().ref('game-session/'+k+'/round/'+i+'/hand/1').once('value').then(function(snapshot){console.log(snapshot.val())});
    }
    checkImage(index, tile, k, i){
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
                        game.checkImage(ind, tile, k, i);
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
                        return firebase.database().ref('game-session/'+k+'/round/'+i+'/hand/1').update(fix)
                    }
                })
        }
            else{
                var ind = game.getRandomInt(1,2020);
                game.checkImage(ind, tile, k, i);
                console.log(index+" no longer exists");
            }})
        };

    
    addPlayers(k){
        var player = {
            nickname: "",
            powerups: 0,
            score: 0
        }
        for (var i = 2; i <= this.state.numberOfPlayers; i++){
            firebase.database().ref('game-session/' + k + '/players/' + (i)).update(player)
        }
    }

    addPlayersToSubmissions(k){
        var playerSubmission = {
            nickname : "",
            submissionID: 0
        }
        
        for (var roundNum=0; roundNum<this.state.numberofRounds; roundNum++){
            for (var playerNum=0; playerNum<this.state.numberOfPlayers; playerNum++){
                if (playerNum==0){
                    playerSubmission = {
                        nickname : this.state.hostUserName,
                        submissionID: 0
                    }
                    firebase.database().ref('game-session/' + k + '/round/' + (roundNum+1) + '/submissions/players/' + (playerNum+1)).update({playerSubmission})
                    playerSubmission = {
                        nickname : "",
                        submissionID: 0
                    }
                } else{
                    firebase.database().ref('game-session/' + k + '/round/' + (roundNum+1) + '/submissions/players/' + (playerNum+1)).update({playerSubmission})
                }
            }
        }
    }

    addPlayersToVoting(k){
        var playerVoted = {
            nickname : "",
            ballot: 0
        }
        var numVoted = {
            numVoted:0
        }
        for (var roundNum=0; roundNum<this.state.numberofRounds; roundNum++){
            firebase.database().ref('game-session/' + k + '/round/' + (roundNum+1) + '/submissions/voting/').update(numVoted);
            for (var playerNum=0; playerNum<this.state.numberOfPlayers; playerNum++){
                if (playerNum==0){
                    playerVoted = {
                        nickname : this.state.hostUserName,
                        ballot: 0
                    }
                    firebase.database().ref('game-session/' + k + '/round/' + (roundNum+1) + '/submissions/voting/' + (playerNum+1)).update(playerVoted)
                    playerVoted = {
                        nickname : "",
                        ballot: 0
                    }
                } else{
                    firebase.database().ref('game-session/' + k + '/round/' + (roundNum+1) + '/submissions/voting/' + (playerNum+1)).update(playerVoted)
                }
            
            }
        }
    }

    
    handleSubmit()
    {     
        var user = this.state.hostUserName.toString();   
        var oneRound = {
            hands : [null],
            // {
            //     // [user]: [null, this.getRandomInt(1,800), this.getRandomInt(1,800), this.getRandomInt(1,800), this.getRandomInt(1,800)]
            // },
            submissions : {
              players : [ null],
              promptID : this.getRandomInt(1,99),
              type : "",
              voting : [null, {
                nickname : "",
                ballot: 0
              },],
              winner : "",
              submittedAmount: 0
            }
        };
        
        if (this.state.mode!=null && this.state.numberOfPlayers!=null && 
            this.state.numberofRounds!=null && this.state.hostUserName!='' && 
            this.state.numberOfPlayers>=3 && this.state.numberofRounds>=3){
                firebase.database().ref('game-session/').push({
                    currentRoundNumber : 1,
                    imagesUsed : null,
                    mode : this.state.mode,
                    numberPlayers : this.state.numberOfPlayers,
                    numberRounds : this.state.numberofRounds,
                    players : 
                    [ null, {
                        nickname : this.state.hostUserName,
                        powerups : 0,
                        score : 0
                        },
                    ],
                    round : [ null, oneRound ],
                    playersJoined: 1
                }).then((snap) => {
                    const key = snap.key;
                    console.log(key);
                    var gameNickname = key.substring(14);
                    this.setState({gameName: gameNickname});
                    this.setState({dbKey: key});
                    this.setState({showStart: true});
                    this.setState({showSubmit: false});
                    this.addPlayers(key);
                    this.addSubmissions(key);
                    this.addHands(key);
                    this.addPlayersToSubmissions(key);
                    this.addPlayersToVoting(key);
                 }); 
                 this.start = true;
                //  this.continueSetup();
            }
        
        if (this.state.numberOfPlayers<3){
            alert("Not enough players")
        }
        if (this.state.numberOfRounds<3){
            alert("Not enough rounds")
        } 
        if (this.state.hostUserName==''){
            alert("Enter a valid nickname")
        }
    }

    getRandomInt(min, max) 
    {
        min = Math.ceil(min);
        max = Math.floor(max);
        return Math.floor(Math.random() * (max - min + 1)) + min;
    }

    render() { 
        
        var lobbyLink = "/lobby/1/" + this.state.dbKey ;

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
                Create a New Game 
            </header>
            <div id="gameOptions">
                <form>
                    <p>Enter Your Nickname </p>
                    <input type="text" onChange={this.updateUserName}></input>

                    <p>Number of Players (3-8)                     
                        <br></br><input type="number" min="3" max="8" default="3" name="players" onChange={this.updateNumberOfPlayers}></input>
                    </p>

                    <p>Number of Rounds (min 3)
                        <br></br><input type="number" min="3" max="50" default="3" name="rounds" onChange={this.updateNumberOfRounds}></input>
                    </p>
                    {/* <p>Game Name <br></br>
                    <input type="text" onChange={this.updateGameName}></input>
                    </p> */}
                    <p>Prompt with: 
                        <div class='styled-select white semi-square '>
                            <select name="prompt">
                                <option value="caption">Caption</option>
                                <option value="image">Image</option>
                            </select>
                        </div>
                    </p>
                    
                </form>
                {this.state.showSubmit ?
                    <Button type="submit" onClick={this.handleSubmit} >Submit</Button> : null
                }
                {this.state.showStart ?
                    <div> 
                    <p> Shareable GameCode: {this.state.gameName}</p>
                    <div><Link to={lobbyLink}><Button >Go To Lobby</Button></Link> </div></div>
                    :null
                        
                }
            </div>
        </div>
        );
    }
}
export default Create;