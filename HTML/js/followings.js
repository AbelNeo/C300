import { db, auth } from './firebase.js';
import { 
  collection, query, where, getDocs, orderBy, limit, 
  doc, setDoc, getDoc, onSnapshot, deleteDoc 
} from 'https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js';

// DOM elements
const searchInput = document.getElementById('playerSearch');
const searchButton = document.getElementById('searchBtn');
const searchResults = document.getElementById('searchResults');
const favoritePlayers = document.getElementById('favoritePlayers');
const favoriteCount = document.getElementById('favoriteCount');

// State management
let currentUser = null;
let unsubscribeFavorites = null;

// Initialize auth state listener
auth.onAuthStateChanged(user => {
  currentUser = user;
  
  // Clean up previous listener if exists
  if (unsubscribeFavorites) {
    unsubscribeFavorites();
  }
  
  if (user) {
    loadFavorites();
  } else {
    favoritePlayers.innerHTML = '<div class="empty">Please sign in to view favorites</div>';
    favoriteCount.textContent = '(0)';
  }
});

// ======================
// FAVORITES MANAGEMENT
// ======================
export function loadFavorites() {
  if (!currentUser) return;

  const favoritesRef = collection(db, `Users/${currentUser.uid}/Favorites`);
  
  unsubscribeFavorites = onSnapshot(favoritesRef, 
    async (snapshot) => {
      favoriteCount.textContent = `(${snapshot.size})`;
      
      if (snapshot.empty) {
        favoritePlayers.innerHTML = '<div class="empty">No favorite players yet</div>';
        return;
      }
      
      favoritePlayers.innerHTML = '';
      const promises = [];
      
      snapshot.forEach((doc) => {
        promises.push
          getPlayerData(doc.id).then(playerData => {
            if (playerData) {
              const card = createFavoriteCard(doc.id, playerData);
              favoritePlayers.appendChild(card);
            }
          })
      });
      
      await Promise.all(promises);
    },
    (error) => {
      console.error("Favorites error:", error);
      favoritePlayers.innerHTML = `<div class="error">Error loading favorites: ${error.message}</div>`;
    }
  );
}

async function getPlayerData(playerId) {
  try {
    const docRef = doc(db, 'Players', playerId);
    const docSnap = await getDoc(docRef);
    return docSnap.exists() ? docSnap.data() : null;
  } catch (error) {
    console.error("Error getting player:", error);
    return null;
  }
}

async function toggleFavorite(playerId, playerData) {
  if (!currentUser) {
    alert('Please sign in to manage favorites');
    return false;
  }

  const favRef = doc(db, `Users/${currentUser.uid}/Favorites`, playerId);
  
  try {
    const docSnap = await getDoc(favRef);
    if (docSnap.exists()) {
      await deleteDoc(favRef);
      return false;
    } else {
      await setDoc(favRef, {
        ...playerData,
        addedAt: new Date().toISOString()
      });
      return true;
    }
  } catch (error) {
    console.error("Favorite toggle failed:", error);
    throw error;
  }
}

// ======================
// PLAYER SEARCH
// ======================
export async function searchPlayers(searchTerm) {
  try {
    searchResults.innerHTML = '<div class="loading">Searching players...</div>';
    
    if (!searchTerm.trim()) {
      searchResults.innerHTML = '<div class="empty">Please enter a search term</div>';
      return;
    }
    
    const playersRef = collection(db, 'Players');
    const q = query(
      playersRef,
      orderBy('name'),
      where('name', '>=', searchTerm),
      where('name', '<=', searchTerm + '\uf8ff'),
      limit(20)
    );
    
    const querySnapshot = await getDocs(q);
    
    if (querySnapshot.empty) {
      searchResults.innerHTML = '<div class="empty">No players found</div>';
      return;
    }
    
    searchResults.innerHTML = '';
    const promises = querySnapshot.docs.map(async (doc) => {
      const player = doc.data();
      const isFavorite = currentUser ? await checkIfFavorite(doc.id) : false;
      const card = createPlayerCard(doc.id, player, isFavorite);
      searchResults.appendChild(card);
    });
    
    await Promise.all(promises);
  } catch (error) {
    console.error('Search error:', error);
    let errorMsg = 'Search failed';
    if (error.code === 'permission-denied') {
      errorMsg = 'Authentication required';
    }
    searchResults.innerHTML = `<div class="error">${errorMsg}: ${error.message}</div>`;
  }
}

async function checkIfFavorite(playerId) {
  if (!currentUser) return false;
  
  try {
    const docRef = doc(db, `Users/${currentUser.uid}/Favorites`, playerId);
    const docSnap = await getDoc(docRef);
    return docSnap.exists();
  } catch (error) {
    console.error("Favorite check failed:", error);
    return false;
  }
}

// ======================
// UI COMPONENTS
// ======================
function createPlayerCard(playerId, playerData, isFavorite = false) {
  const card = document.createElement('div');
  card.className = 'player-result-card';
  
  card.innerHTML = `
    <h3>${playerData.name}</h3>
    <p>Position: ${playerData.position || 'N/A'}</p>
    <p>Team: ${playerData.team || 'N/A'}</p>
    <button class="favorite-btn ${isFavorite ? 'active' : ''}" 
            data-player-id="${playerId}">
      ${isFavorite ? '★ Remove Favorite' : '☆ Add Favorite'}
    </button>
  `;
  
  const btn = card.querySelector('.favorite-btn');
  btn.addEventListener('click', async () => {
    btn.disabled = true;
    try {
      const newState = await toggleFavorite(playerId, playerData);
      btn.classList.toggle('active', newState);
      btn.innerHTML = newState ? '★ Remove Favorite' : '☆ Add Favorite';
    } catch (error) {
      console.error("Favorite action failed:", error);
    } finally {
      btn.disabled = false;
    }
  });
  
  return card;
}

function createFavoriteCard(playerId, playerData) {
  const card = document.createElement('div');
  card.className = 'favorite-player-card';
  
  card.innerHTML = `
    <h3>${playerData.name}</h3>
    <p>Position: ${playerData.position || 'N/A'}</p>
    <p>Team: ${playerData.team || 'N/A'}</p>
    <button class="remove-favorite-btn" data-player-id="${playerId}">
      Remove Favorite
    </button>
  `;
  
  const btn = card.querySelector('.remove-favorite-btn');
  btn.addEventListener('click', async () => {
    btn.disabled = true;
    try {
      await toggleFavorite(playerId, playerData);
    } catch (error) {
      console.error("Remove favorite failed:", error);
    } finally {
      btn.disabled = false;
    }
  });
  
  return card;
}

// ======================
// EVENT HANDLERS
// ======================
searchButton.addEventListener('click', () => {
  searchPlayers(searchInput.value.trim());
});

searchInput.addEventListener('keypress', (e) => {
  if (e.key === 'Enter') {
    searchPlayers(searchInput.value.trim());
  }
});

// Debounced search
let searchTimer;
searchInput.addEventListener('input', () => {
  clearTimeout(searchTimer);
  const term = searchInput.value.trim();
  if (term.length >= 2) {
    searchTimer = setTimeout(() => searchPlayers(term), 300);
  }
});










