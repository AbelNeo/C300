import { collection, getDocs } from "firebase/firestore";
import { db } from "./firebase.js";  // Make sure this import is correct

export async function getFavoritePlayer() {
  try {
    // Correct way to reference a collection
    const playerCollection = collection(db, "Accounts");
    const querySnapshot = await getDocs(playerCollection);
    
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