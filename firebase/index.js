import { initializeApp } from "firebase/app";
import { getFirestore, 
  collection, 
  addDoc, 
  getDocs, 
  updateDoc,
  doc,
  deleteDoc
} from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyDEsdvdvRhlCFQ5yQGmjAu7Gw8Y0H5FiNI",
  authDomain: "shoppinglistapp-e8592.firebaseapp.com",
  projectId: "shoppinglistapp-e8592",
  storageBucket: "shoppinglistapp-e8592.appspot.com",
  messagingSenderId: "222252732303",
  appId: "1:222252732303:web:c04c3ebff4e7cd06a5c5fa",
  measurementId: "G-53N83STYM2"
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

export {app, db, getFirestore, collection, addDoc, getDocs, updateDoc, doc, deleteDoc}