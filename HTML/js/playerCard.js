// Standalone player card rendering module

// Get optimized photo path
function getPlayerPhotoPath(player) {
  if (!player) return 'https://via.placeholder.com/150x180?text=No+Photo';
  // Try various fields, fallback to placeholder
  const photo = player.photoURL || player.photoPath || player.imgUrl || 'https://via.placeholder.com/150x180?text=No+Photo';
  return photo;
}

// Create clickable player card (vanilla JS)
export function createPlayerCard(player, onClickHandler) {
  const card = document.createElement('div');
  card.className = 'player-card';
  card.style.cursor = 'pointer';

  // Add hover effects
  card.addEventListener('mouseenter', () => {
    card.style.transform = 'translateY(-5px)';
    card.style.boxShadow = '0 5px 15px rgba(0,0,0,0.2)';
  });
  card.addEventListener('mouseleave', () => {
    card.style.transform = '';
    card.style.boxShadow = '0 2px 8px rgba(0,0,0,0.1)';
  });

  // Add click handler if provided
  if (onClickHandler) {
    card.addEventListener('click', () => onClickHandler(player));
  }

  const photoUrl = getPlayerPhotoPath(player);

  card.innerHTML = `
    <img src="${photoUrl}" 
         alt="${player.name || 'Player'}"
         class="player-portrait"
         onerror="this.onerror=null;this.src='https://via.placeholder.com/150x180?text=No+Photo'">
    <div class="player-info">
      <h3 class="player-name">${player.name || player.Name || 'Unknown Player'}</h3>
      <p class="player-position">${player.position || player.Role || ''}</p>
      ${player.JerseyNumber ? `<p>Jersey: ${player.JerseyNumber}</p>` : ''}
      ${player.team ? `<p class="player-team">${player.team}</p>` : ''}
    </div>
  `;

  return card;
}

// Render player grid with click support
export function renderPlayersGrid(players, containerId = 'playersContainer', onClickHandler = null) {
  const container = document.getElementById(containerId);
  if (!container) return;
  container.innerHTML = '';

  if (!players?.length) {
    container.innerHTML = '<div class="empty-message">No players found</div>';
    return;
  }

  const fragment = document.createDocumentFragment();
  players.forEach(player => {
    fragment.appendChild(createPlayerCard(player, onClickHandler));
  });
  container.appendChild(fragment);
}