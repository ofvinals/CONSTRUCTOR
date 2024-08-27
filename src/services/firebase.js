// Import the functions you need from the SDKs you need
import { initializeApp } from 'firebase/app';
// import { getAnalytics } from 'firebase/analytics';
import { getFirestore } from 'firebase/firestore';
import { getAuth } from 'firebase/auth';
import { getStorage } from 'firebase/storage';

const firebaseConfig = {
	apiKey: 'AIzaSyBR1Aw8jamDmO1yaZooXXMGfZChCk7qivU',
	authDomain: 'constractor-c31d0.firebaseapp.com',
	projectId: 'constractor-c31d0',
	storageBucket: 'constractor-c31d0.appspot.com',
	messagingSenderId: '646869424807',
	appId: '1:646869424807:web:180c2688f9b0223b711982',
	measurementId: 'G-XLVEZ8S9BK',
};

const app = initializeApp(firebaseConfig);
// const analytics = getAnalytics(app);
export const auth = getAuth(app);
export const db = getFirestore(app);
export const storage = getStorage(app);
