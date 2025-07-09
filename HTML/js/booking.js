import { FullCalendar } from 'https://cdn.jsdelivr.net/npm/fullcalendar@6.1.17/index.global.min.js'
import { initializeApp } from 'firebase/app';
import { db, auth } from './firebase.js';

import { 
  doc, getDocs, orderBy,limit, collection, query, where, runTransaction, setDoc, updateDoc, addDoc, serverTimestamp,
  getAuth, onAuthStateChanged, createUserWithEmailAndPassword, GoogleAuthProvider, signInWithPopup, OAuthProvider, sendEmailVerification, onSnapshot, deleteDoc
} from "https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js";


const firebaseConfig = {
  apiKey: "AIzaSyDZVSQAwB1YnKv6Pr_5kbsjvUz074mDsQ0",
  authDomain: "football-club-management-3c136.firebaseapp.com",
  projectId: "football-club-management-3c136",
  storageBucket: "football-club-management-3c136.appspot.com",
  messagingSenderId: "388394869174",
  appId: "1:388394869174:web:ec8f93ab8fb685e9846117"
};

const app = initializeApp(firebaseConfig);


//DOM elements, excludes calendar elements
const matchSelect = document.getElementById('matchSelect');
const seatSelect = document.getElementById('seatSelect');
const bookButton = document.getElementById('bookButton');
const messageArea = document.getElementById('messageArea');
const seatBlock = document.getElementById('seat_block');


//script for seat block selection in match details.html (*dont remove*)
document.addEventListener('DOMContentLoaded', () => {
  const params = new URLSearchParams(window.location.search);
  const seatBlock = params.get('seat_block');

  if (seatBlock) {
    document.getElementById('seat_block').value = seatBlock;
  }
});

//calendar code was removed from here






  


async function getMatchData(match_id) {
  try {
    const docRef = doc(db, 'Matches', match_id);
    const docSnap = await getDoc(docRef);
    return docSnap.exists() ? docSnap.data() : null;
  } catch (error) {
    console.error("Error getting match information:", error);
    return null;
  }
}


  // Load matches
  async function loadMatches() {
    const matchesSnapshot = await getDocs(collection(db, 'matches'));
    matchesSnapshot.forEach(matchDoc => {
      const match = matchDoc.data();
      const option = document.createElement('option');
      option.value = matchDoc.id;
      option.textContent = `${match.teamHome} vs ${match.teamAway} - ${new Date(match.match_date).toLocaleDateString()}`;
      matchSelect.appendChild(option);
    });
  }

  matchSelect.addEventListener('change', async () => {
    const matchId = matchSelect.value;
    seatSelect.innerHTML = '<option value="">-- Choose a Seat --</option>';
    seatSelect.disabled = true;
    bookButton.disabled = true;

    if (!matchId) return;

    // Load available seats for the selected match
    const seatsSnapshot = await getDocs(collection(db, `matches/${matchId}/seats`));
    seatsSnapshot.forEach(seatDoc => {
      const seat = seatDoc.data();
      if (!seat.booked) {
        const option = document.createElement('option');
        option.value = seatDoc.id;
        option.textContent = seatDoc.id;
        seatSelect.appendChild(option);
      }
    });

    seatSelect.disabled = false;
  });

  seatSelect.addEventListener('change', () => {
    bookButton.disabled = !seatSelect.value;
  });

  //bookButton for ticket quantity
  bookButton.addEventListener('click', async () => {
    const quantityInput = document.getElementById('quantity');
    const warningDiv = document.getElementById('quantity-warning');
    const quantity = parseInt(quantityInput.value);

    quantityInput.addEventListener('input', () => {
      const quantity = parseInt(quantityInput.value);

      if (isNaN(quantity) || quantity <= 0) {
        warningDiv.textContent = 'Please enter a valid quantity.';
        warningDiv.style.display = 'block';
      } else if (quantity > 10000) {
        warningDiv.textContent = 'Ticket quantity cannot exceed 10,000.';
        warningDiv.style.display = 'block';
      } else {
        warningDiv.textContent = '';
        warningDiv.style.display = 'none';
      }
    });

    //original version
    const match_id = matchSelect.value;
    const seat_number = seatSelect.value;

    if (!match_id || !seat_number) return;

    const seatRef = doc(db, `matches/${match_id}/seats/${seat_number}`);
    const bookingsRef = collection(db, 'bookings');

    try {
      await runTransaction(db, async (transaction) => {
        const seatSnap = await transaction.get(seatRef)

        if (!seatSnap.exists()) {
          throw new Error('Seat not found.')
        }

        const seatData = seatSnap.data();

        if (seatData.booked) {
          throw new Error('Seat is already booked.');
        }
    
        // 1. Mark seat as booked
        transaction.update(seatRef, { booked: true });

        // 2. Create booking
        const newBookingRef = doc(bookingsRef);
        transaction.set(newBookingRef, {
          bookingId: newBookingRef.id,
          userId: 1, // Replace this with actual user ID in production
          itemType: 'match',
          referenceId: match_id,
          status: 'confirmed',
          bookingDate: new Date().toISOString()
        });
      });

      messageArea.textContent = `Seat ${seat_number} successfully booked!`;
      seatSelect.querySelector(`option[value="${seat_number}"]`).remove();
      bookButton.disabled = true;

    } catch (error) {
      console.error(error);

      // recommend another available seat if the seat is already taken
      if (error.message === 'Seat is already booked.') {
        const altSeatOption = recommendAnotherSeat(match_id);
        if (altSeatOption) {
          messageArea.textContent += ` Try seat ${altSeatOption}.`;
        }
      } else {
        messageArea.textContent = 'Booking failed. Please try again.';
      }
    }
  });


