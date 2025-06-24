import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { storage } from './firebase-config';

async function uploadPlayerPhoto(playerId, file) {
  try {
    // 1. Define storage path
    const storageRef = ref(storage, `player_photos/${playerId}/${file.name}`);
    
    // 2. Upload file
    await uploadBytes(storageRef, file);
    
    // 3. Get public URL
    const photoURL = await getDownloadURL(storageRef);
    
    return {
      success: true,
      photoURL: photoURL,
      photoPath: file.name
    };
    
  } catch (error) {
    console.error("Upload failed:", error);
    return { success: false };
  }
}