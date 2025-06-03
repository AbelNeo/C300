import { collection, getDocs } from "firebase/firestore";
import { db, runTransaction } from "./firebase.js";  // Make sure this import is correct

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


// Add a favorite player
async function addFavoritePlayer(userId, playerId) {
  const userRef = doc(db, 'Accounts', userId);
  
  await runTransaction(db, async (transaction) => {
    const userDoc = await transaction.get(userRef);
    const currentFavorites = userDoc.data().favoritePlayers || [];
    
    if (currentFavorites.includes(playerId)) {
      throw new Error("Player already in favorites");
    }
    
    if (currentFavorites.length >= 3) {
      throw new Error("Maximum 3 favorite players allowed");
    }
    
    transaction.update(userRef, {
      favoritePlayers: [...currentFavorites, playerId]
    });
  });
}

// Remove a favorite player
async function removeFavoritePlayer(userId, playerId) {
  const userRef = doc(db, 'Accounts', userId);
  
  await updateDoc(userRef, {
    favoritePlayers: arrayRemove(playerId)
  });
}

// Get favorite players
async function getFavoritePlayers(userId) {
  const userDoc = await getDoc(doc(db, 'Accounts', userId));
  return userDoc.data().favoritePlayers || [];
}


// Add to your imports
import {  } from './firebase.js';

// Example usage when user clicks "Add to Favorites"
async function handleAddFavorite(playerId) {
  try {
    const user = auth.currentUser;
    if (!user) throw new Error("Not authenticated");
    
    await addFavoritePlayer(user.uid, playerId);
    console.log("Player added to favorites");
  } catch (error) {
    console.error("Error adding favorite:", error);
  }
}

// Example usage when user clicks "Remove from Favorites"
async function handleRemoveFavorite(playerId) {
  try {
    const user = auth.currentUser;
    if (!user) throw new Error("Not authenticated");
    
    await removeFavoritePlayer(user.uid, playerId);
    console.log("Player removed from favorites");
  } catch (error) {
    console.error("Error removing favorite:", error);
  }
}