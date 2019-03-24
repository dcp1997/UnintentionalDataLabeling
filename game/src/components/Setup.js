import React, { Component } from 'react';
import firebase from '../firebase'
import { storage } from 'firebase';
import Button from 'react-bootstrap/Button'
import { Route, Link, BrowserRouter as Router } from 'react-router-dom';




class Setup extends Component {
    render() { 
        return   (
            <div>
            <header>Create a new game </header>
            <div id="gameOptions">
                <form>
                    <p>Number of Players (min 3)</p>
                    <input type="text" name="players"></input>
                    <p>Number of Rounds</p>
                    <input type="text" name="rounds"></input>
                    <p>Prompt with </p>
                    <input type="radio" name="input"></input> Image<br></br>
                    <input type="radio" name="input"></input> Phrase<br></br>
                </form>
                <Link to="/game">
                    <Button>Test Round</Button>
                </Link>  
            </div>
        </div>


        );
    }
}
export default Setup;