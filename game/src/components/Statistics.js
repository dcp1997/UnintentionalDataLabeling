import React, { Component } from 'react';
import '../App.css';
import firebase from '../firebase'
import Button from 'react-bootstrap/Button';
import { Route, Link, BrowserRouter as Router } from 'react-router-dom';


class Stats extends Component
{
    constructor(props) {
        super(props);
    
        this.state = {
          tuple: [],
          data: [],
          totalVotes: "",
          currentArrayIndex: 10
        };
        this.getStats = this.getStats.bind(this);
        this.ReduceByKey = this.ReduceByKey.bind(this);
        this.get10More = this.get10More.bind(this);
      }


    componentWillMount(){
    }

    componentDidMount() {
      this.getStats();
      }

    componentDidUpdate(){
      }

    getStats(){ 
      var array = [];
      var query = firebase.database().ref("/testData").orderByKey();
        query.once('value').then(function(snap){
          snap.forEach(child => {
            var tuple = [child.val().captionIndex, child.val().imageIndex]
            array.push(tuple);
          });

          this.setState({totalVotes: array.length});

          this.ReduceByKey(array); 
        }.bind(this));  
    }

    ReduceByKey(array){
      var arrayWithCount = [];

      for(var i = 0; i < array.length; i++)
      {
        var newTuple = [array[i][0], array[i][1], this.countOfImageCaption(array[i][0], array[i][1], array)]
        arrayWithCount.push(newTuple);

      }
      arrayWithCount.sort(function(a,b){return b[2] - a[2]});

      this.setState({
        data: arrayWithCount
      });

      


      this.getTop10(arrayWithCount);

      this.appendArray(arrayWithCount);

     
    }

    getTop10(array){
      if(array.length <= 10)
      {
        return array;
      }
      else{
        return array.splice(10, array.length);
      }
    }
    countOfImageCaption(caption, image, array){
      var count = 0;
      for(var i = 0; i < array.length; i++)
      {
        
        if(array[i][0] == caption && array[i][1] == image){  
          count = count + 1;
          array.splice(i, 1);
          i--;
        }
      }
      return count;
    }

    skimOneCount(array)
    {
      for(var i = 0; i < array.length; i++)
      {
        if(array[i][2] == 1)
        {
          array.splice(i, 1);
        }
      }
      return array;
    }

    appendArray(array)
    {
      for(var i = 0; i < array.length; i++)
      {
        this.appendImage(array[i])
      }
    }

    get10More()
    {
      var data = this.state.data;

      this.appendArray(data.slice(this.state.currentArrayIndex, this.state.currentArrayIndex + 9));
      this.setState({currentArrayIndex: this.state.currentArrayIndex + 9})
      

    }


    appendImage(tuple)
    {
    
      firebase.database().ref('images/' + tuple[1]).once('value').then(function(snapshot) {
        firebase.database().ref('captions/' + tuple[0]).once('value').then(function(cap)
        {

        
          window.url = snapshot.val().url
          var pic = document.createElement("img");
          pic.setAttribute("class", "randomPictures");
          pic.setAttribute("src", snapshot.val().url);
          pic.setAttribute('alt', tuple[1]);
          
          var elem = document.createElement("div")
          elem.setAttribute('height', '400px')
          elem.setAttribute('width', '400px')
          elem.setAttribute("class", "grid-item");
          elem.appendChild(pic);
          document.getElementById("grid").appendChild(elem);

          var capDiv = document.createElement("div");
          capDiv.setAttribute("class", "statCaption");
          var winningUser = document.createTextNode(cap.val().caption + " (" + tuple[2] + ")");   

          capDiv.appendChild(winningUser);
          
          elem.appendChild(capDiv);

        });
     
   }.bind(this));
  }

    
    render() {

        return (
            <div>
                <header id="final" class='icon'>
                    <div>
                    <Link to="/">
                        <i class="fas fa-sign-out-alt fa-xs"></i>
                    </Link>   
                    </div>
                </header>
                <header id="final">
                    Stats
                </header>

            <p class = "disclaimer">disclaimer: This is keeping track of the top 10 most voted for caption image combo.  <br></br>
            Our goal is to label a massive dataset of images.<br></br>
            <br></br>
            The data is skewed from mass amounts of random test runs as of 5/7/2019 
            <br></br>
            </p>
                <div className="container">

                <div id="center">
     
                <div>
                Total All Time Votes: {this.state.totalVotes}

                </div>
                </div>
                <div class="grid-container">
                    <div className="grid" id="grid">

                    </div>
                   
                    </div>
                    



                </div>
            </div>
        );
      }
}
export default Stats;