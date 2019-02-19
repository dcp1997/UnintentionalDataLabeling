document.addEventListener("DOMContentLoaded", event => {
    const app = firebase.app();
    console.log(app)
});

function googleLogin() {
    const provider = new firebase.auth.GoogleAuthProvider();
    firebase.auth().signInWithPopup(provider)
        .then(result => {
            const user = result.user;
            document.write(`Hello ${user.displayName}`);
            console.log(user)
        })
        .catch(console.log)
}

var submitTempUserButton = document.getElementById("submit");

function tempUserLogin(){
    var test= "test";
    firebase.database().ref('users/' + userId).set({
        username: test
      });


}