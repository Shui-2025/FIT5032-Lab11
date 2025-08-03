// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getAuth } from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyBLZW7iBM7ju3NlCvzLq-IdGECh14JGNV4",
  authDomain: "fit5032-lab-3fd6d.firebaseapp.com",
  projectId: "fit5032-lab-3fd6d",
  storageBucket: "fit5032-lab-3fd6d.firebasestorage.app",
  messagingSenderId: "673163416449",
  appId: "1:673163416449:web:41fd2e004c362599b60e80"
};


const app = initializeApp(firebaseConfig);


const db = getFirestore(app);


const auth = getAuth(app);


export { db, auth };
export default app;
