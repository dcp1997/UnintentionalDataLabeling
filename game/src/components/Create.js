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
        this.addInfo = this.addInfo.bind(this);
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
    
    // add submissions part to each round
    addSubmissions(k){
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

    //adds the hands for the user that created the game
    addHands(k){
        var user = this.state.hostUserName;
        for (var i = 1; i <= this.state.numberofRounds; i++){   
            var hand = { //2020 max rn
                username: user,
                tile1: this.getRandomInt(1,2020),
                tile2: this.getRandomInt(1,2020),
                tile3: this.getRandomInt(1,2020),
                tile4: this.getRandomInt(1,2020)
            }      
            firebase.database().ref('game-session/' + k + '/round/' + i + '/hand/1').update(hand)
            this.checkHand(k, i);
        }
    }

    //checking each image in a hand
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

    //checking for 404 errors and replacing them
    checkImage(index, tile, k, i){
        var game = this;
        firebase.database().ref('images/'+index).once('value').then(function(snapshot){
            if(snapshot.exists()){
                var source = snapshot.val().url;
                fetch('https://cors-anywhere.herokuapp.com/'+source).then((response)=>{
                    if(!response.ok){
                        var ind = game.getRandomInt(1,2020);
                        game.checkImage(ind, tile, k, i);
                    }
                    else if(response.ok){
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
            }})
        };

        //creating the game area in the database
    addInfo(k){
        var oneRound = {
            hands : [null],
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
        var info = {
            active: "true",
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
            playersJoined: 1,
            playersExited: 0
        }
        firebase.database().ref('game-session/' + k).update(info);
    }

    //adding the player areas in the db
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

    
    //checking that the game values the user set up fufill the right criterias and then 
    //calling all the methods to create the game and allows the user to get into the lobby.
    handleSubmit()
    {     
        var user = this.state.hostUserName.toString();  
        var nickname = this.state.gameName; 
        var exists;
        var active;
        
        if (this.state.gameName.toString().length == 0){
            alert("You must enter a valid game name");
        }
        else if (!this.isAlphaNumeric(this.state.gameName)){
            alert("Game names can only include letters and numbers!")
        }
        else if (this.state.gameName.toString().length >= 3  && this.state.gameName.toString().length < 12 
            && this.isAlphaNumeric(this.state.gameName) && 
            this.state.mode!=null && this.state.numberOfPlayers!=null && 
            this.state.numberofRounds!=null && this.state.hostUserName!='' && 
            this.state.hostUserName.toString().length > 3 && this.state.hostUserName.toString().length < 10 &&
            this.state.numberOfPlayers>=3 && this.state.numberofRounds>=3){
                var ref = firebase.database().ref("game-session/");
                ref.on('value', (snapshot) => {
                    var a = snapshot.exists();  // true
                    exists = snapshot.child(nickname).exists(); // true
                    if (exists) {
                        firebase.database().ref('game-session/' + nickname + '/active').once('value', function(snapshot) {
                            active = snapshot.val();
                        });
                        if (active != "true"){
                            firebase.database().ref('game-session/' + nickname).push().then((snap) => {
                                const key = snap.key;
                                var gameNickname = key.substring(14);
                                this.setState({gameName: nickname});
                                this.setState({dbKey: nickname});
                                this.setState({showStart: true});
                                this.setState({showSubmit: false});
                                this.addInfo(nickname);
                                this.addPlayers(nickname);
                                this.addSubmissions(nickname);
                                this.addHands(nickname);
                                this.addPlayersToSubmissions(nickname);
                                this.addPlayersToVoting(nickname);
                            }); 
                        }
                    }
                    else {
                        firebase.database().ref('game-session/' + nickname).push().then((snap) => {
                            const key = snap.key;
                            
                            var gameNickname = key.substring(14);
                            this.setState({gameName: nickname});
                            this.setState({dbKey: nickname});
                            this.setState({showStart: true});
                            this.setState({showSubmit: false});
                            this.addInfo(nickname);
                            this.addPlayers(nickname);
                            this.addSubmissions(nickname);
                            this.addHands(nickname);
                            this.addPlayersToSubmissions(nickname);
                            this.addPlayersToVoting(nickname);
                        }); 
                    } 
                });
                if (active == "true") { // if a game is active then it definitely exists
                    alert("Game exists and can be joined");
                }
            
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
        if (this.state.hostUserName.toString().length <= 3) {
            alert("Nickname is too short")
        }
        if (this.state.hostUserName.toString().length >= 10) {
            alert("Nickname is too long")
        }
        if (this.state.gameName.toString().length <3){
            alert("Game name too short")
        }
        if (this.state.gameName.toString().length > 12){
            alert("Game name too long")
        }
        
    }

    getRandomInt(min, max) 
    {
        min = Math.ceil(min);
        max = Math.floor(max);
        return Math.floor(Math.random() * (max - min + 1)) + min;
    }


    // from
    // https://stackoverflow.com/questions/4434076/best-way-to-alphanumeric-check-in-javascript
    isAlphaNumeric(str) {
        var code, i, len;
      
        for (i = 0, len = str.length; i < len; i++) {
          code = str.charCodeAt(i);
          if (!(code > 47 && code < 58) && // numeric (0-9)
              !(code > 64 && code < 91) && // upper alpha (A-Z)
              !(code > 96 && code < 123)) { // lower alpha (a-z)
            return false;
          }
        }
        return true;
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
                    <p>Game Name <br></br>
                    <input type="text" onChange={this.updateGameName}></input>
                    </p>
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
                    <div id="createNav"> 
                        <p> Shareable Code: {this.state.gameName}</p>
                        <div><Link to={lobbyLink}><Button >Enter Lobby</Button></Link> </div>
                    </div>
                    :null
                        
                }
            </div>
        </div>
        );
    }
}
export default Create;