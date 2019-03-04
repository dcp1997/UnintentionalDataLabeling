import app from 'firebase/app';
const config = {
    apiKey: AIzaSyBG0Qkj858Axm39hTx_AXEshQUJGQHi6HE,
    authDomain: "unintentional-data-labeling.firebaseapp.com",
    databaseURL: "https://unintentional-data-labeling.firebaseio.com",
    projectId: "unintentional-data-labeling",
    storageBucket: "unintentional-data-labeling.appspot.com",
    messagingSenderId: "750426975197"
  };

class Firebase {
    constructor() {
        app.initializeApp(config);

        this.auth= app.auth();
        this.db = app.database();
    }
    user = uid => this.db.ref(`users/${uid}`);
    users = () => this.db.ref('users');
}
export default Firebase;