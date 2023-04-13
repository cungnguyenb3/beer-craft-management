import { initializeApp } from 'firebase/app';
import { getMessaging } from 'firebase/messaging';

const firebaseConfig = {
  apiKey: 'AIzaSyAgWfa6LJGBW3PfBEcpb1M-8WTKP3wFiK4',
  authDomain: 'fluted-depth-362515.firebaseapp.com',
  projectId: 'fluted-depth-362515',
  storageBucket: 'fluted-depth-362515.appspot.com',
  messagingSenderId: '147801621083',
  appId: '1:147801621083:web:50f9085327535af588357e',
};

const app = initializeApp(firebaseConfig);
const messaging = getMessaging(app);

getToken(messaging, { vapidKey: 'BFSzaLNc9oqaXU6dgCFYKC3E-S_o7fnRc_I97i93r3HVU9Ven-6_1D65IugkRQAUxKTJz9nJXpLtZ9lKk6UbmOU' }).then(
  currentToken => {
    if (currentToken) {
      console.log('currentToken', currentToken);
    } else {
      console.log('Can not get token');
    }
  }
);
