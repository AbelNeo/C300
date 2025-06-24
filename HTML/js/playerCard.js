import React from 'react';
import './PlayerCard.css'; // For styling

export function getPhotoPath(player) {
  const teamPath = player.team ? `teams/${player.team}/` : '';
  return `/images/players/${teamPath}${player.photoPath || 'default.jpg'}`;
}

export default function PlayerCard({ player }) {
  return (
    <div className="player-card">
      <img 
        src={getPhotoPath(player)}
        alt={`${player.name} portrait`}
        onError={(e) => {
          e.target.src = '/images/default.jpg';
          e.target.style.opacity = '0.7';
        }}
      />
      <div className="player-info">
        <h3>{player.name}</h3>
        {player.position && <p>{player.position}</p>}
      </div>
    </div>
  );
}
/**
 * Enhanced Player Card Component
 * Now with photos and clickable cards
 */

// Configuration
const BASE_PHOTO_PATH = '/images/players/';
const DEFAULT_PHOTO = '/images/default.jpg';

// Get optimized photo path
function getPlayerPhotoPath(player) {
    if (!player) return DEFAULT_PHOTO;
    
    // Support multiple field names and team organization
    const teamFolder = player.team ? `teams/${player.team}/` : '';
    const filename = player.photoPath || player.photoFilename || player.id + '.jpg' || 'default.jpg';
    
    return `${BASE_PHOTO_PATH}${teamFolder}${filename}`;
}

// Create clickable player card
export function createPlayerCard(player, onClickHandler) {
    const card = document.createElement('div');
    card.className = 'player-card';
    card.style.cursor = 'pointer'; // Show it's clickable
    
    // Add hover effects via JS instead of CSS for better control
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
             onerror="this.onerror=null;this.src='${DEFAULT_PHOTO}'">
        <div class="player-info">
            <h3 class="player-name">${player.name || 'Unknown Player'}</h3>
            ${player.position ? `<p class="player-position">${player.position}</p>` : ''}
        </div>
    `;
    
    return card;
}

// Render player grid with click support
export function renderPlayersGrid(players, containerId = 'playersContainer', onClickHandler) {
    const container = document.getElementById(containerId);
    if (!container) return;
    
    container.innerHTML = '';
    
    if (!players?.length) {
        container.innerHTML = '<div class="empty-message">No players found</div>';
        return;
    }
    
    // Create document fragment for better performance
    const fragment = document.createDocumentFragment();
    players.forEach(player => {
        fragment.appendChild(createPlayerCard(player, onClickHandler));
    });
    container.appendChild(fragment);
}