const firebase = require('firebase/app');
require('firebase/database');

firebase.initializeApp({
    apiKey: 'AIzaSyDf0dDJp_WiAcqwvrSfBmzJTgXQN5Enwa4',
    authDomain: 'typing-game-80af6.firebaseapp.com',
    databaseURL: 'https://typing-game-80af6.firebaseio.com',
    projectId: 'typing-game-80af6',
    storageBucket: 'typing-game-80af6.appspot.com',
    messagingSenderId: '786274798919',
});

const db = firebase.database();

export default db;
