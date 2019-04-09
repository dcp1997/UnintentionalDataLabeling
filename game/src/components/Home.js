import React, { Component } from 'react';
import firebase from '../firebase'
import { storage } from 'firebase';
import Button from 'react-bootstrap/Button'
import { Route, Link, BrowserRouter as Router } from 'react-router-dom';




class Home extends Component {
    render() { 
        return   (
            <div>
            <header></header>
            <header>Memes For Machines </header>
                <div id="a">
                    <div id="description">Who will find the best caption/picture combo?</div>
                    <div id="menuOptions">
                        <Link to="/create">
                            <Button>New Game</Button>
                        </Link>            
                        <Link to="/join">
                            <Button>Join Game</Button>
                        </Link>       
                    </div>
                </div>
            </div>


        );
    }
}
export default Home;