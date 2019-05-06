import React, { Component } from 'react';
import Button from 'react-bootstrap/Button'
import { Route, Link, BrowserRouter as Router } from 'react-router-dom';




class Home extends Component {
    render() { 
        return   (
            <div>
            <header></header>
            <header>Meme It! </header>
            
                <div id="a">
                    <div id="description">Who can make the best meme?</div>
                    <div id="menuOptions">
                        <Link to="/create">
                            <Button>New Game</Button>
                        </Link>            
                        <Link to="/join">
                            <Button>Join Game</Button>
                        </Link>  
                        {/* <Link to="/howtoplay">
                            <Button>How to Play</Button>
                        </Link>       */}
                    </div>
                </div>
            </div>


        );
    }
}
export default Home;