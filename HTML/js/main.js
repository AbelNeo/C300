// Single import statement for all Firebase auth-related functions
import { 
  auth, 
  onAuthStateChanged,
  GoogleAuthProvider, 
  signInWithPopup, 
  OAuthProvider 
} from './firebase.js';

// Other imports
import { getAllPlayers } from "./players.js";

async function loadAccountView() {
  const account = await detectAccount();
  const accountNameElement = document.getElementById('account-name');
  const accountTypeElement = document.getElementById('account-type');
  const imageContainer = document.getElementById('account-image-container');

  if (account.type === 'authenticated') {
    // Fetch user document from Firestore
    const userDoc = await getDoc(doc(db, "users", account.uid));
    const userData = userDoc.data();
    
    accountNameElement.textContent = `Welcome, ${account.displayName}`;
    accountTypeElement.textContent = 'Your premium content';
    
    // Clear existing images
    imageContainer.innerHTML = '';
    
    // Add favorite player images (1-3 based on what exists)
    if (userData.favoritePlayers?.length) {
      userData.favoritePlayers.slice(0, 3).forEach(imgUrl => {
        const segment = document.createElement('div');
        segment.className = 'image-segment';
        segment.style.backgroundImage = `url(${imgUrl})`;
        segment.style.backgroundSize = 'cover';
        segment.style.backgroundPosition = 'center';
        imageContainer.appendChild(segment);
      });
    } else {
      // Default image if no favorites
      const segment = document.createElement('div');
      segment.className = 'image-segment';
      segment.innerHTML = `<p class="no-favorites">Select your favorite players in settings</p>`;
      imageContainer.appendChild(segment);
    }
    
  } else {
    accountNameElement.textContent = 'Welcome, Guest';
    accountTypeElement.textContent = 'Sign in for personalized content';
    imageContainer.innerHTML = `
      <div class="image-segment" style="background: #f5f5f5;">
        <p class="guest-message">Sign in to see your favorite players</p>
      </div>
    `;
  }
}

// async function loadAndDisplayPlayers() {
//   console.log("Button clicked - function started"); // Debug log
  
//   try {
//     const debugOutput = document.getElementById('debug-output');
//     debugOutput.innerHTML = "Loading players...";
    
//     console.log("Fetching players..."); // Debug log
//     const players = await getAllPlayers();
//     console.log("Players fetched:", players); // Debug log
    
//     const container = document.getElementById('players-container');
//     if (!container) {
//       throw new Error("Players container not found in DOM");
//     }

//     if (!players || players.length === 0) {
//       container.innerHTML = '<p class="no-players">No players found in database</p>';
//       debugOutput.innerHTML = 'No players found in database';
//       return;
//     }

//     container.innerHTML = players.map(player => `
//       <div class="player-card">
//         <h3>${player.Name || 'Unnamed Player'}</h3>
//         <p>Position: ${player.Role || 'No position specified'}</p>
//         ${player.JerseyNumber ? `<p>Jersey: ${player.JerseyNumber}</p>` : ''}
//       </div>
//     `).join('');

//     debugOutput.innerHTML = `Successfully loaded ${players.length} player(s)`;
//     console.table(players); // View detailed data in console

//   } catch (error) {
//     console.error("Full error details:", error); // Detailed error
//     const debugOutput = document.getElementById('debug-output');
//     debugOutput.innerHTML = `
//       <p style="color: red">Error loading players</p>
//       <p>${error.message}</p>
//     `;
//   }
// }

// // Initialize
// document.addEventListener('DOMContentLoaded', () => {
//   console.log("DOM fully loaded"); // Debug log
  
//   const refreshBtn = document.getElementById('refresh-players');
//   if (refreshBtn) {
//     refreshBtn.addEventListener('click', loadAndDisplayPlayers);
//     console.log("Event listener attached to button"); // Debug log
//   } else {
//     console.error("Refresh button not found in DOM!");
//   }

//   // Load immediately on page load
//   loadAndDisplayPlayers();
// });



// Google Sign-In
document.querySelector('.google-btn')?.addEventListener('click', async () => {
    const provider = new GoogleAuthProvider();
    try {
        const result = await signInWithPopup(auth, provider);
        const user = result.user;
        console.log('Google sign-in success:', user);
        window.location.href = 'dashboard.html';
    } catch (error) {
        console.error('Google sign-in error:', error);
        showError(error.message);
    }
});

// Apple Sign-In
document.querySelector('.apple-btn')?.addEventListener('click', async () => {
    const provider = new OAuthProvider('apple.com');
    try {
        const result = await signInWithPopup(auth, provider);
        const user = result.user;
        console.log('Apple sign-in success:', user);
        window.location.href = 'dashboard.html';
    } catch (error) {
        console.error('Apple sign-in error:', error);
        showError(error.message);
    }
});

function showError(message) {
    const errorElement = document.getElementById('error-message');
    if (errorElement) {
        errorElement.textContent = message;
        errorElement.style.display = 'block';
    }
}

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

// Updated account view loader
async function loadAccountView() {
  const account = await detectAccount();
  
  const accountNameElement = document.getElementById('account-name');
  const accountTypeElement = document.getElementById('account-type');
  
  if (account.type === 'authenticated') {
    accountNameElement.textContent = `Welcome, ${account.displayName}`;
    accountTypeElement.textContent = 'Premium Member';
    accountTypeElement.style.color = '#800000';
    
    // Load premium features
    document.querySelectorAll('.premium-feature').forEach(el => {
      el.style.display = 'block';
    });
  } else {
    accountNameElement.textContent = 'Welcome, Guest';
    accountTypeElement.textContent = 'Sign in for premium features';
    accountTypeElement.style.color = '#666';
  }
}

// Initialize when page loads
document.addEventListener('DOMContentLoaded', loadAccountView);