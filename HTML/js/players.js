import { collection, getDocs } from "firebase/firestore";
import { db } from "./firebase.js";  // Make sure this import is correct

export async function getAllPlayers() {
  try {
    // Correct way to reference a collection
    const playersCollection = collection(db, "players");
    const querySnapshot = await getDocs(playersCollection);
    
    // Properly extract and return player data
    return querySnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    }));
    
  } catch (error) {
    console.error("Error fetching players:", error);
    throw error; // Re-throw to handle in calling function
  }
}
// import { db } from "./firebase.js";
// import { collection, getDocs } from "firebase/firestore";

// // Rename to match what main.js expects OR update main.js import
// export async function getAllPlayers() {  // Changed from getPlayers to getAllPlayers
//   try {
//     const playersSnapshot = await getDocs(collection(db, "Players")); // Verify collection name
//     const players = [];
    
//     playersSnapshot.forEach((doc) => {
//       players.push({ id: doc.id, ...doc.data() });
//     });

//     console.log("Players fetched:", players); // Debug log
//     return players;
//   } catch (error) {
//     console.error("Error fetching players:", error);
//     throw error; // Propagate the error to main.js
//   }
// }