/*calendar code (*dont remove*)
document.addEventListener('DOMContentLoaded', function () {
  const db = firebase.firestore();
  const calendarEl = document.getElementById('calendar');

  const calendar = new FullCalendar.Calendar(calendarEl, {
    initialView: 'dayGridMonth',
    events: async function(fetchInfo, successCallback, failureCallback) {
      try {
        const matchesSnapshot = await db.collection('matches').get();
        const events = matchesSnapshot.docs.map(doc => {
          const match = doc.data();
          return {
            id: doc.id,
            title: `${match.team_home} vs ${match.team_away}`,
            start: match.match_date.toDate(),
            extendedProps: {
              team_home: match.team_home,
              team_away: match.team_away
            }
        };
      });
      successCallback(events);
    } catch (error) {
      console.error('Error loading matches:', error);
      failureCallback(error);
    }
  },
  eventClick: function(info) {
      const match = info.event.extendedProps;
      const match_id = info.event.id;
      const urlParams = new URLSearchParams({
        match_id: match_id,
        date: info.event.start.toISOString(),
        team_home: match.team_home,
        team_away: match.team_away
      });
      window.location.href = `bookingform.html?${urlParams.toString()}`;
    },
    dateClick: async function(info) {
      const selectedDate = info.dateStr;

    // Fetch events again from Firestore for this specific date
    //  const snapshot = await getDocs(collection(db,'matches'));
    //  const eventsOnDate = snapshot.docs.filter(doc => {
    //    const match = doc.data();
    //    const matchDate = match.match_date.toDate().toISOString().split('T')[0];
    //    return matchDate === selectedDate;
    //  });
  
      if (eventsOnDate.length > 0) {
        let popupContent = '';
        eventsOnDate.forEach(doc => {
          const match = doc.data();
          popupContent += `${match.team_home} vs ${match.team_away}\n`;
        });
        alert(`Matches on ${selectedDate}:\n${popupContent}`);
      } else {
        alert(`No matches on ${selectedDate}`);
      }
    }
  });
  calendar.render();
}); */