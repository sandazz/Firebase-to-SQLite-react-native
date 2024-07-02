// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries
import { getReactNativePersistence, initializeAuth} from 'firebase/auth'
import AsyncStorage from "@react-native-async-storage/async-storage";
import { collection, getFirestore } from "firebase/firestore";

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyCfyHUEQ6b51Uj2p12S9lTwbLTq1V7AdNY",
  authDomain: "data-dynamos-co.firebaseapp.com",
  projectId: "data-dynamos-co",
  storageBucket: "data-dynamos-co.appspot.com",
  messagingSenderId: "907416295621",
  appId: "1:907416295621:web:9ab180fcf1500f36f1b8ac"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig); 

export const auth = initializeAuth(app, {
    persistence: getReactNativePersistence(AsyncStorage)
})

export const db = getFirestore(app)

export const usersRef = collection(db, 'users');
export const devicesRef = collection(db, 'devices');
export const preferencesRef = collection(db, 'preferences');