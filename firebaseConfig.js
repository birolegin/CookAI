import { initializeApp } from "firebase/app";
import { getAuth, initializeAuth, getReactNativePersistence } from 'firebase/auth'
import { getFirestore } from 'firebase/firestore'
import ReactNativeAsyncStorage from '@react-native-async-storage/async-storage';


const firebaseConfig = {
    apiKey: "AIzaSyA7JPQAU74L2ylpMHV5sD32EBeoOM47mSg",
    authDomain: "cookai-bf772.firebaseapp.com",
    projectId: "cookai-bf772",
    storageBucket: "cookai-bf772.appspot.com",
    messagingSenderId: "892809679715",
    appId: "1:892809679715:web:dd4495906f793a6e2a7956",
    measurementId: "G-2RYXW86HSZ"
};


export const FIREBASE_APP = initializeApp(firebaseConfig);
// export const FIREBASE_AUTH = getAuth(FIREBASE_APP);
const auth = initializeAuth(FIREBASE_APP, {
    persistence: getReactNativePersistence(ReactNativeAsyncStorage)
});

export const FIREBASE_AUTH = getAuth();
export const FIRESTORE_DB = getFirestore(FIREBASE_APP);
const persistence = getReactNativePersistence(ReactNativeAsyncStorage);
// const auth = getAuth(FIREBASE_APP);
// auth.setPersistence(persistence);