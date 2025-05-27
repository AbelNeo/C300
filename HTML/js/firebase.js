import {
  getDocs,
  doc,
  getDoc,
  collection,
  query,
  where,
  runTransaction,
  setDoc,
  updateDoc,
  addDoc,  
  serverTimestamp 
} from "firebase/firestore";

import { initializeApp } from 'https://www.gstatic.com/firebasejs/9.22.0/firebase-app.js'
import { getFirestore } from 'https://www.gstatic.com/firebasejs/9.22.0/firebase-firestore.js'
import { getAuth, onAuthStateChanged } from 'https://www.gstatic.com/firebasejs/9.22.0/firebase-auth.js'

const firebaseConfig = {
  apiKey: "AIzaSyDZVSQAwB1YnKv6Pr_5kbsjvUz074mDsQ0",
  authDomain: "football-club-management-3c136.firebaseapp.com",
  projectId: "football-club-management-3c136",
  storageBucket: "football-club-management-3c136.appspot.com",
  messagingSenderId: "388394869174",
  appId: "1:388394869174:web:ec8f93ab8fb685e9846117"
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

// Your custom function remains the same
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
  // ... (unchanged)
}

const auth = getAuth(app);


// Export your custom functions
export { db, auth, onAuthStateChanged, bookSeat, recommendAnotherSeat };

































// import {
//   getDocs,
//   doc,
//   getDoc,
//   collection,
//   query,
//   where,
//   runTransaction,
//   setDoc,
//   updateDoc,
//   bookSeat,
// } from "firebase/firestore";

// import { initializeApp } from 'https://www.gstatic.com/firebasejs/9.22.0/firebase-app.js'
// import { getFirestore } from 'https://www.gstatic.com/firebasejs/9.22.0/firebase-firestore.js'

// const firebaseConfig = {
//   apiKey: "AIzaSyDZVSQAwB1YnKv6Pr_5kbsjvUz074mDsQ0",
//   authDomain: "football-club-management-3c136.firebaseapp.com",
//   projectId: "football-club-management-3c136",
//   storageBucket: "football-club-management-3c136.firebasestorage.app",
//   messagingSenderId: "388394869174",
//   appId: "1:388394869174:web:ec8f93ab8fb685e9846117"
// };

// const app = initializeApp(firebaseConfig);
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
//         bookingId: Date.now(), // or UUID
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

// export { db, getDocs, doc,getDoc, collection, query, where,runTransaction, setDoc, updateDoc, recommendAnotherSeat, bookSeat };



