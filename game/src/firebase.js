
import firebase from 'firebase'
  // Initialize Firebase
  var config = {
    apiKey: "AIzaSyBG0Qkj858Axm39hTx_AXEshQUJGQHi6HE",
    authDomain: "unintentional-data-labeling.firebaseapp.com",
    databaseURL: "https://unintentional-data-labeling.firebaseio.com",
    projectId: "unintentional-data-labeling",
    storageBucket: "unintentional-data-labeling.appspot.com",
    messagingSenderId: "750426975197"
  };
  firebase.initializeApp(config);
  export default firebase;