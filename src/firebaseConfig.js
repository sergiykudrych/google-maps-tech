import { initializeApp } from 'firebase/app';
import { getDatabase, ref, push, set, remove, update } from 'firebase/database';

const firebaseConfig = {
  apiKey: 'AIzaSyADmkwNcANtj3Xr6uET6bG60mirpBXB0XA',
  authDomain: 'map-test-153c2.firebaseapp.com',
  databaseURL: 'https://map-test-153c2-default-rtdb.firebaseio.com',
  projectId: 'map-test-153c2',
  storageBucket: 'map-test-153c2.appspot.com',
  messagingSenderId: '45032744478',
  appId: '1:45032744478:web:42934cae930b89929ff00f',
  measurementId: 'G-DBMDF7Z9CG',
};

const app = initializeApp(firebaseConfig);
const database = getDatabase(app);

export { database, ref, push, set, remove, update };
