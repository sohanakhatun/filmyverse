import { initializeApp } from "firebase/app";
import {getFirestore, collection} from 'firebase/firestore'
const firebaseConfig = {
  apiKey: "AIzaSyDFAxWyGNRhayWPfowtEIzmKzmlufwVEUI",
  authDomain: "filmyverse-d18b6.firebaseapp.com",
  projectId: "filmyverse-d18b6",
  storageBucket: "filmyverse-d18b6.appspot.com",
  messagingSenderId: "608123804506",
  appId: "1:608123804506:web:da46b22629a71df62a3163"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
// accessing the database
export const db = getFirestore(app);
// accessing the collection named movies
export const moviesRef = collection(db,"Movies");
export const reviewsRef = collection(db,"reviews");
export const usersRef = collection(db,"Authentication");
export default app;