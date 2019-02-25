var image = {
    Link: "",
    votes: 0,
    selected: false,
    owner: ""
};

var vm = new Vue({
    image: image
})

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

function readDB() {

    const keys = Object.keys(images)

    // Generate random index based on number of keys
    const randIndex = Math.floor(Math.random() * keys.length)

    // Select a key from the array of keys using the random index
    const randKey = keys[randIndex]

    // Use the key to get the corresponding name from the "names" object
    const name = names[randKey]


    // const maxImages = 3;
    // const randomIndex = Math.floor(Math.random() * maxImages);
    // var ref = firebase.database().ref('Images');

    // ref.orderByChild("RandomVal").limitToFirst(1).on('value' , function (snapshot) {
    //     var test = snapshot.val();
    //     console.log(snapshot.val());
    //     //var url = snapshot.val().Link;
    //     console.log(snapshot.val().property);
    //     //console.log(url);
    //     //var img = document.createElement("img");
    //     //img.src = url;
    //     //document.body.appendChild(img);
    // });


    //var ref = firebase.database().ref("Images/keyGUID/");
    // ref.on("value", function (snapshot) {
    //     console.log(snapshot.val());
    //     var url = snapshot.val().Link;
    //     var img = document.createElement("img");
    //     img.src = url;
    //     document.body.appendChild(img);
    // }, function (error) {
    //     console.log("Error: " + error.code);
    // });
}

function createLobby() {
    var ref = firebase.database().ref("Lobby/");
    var username = document.getElementById('usernameShow').textContent;
    ref.push({
        username: {
            number: 1
        }
    });
    app3.seen = !app3.seen;
}






function addNewItem() {
    app4.todos.push({
        text: 'New item'
    });
}

var app = new Vue({
    el: '#app',
    data: {
        message: 'Hello Wrold'
    }
})
var app2 = new Vue({
    el: '#app-2',
    data: {
        message: 'You loaded this page on ' + new Date().toLocaleString()
    }
})
var app3 = new Vue({
    el: '#app-3',
    data: {
        seen: false
    }
})

var app4 = new Vue({
    el: '#app-4',
    data: {
        todos: [{
                text: 'Learn JavaScript'
            },
            {
                text: 'Learn Vue'
            },
            {
                text: 'Build something awesome'
            }
        ]
    }
})

var app5 = new Vue({
    el: '#app-5',
    data: {
        message: 'Hello Vue.js!'
    },
    methods: {
        reverseMessage: function () {
            this.message = this.message.split('').reverse().join('')
        }
    }
})