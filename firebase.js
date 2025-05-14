// // Import the functions you need from the SDKs you need
// import { initializeApp } from "firebase/app";
// import { getAnalytics } from "firebase/analytics";
// // TODO: Add SDKs for Firebase products that you want to use
// // https://firebase.google.com/docs/web/setup#available-libraries

// // Your web app's Firebase configuration
// // For Firebase JS SDK v7.20.0 and later, measurementId is optional
// const firebaseConfig = {
//   apiKey: "AIzaSyDZVSQAwB1YnKv6Pr_5kbsjvUz074mDsQ0",
//   authDomain: "football-club-management-3c136.firebaseapp.com",
//   projectId: "football-club-management-3c136",
//   storageBucket: "football-club-management-3c136.firebasestorage.app",
//   messagingSenderId: "388394869174",
//   appId: "1:388394869174:web:ec8f93ab8fb685e9846117",
//   measurementId: "G-Z9P2RHQQQQ"
// };

// // Initialize Firebase
// const app = initializeApp(firebaseConfig);
// const analytics = getAnalytics(app);
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyDZVSQAwB1YnKv6Pr_5kbsjvUz074mDsQ0",
  authDomain: "football-club-management-3c136.firebaseapp.com",
  projectId: "football-club-management-3c136",
  storageBucket: "football-club-management-3c136.firebasestorage.app",
  messagingSenderId: "388394869174",
  appId: "1:388394869174:web:ec8f93ab8fb685e9846117"
  // Removed measurementId since we're not using Analytics
};

// Initialize Firebase without Analytics
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

export { db };