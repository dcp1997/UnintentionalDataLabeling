
document.addEventListener("DOMContentLoaded", event => {
    const app = firebase.app();
    console.log(app)
});

function tempUserLogin() {
    var db = firebase.database();
    var userInput = document.getElementById('usernameBox').value;

    db.ref('TempUser/').push({
        Username: userInput
    });
    console.log(userInput);
    var element = document.querySelector('#usernameShow');
    element.textContent = userInput;
}
function createNewGame(){

}

function readDB() {

    for(var i = 0; i < 4; i++)
    {
        var randomIndex = getRandomInt(0,833);
        appendImage(randomIndex);
    }
}

function appendImage(index)
{
    var ref = firebase.database().ref("images/"+index);
    ref.on("value", function (snapshot) {
        console.log(snapshot.val());
        var url = snapshot.val().url;
        var img = document.createElement("img");
        img.src = url;
        document.body.appendChild(img);
    }, function (error) {
        console.log("Error: " + error.code);
    });
}

function getRandomInt(min, max) {
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

function createLobby() {
    var ref = firebase.database().ref("Lobby/");
    var username = document.getElementById('usernameShow').textContent;
    gameLobby.seen = !gameLobby.seen;
}


var gameLobby = new Vue({
    el: '#gameLobby',
    data: {
        seen: false
    }
})
