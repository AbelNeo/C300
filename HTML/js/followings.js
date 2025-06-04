import { db } from './firebase.js';
import { collection, query, where, getDocs, orderBy, limit } from 'https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js';

// DOM elements
const searchInput = document.getElementById('playerSearchInput');
const searchButton = document.getElementById('searchButton');
const searchResults = document.getElementById('searchResults');

// Search players function
async function searchPlayers(searchTerm) {
  try {
    // Clear previous results
    searchResults.innerHTML = '<div class="loading">Searching players...</div>';
    
    // Basic validation
    if (!searchTerm || searchTerm.trim() === '') {
      searchResults.innerHTML = '<div class="empty">Please enter a search term</div>';
      return;
    }
    
    // Create Firestore query
    const playersRef = collection(db, 'Players');
    const q = query(
      playersRef,
      orderBy('name'), // Ensure you have this field indexed in Firestore
      where('name', '>=', searchTerm),
      where('name', '<=', searchTerm + '\uf8ff'),
      limit(20)
    );
    
    // Execute query
    const querySnapshot = await getDocs(q);
    
    // Process results
    if (querySnapshot.empty) {
      searchResults.innerHTML = '<div class="empty">No players found</div>';
      return;
    }
    
    // Display results
    searchResults.innerHTML = '';
    querySnapshot.forEach((doc) => {
      const player = doc.data();
      const playerCard = createPlayerCard(doc.id, player);
      searchResults.appendChild(playerCard);
    });
    
  } catch (error) {
    console.error('Error searching players:', error);
    searchResults.innerHTML = `<div class="error">Search failed: ${error.message}</div>`;
  }
}

// Create player card element
function createPlayerCard(playerId, playerData) {
  const card = document.createElement('div');
  card.className = 'player-result-card';
  
  card.innerHTML = `
    <h3>${playerData.name}</h3>
    <p>${playerData.position || 'Position not specified'}</p>
    <p>${playerData.team || 'Team not specified'}</p>
    <button class="add-favorite-btn" data-player-id="${playerId}">
      Add to Favorites
    </button>
  `;
  
  // Add event listener to the button
  const favoriteBtn = card.querySelector('.add-favorite-btn');
  favoriteBtn.addEventListener('click', () => {
    addPlayerToFavorites(playerId);
  });
  
  return card;
}

// Add player to favorites (connect this to your existing function)
async function addPlayerToFavorites(playerId) {
  // Use your existing addFavoritePlayer function here
  console.log('Adding player to favorites:', playerId);
  // await addFavoritePlayer(playerId);
}

// Event listeners
searchButton.addEventListener('click', () => {
  searchPlayers(searchInput.value.trim());
});

searchInput.addEventListener('keypress', (e) => {
  if (e.key === 'Enter') {
    searchPlayers(searchInput.value.trim());
  }
});
// Requires Algolia or similar service integration
import { searchPlayersInAlgolia } from './searchService.js';

async function advancedSearch(term) {
  const results = await searchPlayersInAlgolia(term);
  // Process and display results
}
const q = query(
  playersRef,
  where('searchKeywords', 'array-contains', searchTerm.toLowerCase())
);
const firstPage = query(playersRef, orderBy('name'), limit(10));
const nextPage = query(playersRef, orderBy('name'), startAfter(lastDoc), limit(10));
let searchTimer;
searchInput.addEventListener('input', () => {
  clearTimeout(searchTimer);
  searchTimer = setTimeout(() => {
    searchPlayers(searchInput.value.trim());
  }, 300);
});