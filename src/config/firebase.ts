// Import the functions you need from the SDKs you need
import { getApp, getApps, initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getAuth, GoogleAuthProvider } from "firebase/auth";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyA4FyI1vO3rJ-syHz0YvtPmsp8i_G4uxQk",
  authDomain: "whatsapp-clone-5326a.firebaseapp.com",
  projectId: "whatsapp-clone-5326a",
  storageBucket: "whatsapp-clone-5326a.appspot.com",
  messagingSenderId: "746838866086",
  appId: "1:746838866086:web:063add00dc887186831c67",
};

// Initialize Firebase
const app = getApps().length > 0 ? getApp() : initializeApp(firebaseConfig);

const db = getFirestore(app);

const auth = getAuth(app);

const provider = new GoogleAuthProvider();

export { db, auth, provider };
