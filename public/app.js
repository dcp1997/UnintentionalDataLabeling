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
    console.log("what");
}

function readDB() {
    var ref = firebase.database().ref("Images/keyGUID/");

    ref.on("value", function (snapshot) {
        console.log(snapshot.val());
    }, function (error) {
        console.log("Error: " + error.code);
    });

    console.log();
    var url = "https://i.imgur.com/qSnnQyU.jpg";

    var img = document.createElement("img");
    img.src = url;
    document.body.appendChild(img);

}