// // Import the functions you need from the SDKs you need
// import { initializeApp } from "firebase/app";
// import 'firebase/auth'
// // TODO: Add SDKs for Firebase products that you want to use
// // https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration

//ading chatgpt
import { initializeApp } from "firebase/app";
import {
  getAuth,
  GoogleAuthProvider,
  signInWithPopup,
  signOut,
  setPersistence,
  browserSessionPersistence,
} from "firebase/auth";
const firebaseConfig = {
  apiKey: "AIzaSyD1cSPOw2njz63EZIwS_4FvngsAHOcV-KU",
  authDomain: "fivvernew-a11d9.firebaseapp.com",
  projectId: "fivvernew-a11d9",
  storageBucket: "fivvernew-a11d9.appspot.com",
  messagingSenderId: "306901686357",
  appId: "1:306901686357:web:e75ba58c1bb0e1c13d5cdc",
  measurementId: "G-VR1T5K2F6L",
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const provider = new GoogleAuthProvider();
setPersistence(auth, browserSessionPersistence);

export { auth, provider, signInWithPopup, signOut };
