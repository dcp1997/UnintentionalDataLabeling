import React, { Component } from 'react';
import firebase from '../firebase'
import { storage } from 'firebase';
import Button from 'react-bootstrap/Button'
import { Route, Link, BrowserRouter as Router } from 'react-router-dom';



class Join extends Component {
    render() { 
        return   (
            <div>
                <header>Joinnnnn</header>
                <form>
                    <p>Enter Game Code</p>
                    <input type="text" name="gameCode"></input>
                    <Link to="/game">
                        <Button>Test Round</Button>
                    </Link>  
                </form>
        </div>


        );
    }
}
export default Join;