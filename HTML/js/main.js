// main.js
import { getAllPlayers } from "./players.js";

async function loadAndDisplayPlayers() {
  console.log("Button clicked - function started"); // Debug log
  
  try {
    const debugOutput = document.getElementById('debug-output');
    debugOutput.innerHTML = "Loading players...";
    
    console.log("Fetching players..."); // Debug log
    const players = await getAllPlayers();
    console.log("Players fetched:", players); // Debug log
    
    const container = document.getElementById('players-container');
    if (!container) {
      throw new Error("Players container not found in DOM");
    }

    if (!players || players.length === 0) {
      container.innerHTML = '<p class="no-players">No players found in database</p>';
      debugOutput.innerHTML = 'No players found in database';
      return;
    }

    container.innerHTML = players.map(player => `
      <div class="player-card">
        <h3>${player.Name || 'Unnamed Player'}</h3>
        <p>Position: ${player.Role || 'No position specified'}</p>
        ${player.JerseyNumber ? `<p>Jersey: ${player.JerseyNumber}</p>` : ''}
      </div>
    `).join('');

    debugOutput.innerHTML = `Successfully loaded ${players.length} player(s)`;
    console.table(players); // View detailed data in console

  } catch (error) {
    console.error("Full error details:", error); // Detailed error
    const debugOutput = document.getElementById('debug-output');
    debugOutput.innerHTML = `
      <p style="color: red">Error loading players</p>
      <p>${error.message}</p>
    `;
  }
}

// Initialize
document.addEventListener('DOMContentLoaded', () => {
  console.log("DOM fully loaded"); // Debug log
  
  const refreshBtn = document.getElementById('refresh-players');
  if (refreshBtn) {
    refreshBtn.addEventListener('click', loadAndDisplayPlayers);
    console.log("Event listener attached to button"); // Debug log
  } else {
    console.error("Refresh button not found in DOM!");
  }

  // Load immediately on page load
  loadAndDisplayPlayers();
});