// Single import statement for all Firebase auth-related functions
import { 
  db,
  auth, 
  doc,
  getDoc,
  getDocs,
  onAuthStateChanged,
  GoogleAuthProvider, 
  signInWithPopup, 
  OAuthProvider,
  signOut
} from './firebase.js';

import { getFavoritePlayer } from "./players.js";
import { renderPlayersGrid } from "./playerCard.js";

// Navbar Auth Manager - Enhanced version
const NavbarAuth = {
  init: function() {
    // Watch for auth state changes
    onAuthStateChanged(auth, (user) => {
      this.updateNavbar(user);
      this.updateAccountView(user);
    });
  },

  updateNavbar: function(user) {
    const navLinks = document.getElementById('nav-links');
    if (!navLinks) return;

    const authButtons = navLinks.querySelector('.auth-buttons');
    const profileLink = navLinks.querySelector('a[href="profile.html"]');

    if (user) {
      // User is logged in
      if (authButtons) {
        authButtons.innerHTML = `
          <a href="profile.html" class="btn-login">
            ${user.displayName || 'Profile'}
          </a>
          <a href="index.html" id="logout-btn" class="btn-login">Logout</a>
        `;
        document.getElementById('logout-btn')?.addEventListener('click', (e) => {
          e.preventDefault();
          signOut(auth).then(() => {
            window.location.reload(); // Ensures clean state
          });
        });
      }
    } else {
      // User is logged out
      if (authButtons) {
        authButtons.innerHTML = `
          <a href="login.html" class="btn-login">Login</a>
          <a href="register.html" class="btn-login">Register</a>
        `;
      }
    }
  },

  updateAccountView: function(user) {
    const accountNameElement = document.getElementById('account-name');
    const accountTypeElement = document.getElementById('account-type');

    if (!accountNameElement || !accountTypeElement) return;

    if (user) {
      accountNameElement.textContent = `Welcome, ${user.displayName || 'User'}`;
      accountTypeElement.textContent = 'Premium Member';
      accountTypeElement.style.color = '#800000';

      // Show premium features
      document.querySelectorAll('.premium-feature').forEach(el => {
        el.style.display = 'block';
      });
    } else {
      accountNameElement.textContent = 'Welcome, Guest';
      accountTypeElement.textContent = 'Sign in for premium features';
      accountTypeElement.style.color = '#666';

      // Hide premium features
      document.querySelectorAll('.premium-feature').forEach(el => {
        el.style.display = 'none';
      });
    }
  }
};

// Authentication Handlers
function setupAuthHandlers() {
  // Google login
  document.querySelector('.google-btn')?.addEventListener('click', async () => {
    const provider = new GoogleAuthProvider();
    try {
      await signInWithPopup(auth, provider);
      window.location.href = 'index.html'; // Refresh to update all states
    } catch (error) {
      showError(error.message);
    }
  });

  // Apple login
  document.querySelector('.apple-btn')?.addEventListener('click', async () => {
    const provider = new OAuthProvider('apple.com');
    try {
      await signInWithPopup(auth, provider);
      window.location.href = 'index.html';
    } catch (error) {
      showError(error.message);
    }
  });
}

function showError(message) {
  const errorElement = document.getElementById('error-message');
  if (errorElement) {
    errorElement.textContent = message;
    errorElement.style.display = 'block';
    setTimeout(() => {
      errorElement.style.display = 'none';
    }, 5000);
  }
}

// Initialize everything when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
  NavbarAuth.init();
  setupAuthHandlers();
});

