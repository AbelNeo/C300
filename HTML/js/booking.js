import { db, collection, getDocs, doc, getDoc, setDoc, updateDoc, runTransaction, recommendAnotherSeat } from './firebase.js';
import { FullCalendar } from 'https://cdn.jsdelivr.net/npm/fullcalendar@6.1.17/index.global.min.js'

const matchSelect = document.getElementById('matchSelect');
const seatSelect = document.getElementById('seatSelect');
const bookButton = document.getElementById('bookButton');
const messageArea = document.getElementById('messageArea');

//calendar code
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
            id: match_id,
            title: `${match.team_home} vs ${match.team_away}`,
            start: match_date,
          };
        });
        successCallback(events);
      } catch (error) {
        console.error('Error loading matches:', error);
        failureCallback(error);
      }
    },
    eventClick: function(info) {
      const match_id = info.event.id;
      window.location.href = `bookingform.html?match_id=${match_id}`;
    }
  });

  calendar.render();
});



// Load matches
async function loadMatches() {
  const matchesSnapshot = await getDocs(collection(db, 'matches'));
  matchesSnapshot.forEach(matchDoc => {
    const match = matchDoc.data();
    const option = document.createElement('option');
    option.value = matchDoc.id;
    option.textContent = `${match.teamHome} vs ${match.teamAway} - ${new Date(match.matchDate).toLocaleDateString()}`;
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

bookButton.addEventListener('click', async () => {
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

