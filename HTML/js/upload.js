async function uploadImage(file, userId) {
  try {
    const storageRef = ref(storage, `users/${userId}/images/${file.name}`);
    const snapshot = await uploadBytes(storageRef, file);
    const downloadURL = await getDownloadURL(snapshot.ref);
    return downloadURL;
  } catch (error) {
    console.error("Error uploading image:", error);
    throw error;
  }
}
async function saveImageReference(userId, imageUrl) {
  try {
    await setDoc(doc(db, "users", userId), {
      profileImage: imageUrl,
      lastUpdated: serverTimestamp()
    });
  } catch (error) {
    console.error("Error saving image reference:", error);
    throw error;
  }
}
document.getElementById('imageUpload').addEventListener('change', async (e) => {
  const file = e.target.files[0];
  if (!file) return;

  try {
    const user = auth.currentUser;
    if (!user) {
      alert("You must be signed in.");
      return;
    }

    const imageUrl = await uploadImage(file, user.uid);
    await saveImageReference(user.uid, imageUrl);
    alert("Image uploaded successfully!");
  } catch (error) {
    alert("Upload failed: " + error.message);
  }
});
await setDoc(doc(db, "users", userId, "media", mediaId), {
  url: downloadURL,
  fileType: file.type,
  selectedDate: selectedDate || null,
  uploadedAt: serverTimestamp()
});
