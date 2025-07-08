import { collection, getDocs, doc, runTransaction, updateDoc, getDoc } from "./firebase.js";
import { db } from "./firebase.js";

export async function getFavoritePlayer() {
  try {
    const playerCollection = collection(db, "Players");
    const querySnapshot = await getDocs(playerCollection);
    return querySnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    }));
  } catch (error) {
    console.error("Error fetching players:", error);
    throw error;
  }
}