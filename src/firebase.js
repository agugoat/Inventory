import { initializeApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';

const firebaseConfig = {
  apiKey: "AIzaSyBdOFygKLQ_zigGInyIR-wP-KxghEjNctI",
  authDomain: "inventory-99cdf.firebaseapp.com",
  projectId: "inventory-99cdf",
  storageBucket: "inventory-99cdf.appspot.com",
  messagingSenderId: "632274005682",
  appId: "1:632274005682:web:07ca25e38f015db630e3ab"
};

 const app = initializeApp(firebaseConfig);
const firestore = getFirestore(app);
export { firestore };
// scibiity