// Account view loader
async function loadAccountView() {
  const account = await detectAccount();
  const accountNameElement = document.getElementById('account-name');
  const accountTypeElement = document.getElementById('account-type');
  const imageContainer = document.getElementById('account-image-container');

  if (!accountNameElement || !accountTypeElement || !imageContainer) return;

  if (account.type === 'authenticated') {
    const userDoc = await getDoc(doc(db, "Accounts", account.uid));
    const userData = userDoc.data();

    // Show admin or premium
    if (userData && userData.isAdmin === true) {
      accountTypeElement.textContent = 'Administrator';
      accountTypeElement.style.color = '#800000';
    } else {
      accountTypeElement.textContent = 'Premium Member';
      accountTypeElement.style.color = '#800000';
    }

    accountNameElement.textContent = `Welcome, ${account.displayName}`;

    // Clear existing images
    imageContainer.innerHTML = '';



    
    // Add favorite player images (1-3 based on what exists)
// Inside loadAccountView (replace the favoritePlayers display logic)
if (userData.favoritePlayers?.length) {
  imageContainer.innerHTML = '';
  const playerIds = userData.favoritePlayers.slice(0, 3);

  for (const playerId of playerIds) {
    try {
      const playerDoc = await getDoc(doc(db, "Players", playerId));
      let photoUrl = 'https://via.placeholder.com/150x180?text=No+Photo';
      if (playerDoc.exists()) {
        const playerData = playerDoc.data();
        if (playerData.photoPath) {
          photoUrl = playerData.photoPath;
        }
      }
      const segment = document.createElement('div');
      segment.className = 'image-segment';
      segment.dataset.playerId = playerId;
      segment.style.backgroundImage = `url(${photoUrl})`;
      segment.style.backgroundSize = 'cover';
      segment.style.backgroundPosition = 'center';
      imageContainer.appendChild(segment);
    } catch (err) {
      // fallback
      const segment = document.createElement('div');
      segment.className = 'image-segment';
      segment.style.backgroundImage = `url('https://via.placeholder.com/150x180?text=No+Photo')`;
      segment.style.backgroundSize = 'cover';
      segment.style.backgroundPosition = 'center';
      imageContainer.appendChild(segment);
    }
  }
} else {
  const segment = document.createElement('div');
  segment.className = 'image-segment';
  segment.innerHTML = `<p class="no-favorites"><a href="profile.html" style="color: #800000; text-decoration: underline;">Select your favorite players in Profile</a></p>`;
  imageContainer.appendChild(segment);
}
  } else {
    accountNameElement.textContent = 'Welcome, Guest';
    accountTypeElement.textContent = 'Sign in for personalized content';
    imageContainer.innerHTML = `
      <div class="image-segment" style="background: #f5f5f5;">
        <p class="guest-message">Sign in to follow your favorite players</p>
      </div>
    `;
  }
}









// Player display loader using playerCard.js
async function loadAndDisplayPlayers() {
  try {
    // Use the new playersContainer id (all player cards are handled by playerCard.js)
    const container = document.getElementById('playersContainer');
    if (!container) throw new Error("Players container not found in DOM");

    container.innerHTML = '<div class="loading">Loading players...</div>';

    const players = await getFavoritePlayer();
    if (!players || players.length === 0) {
      container.innerHTML = '<p class="no-players">No players found in database</p>';
      return;
    }

    renderPlayersGrid(players, 'playersContainer');
  } catch (error) {
    console.error("Full error details:", error);
    const container = document.getElementById('playersContainer');
    if (container) {
      container.innerHTML = `
        <p style="color: red">Error loading players</p>
        <p>${error.message}</p>
      `;
    }
  }
}

// Initialize player card loading and refresh button
document.addEventListener('DOMContentLoaded', () => {
  // Refresh button
  const refreshBtn = document.getElementById('refresh-players');
  if (refreshBtn) {
    refreshBtn.addEventListener('click', loadAndDisplayPlayers);
  }

  // Load player cards on page load
  loadAndDisplayPlayers();
});

// Real account detection
function detectAccount() {
  return new Promise((resolve) => {
    onAuthStateChanged(auth, (user) => {
      if (user) {
        // User is signed in
        resolve({
          type: 'authenticated',
          uid: user.uid,
          email: user.email,
          displayName: user.displayName || 'User'
        });
      } else {
        // No user signed in
        resolve({
          type: 'guest',
          uid: null
        });
      }
    });
  });
}

// Also load account view on page load
document.addEventListener('DOMContentLoaded', loadAccountView);
// Add this to the END of main.js
document.addEventListener('DOMContentLoaded', () => {
  const container = document.getElementById('account-image-container');
  if (!container) return;

  container.addEventListener('click', async (e) => {
    const segment = e.target.closest('.image-segment');
    if (!segment) return;

    // Use currentUser (safe since DOMContentLoaded and after Firebase init)
    const user = auth.currentUser;
    if (!user) {
      window.location.href = 'register.html';
      return;
    }

    // Get user doc for favorites
    const userDoc = await getDoc(doc(db, "Accounts", user.uid));
    const userData = userDoc.exists() ? userDoc.data() : null;
    const favorites = userData?.favoritePlayers || [];

    if (!favorites.length) {
      window.location.href = 'profile.html';
      return;
    }

    // Get first favorite's playerPage
    const playerId = favorites[0];
    const playerDoc = await getDoc(doc(db, "Players", playerId));
    const playerData = playerDoc.exists() ? playerDoc.data() : null;

    if (playerData && playerData.playerPage) {
          window.location.href = `player.html?id=${doc.id}`
    } else {
      alert('Player page not found.');
    }
  });
});

