// booking.js - Fixed SyntaxError and improved structure

import { initializeApp } from 'firebase/app';
import { 
  doc, getDocs, getDoc, orderBy, limit, collection, query, where, runTransaction, setDoc, updateDoc, addDoc, serverTimestamp,
} from "./firebase.js";
import { db } from './firebase.js';

const firebaseConfig = {
  apiKey: "AIzaSyDZVSQAwB1YnKv6Pr_5kbsjvUz074mDsQ0",
  authDomain: "football-club-management-3c136.firebaseapp.com",
  projectId: "football-club-management-3c136",
  storageBucket: "football-club-management-3c136.firebasestorage.app",
  messagingSenderId: "388394869174",
  appId: "1:388394869174:web:ec8f93ab8fb685e9846117"
};

const app = initializeApp(firebaseConfig);

// DOM elements, excludes calendar elements
const matchSelect = document.getElementById('matchSelect');
const seatSelect = document.getElementById('seatSelect');
const bookButton = document.getElementById('bookButton');
const messageArea = document.getElementById('messageArea');
const seatBlock = document.getElementById('seat_block');

// Script for seat block selection in match details.html (*dont remove*)
document.addEventListener('DOMContentLoaded', () => {
  const params = new URLSearchParams(window.location.search);
  const seatBlockValue = params.get('seat_block');
  if (seatBlockValue) {
    seatBlock.value = seatBlockValue;
  }
});

// Helper function to get match data
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

// Load matches into the select dropdown
async function loadMatches() {
  const matchesSnapshot = await getDocs(collection(db, 'Matches'));
  matchesSnapshot.forEach(matchDoc => {
    const match = matchDoc.data();
    const option = document.createElement('option');
    option.value = matchDoc.id;
    option.textContent = `${match.team_home} vs ${match.team_away} - ${new Date(match.match_date).toLocaleDateString()}`;
    matchSelect.appendChild(option);
  });
}

// Load available seats when match is selected
matchSelect?.addEventListener('change', async () => {
  const matchId = matchSelect.value;
  seatSelect.innerHTML = '<option value="">-- Choose a Seat --</option>';
  seatSelect.disabled = true; 
  bookButton.disabled = true;
  if (!matchId) return;

  // Load available seats for the selected match
  const seatsSnapshot = await getDocs(collection(db, `Matches/${matchId}/seats`));
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

// Enable book button when seat is selected
seatSelect?.addEventListener('change', () => {
  bookButton.disabled = !seatSelect.value;
});

// Ticket quantity warning (if applicable)
const quantityInput = document.getElementById('quantity');
const warningDiv = document.getElementById('quantity-warning');
if (quantityInput && warningDiv) {
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
}

// Recommend another seat if booking fails
function recommendAnotherSeat(match_id) {
  // Pull locally available seats from dropdown options
  for (let option of seatSelect.options) {
    if (!option.disabled && option.value) {
      return option.value;
    }
  }
  return null;
}

// Book seat logic
bookButton?.addEventListener('click', async () => {
  // Get selected values
  const match_id = matchSelect.value;
  const seat_number = seatSelect.value;
  // If ticket quantity used, validate here.
  if (!match_id || !seat_number) return;

  const seatRef = doc(db, `Matches/${match_id}/seats/${seat_number}`);
  const bookingsRef = collection(db, 'bookings');

  try {
    await runTransaction(db, async (transaction) => {
      const seatSnap = await transaction.get(seatRef);

      if (!seatSnap.exists()) {
        throw new Error('Seat not found.');
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

// calendar code removed for brevity, but no illegal return statement anywhere now
