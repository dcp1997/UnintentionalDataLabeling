import React from 'react';
import ReactDOM from 'react-dom';
import Button from 'react-bootstrap/Button'
import './index.css';
import App from './App';
import * as serviceWorker from './serviceWorker';
import Create from './components/Create';
import Join from './components/Join';
import Game from './components/Game';
import Home from './components/Home';
import { Route, Link, BrowserRouter as Router } from 'react-router-dom';
import Lobby from './components/Lobby'

const routing = (
    <Router>
      <div>
        <Route exact path="/" component={Home} />
        <Route path="/create" component={Create} />
        <Route path="/join" component={Join} />
        <Route path="/game" component={Game} />
      </div>
    </Router>
  )
  ReactDOM.render(<Lobby/>, document.getElementById('root'))
  ReactDOM.render(routing, document.getElementById('main'))

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: http://bit.ly/CRA-PWA
serviceWorker.unregister();
