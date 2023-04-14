importScripts('https://www.gstatic.com/firebasejs/7.2.0/firebase-app.js');
importScripts('https://www.gstatic.com/firebasejs/7.2.0/firebase-messaging.js');

firebase.initializeApp({
  apiKey: 'AIzaSyAgWfa6LJGBW3PfBEcpb1M-8WTKP3wFiK4',
  authDomain: 'fluted-depth-362515.firebaseapp.com',
  projectId: 'fluted-depth-362515',
  storageBucket: 'fluted-depth-362515.appspot.com',
  messagingSenderId: '147801621083',
  appId: '1:147801621083:web:50f9085327535af588357e',
});

const messaging = firebase.messaging();
