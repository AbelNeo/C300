import { db } from "./firebase.js";
import { collection, getDocs } from "firebase/firestore";

// Rename to match what main.js expects OR update main.js import
export async function getAllPlayers() {  // Changed from getPlayers to getAllPlayers
  try {
    const playersSnapshot = await getDocs(collection(db, "Players")); // Verify collection name
    const players = [];
    
    playersSnapshot.forEach((doc) => {
      players.push({ id: doc.id, ...doc.data() });
    });

    console.log("Players fetched:", players); // Debug log
    return players;
  } catch (error) {
    console.error("Error fetching players:", error);
    throw error; // Propagate the error to main.js
  }
}