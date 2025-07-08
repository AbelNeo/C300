import { auth, db, doc, getDoc, onAuthStateChanged } from './firebase.js';

document.addEventListener('DOMContentLoaded', () => {
  const container = document.getElementById('account-image-container');
  if (!container) return;

  // Delegate click event for .image-segment
  container.addEventListener('click', async (e) => {
    // Find the closest .image-segment clicked
    const segment = e.target.closest('.image-segment');
    if (!segment) return;

    // Get current auth state
    onAuthStateChanged(auth, async (user) => {
      if (!user) {
        // Not signed in: go to signup
        window.location.href = 'sign-up.html';
        return;
      }

      // Signed in: check favorites
      const userDoc = await getDoc(doc(db, "Accounts", user.uid));
      const userData = userDoc.exists() ? userDoc.data() : null;
      const favorites = userData?.favoritePlayers || [];

      if (!favorites.length) {
        // No favorites: go to profile to select
        window.location.href = 'profile.html';
        return;
      }

      // User has favorites: go to first favorite's playerPage
      const playerId = favorites[0];
      const playerDoc = await getDoc(doc(db, "Players", playerId));
      const playerData = playerDoc.exists() ? playerDoc.data() : null;

      if (playerData && playerData.playerPage) {
        window.location.href = `${playerData.playerPage}.html`;
      } else {
        // Fallback if no playerPage field
        alert('Player page not found.');
      }
    });
  });
});