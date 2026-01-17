// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getAuth, GoogleAuthProvider } from "firebase/auth";

// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyDuuSqhYlN27D4aglBXaIc5ysG-vaaoTuY",
  authDomain: "arthiksetu-e4fbe.firebaseapp.com",
  projectId: "arthiksetu-e4fbe",
  storageBucket: "arthiksetu-e4fbe.firebasestorage.app",
  messagingSenderId: "623914854162",
  appId: "1:623914854162:web:1f6a7146490e041a9f35cb",
  measurementId: "G-FL5KY0FDMG"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
export const auth = getAuth(app);
export const googleProvider = new GoogleAuthProvider();
