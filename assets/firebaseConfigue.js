// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyBoWeqxvtceC23eIBQBNX4gzK5_W0Jcbk0",
  authDomain: "expofirebasepractice.firebaseapp.com",
  projectId: "expofirebasepractice",
  storageBucket: "expofirebasepractice.firebasestorage.app",
  messagingSenderId: "102150469123",
  appId: "1:102150469123:web:9059069a68115ff18bc036",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);

export { app, auth, db };

