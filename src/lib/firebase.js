import * as firebase from 'firebase';
import myFirebaseConfig from 'config/firebase';

const firebaseConfig = {
  apiKey: myFirebaseConfig.API_KEY,
  authDomain: myFirebaseConfig.AUTH_DOMAIN,
  databaseURL: myFirebaseConfig.DATABASE_URL,
  projectId: myFirebaseConfig.PROJECT_ID,
  storageBucket: myFirebaseConfig.STORAGE_BUCKET,
  messagingSenderId: myFirebaseConfig.MESSAGING_SENDER_ID,
};

// Initialize Firebase
firebase.initializeApp(firebaseConfig);
export default firebase;
