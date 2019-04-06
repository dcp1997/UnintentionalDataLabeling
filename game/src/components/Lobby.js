import React, {
  Component
} from 'react';
import firebase from '../firebase'
import Button from 'react-bootstrap/Button'
import { Route, Link, BrowserRouter as Router } from 'react-router-dom';



class Lobby extends Component {

  constructor(props) {
    super(props);

    this.state = {
      username: "",
      dbKey: "",
      players:[],
      playerRef: ''
    };
  }

  updatePlayers() {
    var i = 0;
    var query = firebase.database().ref("game-session/"+ this.state.dbKey + "/players").orderByKey();
    query.on("value" , snap => {
      this.state.players = [];
      snap.forEach(child => {
        this.setState({
          players : this.state.players.concat([child.val().nickname])
        });

        const playerList = this.state.players.map((player) =>
          <p>
            {player}
            <br/>
          </p>
        );

        this.setState({
          playerRef: playerList
        });
      });
    });


  }
  


  componentDidMount() {
    this.updatePlayers();
  }

  render() {
    var pathname = window.location.pathname.split('/');
    this.state.username = pathname[2];
    this.state.dbKey = pathname[3];

    
    var gameLink = "/game/" + this.state.username + "/" + this.state.dbKey ;

    return (
      <div>
        
        <div class = "App">
        <h1>Lobby</h1>
        <h3>Game ID: {this.state.dbKey}</h3>
        <p> Current Players:</p>
        {this.state.playerRef}
        </div>

        <Link to={gameLink}><Button >dufuq</Button></Link>


      </div>
    );
  }
}

export default Lobby;