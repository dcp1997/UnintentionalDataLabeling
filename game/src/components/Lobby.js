import React, {
  Component
} from 'react';
import firebase from '../firebase'

class Lobby extends Component {

  constructor(props) {
    super(props);

    this.state = {
      players: [],
      dbKey: ""
    };
  }

  getPlayers() {
    var query = firebase.database().ref("game-session/oneGame/players").orderByKey();
    query.once("value")
      .then(function (snapshot) {
        snapshot.forEach(child => {
          //console.log(child.val().nickname);
          this.setState({
            players: this.state.players.concat(['test'])
          });
        });
      });
  }
  
  componentDidMount() {
    //this.getPlayers();
  }

  render() {

    return (
      <div>
      <ul>
        {this.props.hostUserName}
        Your Username: ___________
        {
          this.state.players.map((player)=>
          {
            return (
              <tr key = {player}>
                <td> {player}</td>
              </tr>
             
            )
           
          })
        }
      </ul>

      <div id = "main">

      </div>
      </div>
    );
  }
}

export default Lobby;