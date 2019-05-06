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

  //gets the player names from the database using the database key, updates the state of players which is being rendered on this page
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

  componentWillMount(){
    var pathname = window.location.pathname.split('/');
    this.state.username = pathname[2];
    this.state.dbKey = pathname[3];
  }

  render() {

    var gameLink = "/game/" + this.state.username + "/" + this.state.dbKey +"/" + 1;

    return (
      <div>
        <header class='icon'> 
          <div>
              <Link to="/"> 
                  <i class="fas fa-home"></i>
              </Link>   
          </div>
        </header>
        <header>Lobby </header>
        <div class = "App">
        <h3>Game ID: {this.state.dbKey}</h3>
        <div class='joinedPlayers'>
          <p> Current Players:</p>
          {this.state.playerRef}
          </div>
          <Link to={gameLink}><Button >Enter Game</Button></Link>
        </div>
      </div>
    );
  }
}

export default Lobby;