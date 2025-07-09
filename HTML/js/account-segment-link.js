import { auth, db, doc, getDoc, onAuthStateChanged } from './firebase.js';

document.addEventListener('DOMContentLoaded', () => {
  const container = document.getElementById('account-image-container');
  if (!container) return;

  container.addEventListener('click', (e) => {
    const segment = e.target.closest('.image-segment');
    if (!segment) return;

    const playerId = segment.dataset.playerId;
    if (!playerId) {
      window.location.href = 'profile.html';
      return;
    }

    onAuthStateChanged(auth, (user) => {
      if (!user) {
        window.location.href = 'sign-up.html';
        return;
      }
      // Always navigate to the clicked player's page
      window.location.href = `player.html?id=${playerId}`;
    });
  });
});
