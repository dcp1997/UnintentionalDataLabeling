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
          gameCode: ''
        }
        
        this.updateUserName = this.updateUserName.bind(this);
        this.updateGameCode = this.updateGameCode.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
    }
    updateGameCode(event)
    {
        this.setState({gameCode: event.target.value})
    }
    updateUserName(event)
    {
        this.setState({userName: event.target.value})
    }
    handleSubmit()
    {

        if (this.state.gameCode!=null && this.state.userName!=null)
        {
            firebase.database().ref('game-session/' + this.state.gameCode + '/players').push(
            {
                nickname: this.state.userName,
                powerups : 0,
                score : 0
            });
            
        }
    }
    render() { 
        return   (
            <div>
                <div>
                <Link to="/">
                    <Button id="exit">Exit</Button>
                </Link>   

                </div>
                <header>Join</header>
                <div id="gameOptions">
                    <form>
                        <p>Enter Your Nickname </p>
                        <input type="text" onChange={this.updateUserName}></input>
                        <p>Enter Game Code</p>
                        <input type="text" name="gameCode" onChange={this.updateGameCode}></input>
                      
                    </form>
                    <input type="submit" onClick={this.handleSubmit} ></input>
                        
                </div>
        </div>
        );
    }
}
export default Join;