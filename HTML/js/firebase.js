// Add Firebase Storage support to your firebase.js

import { initializeApp } from 'firebase/app';
import {
  getFirestore, doc, getDoc, collection, query, where, runTransaction, setDoc, updateDoc, addDoc, serverTimestamp, getDocs
} from 'firebase/firestore';
import {
  getAuth, fetchSignInMethodsForEmail, signInWithEmailAndPassword, onAuthStateChanged, createUserWithEmailAndPassword,
  GoogleAuthProvider, signInWithPopup, OAuthProvider, sendEmailVerification, signOut, setPersistence, browserLocalPersistence
} from "https://www.gstatic.com/firebasejs/10.7.1/firebase-auth.js";
import {
  getStorage, ref, uploadBytes, getDownloadURL, deleteObject
} from "https://www.gstatic.com/firebasejs/10.7.1/firebase-storage.js"; // <-- Add this line

const firebaseConfig = {
  apiKey: "AIzaSyDZVSQAwB1YnKv6Pr_5kbsjvUz074mDsQ0",
  authDomain: "football-club-management-3c136.firebaseapp.com",
  projectId: "football-club-management-3c136",
  storageBucket: "football-club-management-3c136.firebasestorage.app",
  messagingSenderId: "388394869174",
  appId: "1:388394869174:web:ec8f93ab8fb685e9846117"
};

const app = initializeApp(firebaseConfig);
// Initialize Auth with persistence
const auth = getAuth(app);
setPersistence(auth, browserLocalPersistence)
  .catch((error) => {
    console.error("Error setting auth persistence:", error);
  });
const db = getFirestore(app);
const storage = getStorage(); // <-- Add this line

async function bookSeat(match_id, seat_number, user_id) {
  const seatRef = doc(db, `matches/${match_id}/seats/${seat_number}`);
  const bookingRef = collection(db, "bookings");

  try {
    await runTransaction(db, async (transaction) => {
      const seatDoc = await transaction.get(seatRef);

      if (!seatDoc.exists()) {
        throw "Seat not found!";
      }

      const seatData = seatDoc.data();

      if (seatData.booked) {
        throw "Seat already booked";
      }

      // 1. Mark seat as booked
      transaction.update(seatRef, { booked: true });

      // 2. Create booking
      await addDoc(bookingRef, {
        bookingId: Date.now(),
        userId: user_id,
        itemType: "match",
        referenceId: match_id,
        status: "confirmed",
        bookingDate: serverTimestamp()
      });
    });

    document.getElementById("status").innerText = "Seat successfully booked!";
  } catch (e) {
    console.error("Booking failed:", e);
    document.getElementById("status").innerText = "Seat already taken. Please choose another.";
    recommendAnotherSeat(match_id);
  }
}

function recommendAnotherSeat(match_id) {
  // Pull locally available seats from dropdown options
  const seatSelect = document.getElementById("seatSelect");
  for (let option of seatSelect.options) {
    if (!option.disabled) {
      document.getElementById("status").innerText += ` Try seat ${option.value}`;
      break;
    }
  }
}

async function updateFavorites(userId, newFavorites) {
  await updateDoc(doc(db, "Accounts", userId), {
    favoritePlayers: newFavorites.slice(0, 3) // Store max 3
  });
}

// Export your custom functions and Firebase objects
export {
  db, auth, storage, // <-- Export storage
  // Firestore functions
  getDocs, doc, getDoc, collection, query, where, runTransaction, setDoc, updateDoc, addDoc, serverTimestamp,
  // Auth functions
  onAuthStateChanged, fetchSignInMethodsForEmail, signInWithEmailAndPassword, createUserWithEmailAndPassword, GoogleAuthProvider, signInWithPopup, OAuthProvider, sendEmailVerification, signOut,
  // Storage functions
  ref, uploadBytes, getDownloadURL, deleteObject // <-- Export storage utils
};




// import { initializeApp } from 'firebase/app';
// import { getFirestore, doc, getDoc, collection, query, where, runTransaction, setDoc, updateDoc, addDoc, serverTimestamp, getDocs} from 'firebase/firestore';
// import { getAuth, fetchSignInMethodsForEmail, signInWithEmailAndPassword, onAuthStateChanged, createUserWithEmailAndPassword, GoogleAuthProvider, signInWithPopup, OAuthProvider, sendEmailVerification, signOut, setPersistence, browserLocalPersistence} from "https://www.gstatic.com/firebasejs/10.7.1/firebase-auth.js";

  
// const firebaseConfig = {
//   apiKey: "AIzaSyDZVSQAwB1YnKv6Pr_5kbsjvUz074mDsQ0",
//   authDomain: "football-club-management-3c136.firebaseapp.com",
//   projectId: "football-club-management-3c136",
//   storageBucket: "football-club-management-3c136.appspot.com",
//   messagingSenderId: "388394869174",
//   appId: "1:388394869174:web:ec8f93ab8fb685e9846117"
// };

// const app = initializeApp(firebaseConfig);
// // Initialize Auth with persistence
// const auth = getAuth(app);
// setPersistence(auth, browserLocalPersistence)
//   .catch((error) => {
//     console.error("Error setting auth persistence:", error);
//   });
// const db = getFirestore(app);

// async function bookSeat(match_id, seat_number, user_id) {
//   const seatRef = doc(db, `matches/${match_id}/seats/${seat_number}`);
//   const bookingRef = collection(db, "bookings");

//   try { 
//     await runTransaction(db, async (transaction) => {
//       const seatDoc = await transaction.get(seatRef);

//       if (!seatDoc.exists()) {
//         throw "Seat not found!";
//       }

//       const seatData = seatDoc.data();

//       if (seatData.booked) {
//         throw "Seat already booked";
//       }

//       // 1. Mark seat as booked
//       transaction.update(seatRef, { booked: true });

//       // 2. Create booking
//       await addDoc(bookingRef, {
//         bookingId: Date.now(),
//         userId: user_id,
//         itemType: "match",
//         referenceId: match_id,
//         status: "confirmed",
//         bookingDate: serverTimestamp()
//       });
//     });

//     document.getElementById("status").innerText = "Seat successfully booked!";
//   } catch (e) {
//     console.error("Booking failed:", e);
//     document.getElementById("status").innerText = "Seat already taken. Please choose another.";
//     recommendAnotherSeat(match_id);
//   }
// }

// function recommendAnotherSeat(match_id) {

//   // Pull locally available seats from dropdown options
//   const seatSelect = document.getElementById("seatSelect");
//   for (let option of seatSelect.options) {
//     if (!option.disabled) {
//       document.getElementById("status").innerText += ` Try seat ${option.value}`;
//       break;
//     }
//   }
// }

// async function updateFavorites(userId, newFavorites) {
//   await updateDoc(doc(db, "Accounts", userId), {
//     favoritePlayers: newFavorites.slice(0, 3) // Store max 3
//   });
// }


// // Export your custom functions
// export {   db, auth,
//   // Firestore functions
//   getDocs, doc, getDoc, collection, query, where, runTransaction, setDoc, updateDoc, addDoc, serverTimestamp,
//   // Auth functions
//   onAuthStateChanged, fetchSignInMethodsForEmail, signInWithEmailAndPassword, createUserWithEmailAndPassword, GoogleAuthProvider, signInWithPopup, OAuthProvider, sendEmailVerification, signOut };