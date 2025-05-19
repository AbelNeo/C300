import { db } from "./firebase.js";
import { collection, getDocs } from "firebase/firestore";

async function getPlayers() {
  const playersSnapshot = await getDocs(collection(db, "Players"));
  const players = [];
  
  playersSnapshot.forEach((doc) => {
    players.push({ id: doc.id, ...doc.data() });
  });

  console.log("Players:", players);
  return players;
}

getPlayers();