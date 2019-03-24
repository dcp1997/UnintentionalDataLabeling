import React, { Component } from 'react';
import firebase from '../firebase'
import { storage } from 'firebase';
import Button from 'react-bootstrap/Button'
import { Route, Link, BrowserRouter as Router } from 'react-router-dom';




class Setup extends Component {
    
    constructor(props)
    {
        super(props);
        
        this.state = {
          hostUserName:'',
          numberOfPlayers: '',
          numberofRounds:'',
          ImagesOrPhrases:'',
          dbKey: ''
        }
        
        this.updateUserName = this.updateUserName.bind(this);
        this.updateNumberOfPlayers = this.updateNumberOfPlayers.bind(this);
        this.updateNumberOfRounds = this.updateNumberOfRounds.bind(this);

        this.handleSubmit = this.handleSubmit.bind(this);
    }

    updateUserName(event)
    {
        this.setState({hostUserName: event.target.value})
    }

    updateNumberOfPlayers(event)
    {
        this.setState({numberOfPlayers : event.target.value})
    }
    updateNumberOfRounds(event)
    {
        this.setState({numberofRounds : event.target.value})
    }   

   

    
    handleSubmit()
    {
        firebase.database().ref('Games/').push({
            Players:
            {
                1: 
                {
                    username: this.state.hostUserName
                }
            },
            NumberOfRounds: this.state.numberofRounds,
            NumberOfPlayers: this.state.numberOfPlayers,

        }).then((snap) => {
            const key = snap.key;
            console.log(key);
            this.setState({dbKey: key});
         }); 

    }

    render() { 
        return   (


            <div>
            <header>Create a new game </header>
            <div id="gameOptions">
                <form>
                    <p>Enter Your Username </p>
                    <input type="text" onChange={this.updateUserName}></input>

                    <p>Number of Players (min 3)</p>
                    <input type="text" name="players" onChange={this.updateNumberOfPlayers}></input>

                    <p>Number of Rounds</p>
                    <input type="text" name="rounds" onChange={this.updateNumberOfRounds}></input>

                    <p>Prompt with </p>
                    <input type="radio" name="input"></input> Image<br></br>
                    <input type="radio" name="input"></input> Phrase<br></br>
                </form>

                <input type="submit" onClick={this.handleSubmit} ></input>
                <p> Your Shareable game ID: {this.state.dbKey}</p>
                <Link to="/game">
                    <Button>Test Round</Button>
                </Link>  
            </div>
        </div>
        );
    }
}
export default Setup;