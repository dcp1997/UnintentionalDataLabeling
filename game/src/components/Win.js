import React, { Component } from 'react';
import firebase from '../firebase'
import { storage } from 'firebase';
import Button from 'react-bootstrap/Button'
import { Route, Link, BrowserRouter as Router } from 'react-router-dom';




class Winning extends Component {

    constructor(props) {
        super(props);
    
        this.state = {
          username: "",
          dbKey: "",
          round: 1,
          allSubmitted: false,
          numberOfPlayers: 3,
          init: 1
        };
        this.getWinningImage = this.getWinningImage.bind(this);
      }

    getWinningImage(){

        this.getRoundCaption()
        var playersVoted = 0;
         
       
        firebase.database().ref('game-session/'+ this.state.dbKey +'/round/1/submissions/voting/').once('value').then(function(snapshot){
            console.log(snapshot)
            console.log(snapshot.val())
            console.log(snapshot.numChildren())
            var numPlayers = snapshot.numChildren()
            var winArray = new Array(numPlayers-2);
            var i = 0;
            if(numPlayers === playersVoted){
                snapshot.forEach(child => {
                    const indexofPic = parseInt(child.val().ballot);
                    console.log(indexofPic);
                    console.log(child.val())
                    if(i !== numPlayers-1){
                        winArray[i] = indexofPic;
                    }
                    
                    i++;


                });
            }
            console.log(winArray)
            function mode(arr){
                return arr.sort((a,b) =>
                      arr.filter(v => v===a).length
                    - arr.filter(v => v===b).length
                ).pop();
            }
            var winner = mode(winArray)
            console.log(winner)
            
            //var winningPic = parseInt(snapshot.val())
            // console.log(winningPic)
            // firebase.database().ref('images/' + winningPic).once('value').then(function(snapshot) {
            //     console.log(snapshot)
            //     window.url = snapshot.val()
            //     var pic = document.createElement("img");
            //     pic.setAttribute("class", "winnerPicture");
            //     pic.setAttribute("src", snapshot.val().url)
            //     pic.setAttribute('alt', winningPic);
                
            //     var elem = document.createElement("div")
            //     elem.setAttribute('height', '200px')
            //     elem.setAttribute('width', '200px')
            //     elem.setAttribute("class", "grid-item");
            //     elem.appendChild(pic);
            //     document.getElementById("winner").appendChild(elem)

            // });               
         });
         
    }


    getRoundCaption(){

        firebase.database().ref('game-session/'+ this.state.dbKey +'/round/1/submissions/promptID').once('value').then(function(snapshot){
            console.log(snapshot.val());
            var index = snapshot.val();
            firebase.database().ref('captions/'+index).once('value').then(function(snapshot){
                console.log(snapshot);
                console.log(snapshot.val());
                console.log(snapshot.val().caption);
                window.caption = snapshot.val().caption
                document.getElementById('caption').innerHTML = snapshot.val().caption
                
        });
      
        })
    }

    waitForAllSubmitted(){
        firebase.database().ref('game-session/'+ this.state.dbKey +'/round/1/submissions/voting/numVoted/').on('value', snapshot => {
            var currentAmountofSubmissions = snapshot.val();
            firebase.database().ref('game-session/' + this.state.dbKey).once('value').then(function(snap){
                //console.log(snap.val().numberPlayers);
                //console.log("current amount submit: " + currentAmountofSubmissions + "|number players: " + snap.val().numberPlayers)
                if(currentAmountofSubmissions >= snap.val().numberPlayers)
                {
                    this.setState({allSubmitted: true});
                }
                if(this.state.numberOfPlayers !== snapshot.val().numberOfPlayers){
                    this.setState({numberOfPlayers: snapshot.val().numberPlayers});
                }
            }.bind(this));

        }); 
    }

    getNumberOfPlayers(){
        console.log(this.state.dbKey)
        firebase.database().ref('game-session/' + this.state.dbKey).once('value').then(function(snapshot){
            console.log(snapshot.val().numberPlayers);
            if(this.state.numberOfPlayers !== snapshot.val().numberOfPlayers){
                this.setState({numberOfPlayers: snapshot.val().numberPlayers});
            }
        }.bind(this));

    }

    componentDidMount(){
        //window.addEventListener('load', this.getSubmittedImages());

        this.waitForAllSubmitted();
        
    }
    componentWillMount(){
        var pathname = window.location.pathname.split('/');
        this.setState({username: pathname[2]});
        console.log(this.state.username)
        this.setState({dbKey: pathname[3]});
        this.getNumberOfPlayers();
    }


    componentDidUpdate(){
        this.waitForAllSubmitted();
        if(this.state.allSubmitted === true && this.state.init === 1)
        {
            this.getWinningImage();
            this.setState({init: 0});
        }
        //this.getNumberOfPlayers();

    }
    test(){
        console.log("#players: " + this.state.numberOfPlayers);
        console.log("allsubmitted: " + this.state.allSubmitted); 
    }

    // getScore(){
        
    //     firebase.database().ref('game-session/'+ this.state.dbKey +'/players/1/score').once('value').then(function(snapshot){
    //         console.log(snapshot.val());
            
    //         document.getElementById('winScore').innerHTML = "Your Score: " + snapshot.val()
            
    //      });
    // }

    // componentDidMount(){
    //     window.addEventListener('load', this.getWinningImage());
    //     }



    render() { 
        


        return   (
            <div>
                <div>
                <Link to="/">
                    <Button id="exit">Exit Game</Button>
                </Link>   
                </div>
                <header>
                    Round {this.state.round} Winner
                </header>
                {/* <div className="gameInfo"><h2 id = "winScore">{this.getScore()}</h2></div> */}
                <div className="container">

                    <div className="caption" id="caption">
                    {this.state.allSubmitted ? null :<h4>*Waiting on other players...*</h4>}
                    </div>

                    <div className="grid" id="winner">
                       </div>  
            </div>
            </div>
        );
            


    }
}
export default Winning;