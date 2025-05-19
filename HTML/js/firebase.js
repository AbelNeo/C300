// public/js/firebase.js
import { initializeApp } from 'https://www.gstatic.com/firebasejs/9.22.0/firebase-app.js'
import { getFirestore } from 'https://www.gstatic.com/firebasejs/9.22.0/firebase-firestore.js'

const firebaseConfig = {
  apiKey: "AIzaSyDZVSQAwB1YnKv6Pr_5kbsjvUz074mDsQ0",
  authDomain: "football-club-management-3c136.firebaseapp.com",
  projectId: "football-club-management-3c136",
  storageBucket: "football-club-management-3c136.firebasestorage.app",
  messagingSenderId: "388394869174",
  appId: "1:388394869174:web:ec8f93ab8fb685e9846117"
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

export { db };