// Import the functions you need from the SDKs you need
import { initializeApp } from 'firebase/app';
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: 'AIzaSyBC6Ex5oeA9ICNG8lO1bCeNnp4f0-bNjVU',
  authDomain: 'recisnap.firebaseapp.com',
  projectId: 'recisnap',
  storageBucket: 'recisnap.appspot.com',
  messagingSenderId: '924203588296',
  appId: '1:924203588296:web:2c3351678558628b4d23fd',
  measurementId: 'G-8MF8Z1RPMS'
};

// Initialize Firebase
//const analytics = getAnalytics(app);

export const app = initializeApp(firebaseConfig);
