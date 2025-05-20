import { db, collection, getDocs, doc, getDoc, setDoc, updateDoc } from './firebase.js';

const matchSelect = document.getElementById('matchSelect');
const seatSelect = document.getElementById('seatSelect');
const bookButton = document.getElementById('bookButton');
const messageArea = document.getElementById('messageArea');

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
  const matchId = matchSelect.value;
  const seatId = seatSelect.value;

  if (!matchId || !seatId) return;

  const seatRef = doc(db, `matches/${matchId}/seats/${seatId}`);
  const seatSnap = await getDoc(seatRef);

  if (!seatSnap.exists()) {
    messageArea.textContent = 'Seat not found!';
    return;
  }

  const seatData = seatSnap.data();

  if (seatData.booked) {
    messageArea.textContent = 'Seat already booked. Please choose another.';
    return;
  }

  // Book the seat (simulate locking by writing 'booked: true')
  try {
    await updateDoc(seatRef, { booked: true });

    // Optionally: Save booking to a separate bookings collection
    const bookingRef = doc(collection(db, 'bookings'));
    await setDoc(bookingRef, {
      bookingId: bookingRef.id,
      userId: 1, // Replace with actual user session ID later
      itemType: 'match',
      referenceId: parseInt(matchId),
      status: 'confirmed',
      bookingDate: new Date().toISOString()
    });

    messageArea.textContent = `Seat ${seatId} successfully booked!`;
    seatSelect.querySelector(`option[value="${seatId}"]`).remove();
    bookButton.disabled = true;

  } catch (error) {
    messageArea.textContent = 'Booking failed. Please try again.';
    console.error(error);
  }
});

// Initialize
loadMatches();
