

document.addEventListener("DOMContentLoaded", event => {
    const app = firebase.app();
    console.log(app)
});

function tempUserLogin(){
    var db = firebase.database();
    var userInput = document.getElementById('usernameBox').value;

    db.ref('TempUser/').push(
        {
            Username: userInput
        }
    );
    console.log("what");
}

// function readDB(){
//     alert(getDB());
// }
// function getDB(){
//     return firebase.database().ref('/users/gameOne').once('value').then(function(snapshot) {
//         var username = (snapshot.val() && snapshot.val().username) || 'Anonymous';
//       });
// }
