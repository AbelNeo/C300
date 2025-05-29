import { initializeApp } from "firebase/app";
import { 
    auth, 
    createUserWithEmailAndPassword,
    GoogleAuthProvider, 
    signInWithPopup,
    OAuthProvider
} from './firebase.js';

document.addEventListener('DOMContentLoaded', () => {
    // Email/password signup
    const signupForm = document.querySelector('.signup-form');
    if (signupForm) {
        signupForm.addEventListener('submit', async (e) => {
            e.preventDefault();
            
            const email = signupForm.querySelector('input[type="email"]').value;
            const password = signupForm.querySelector('input[type="password"]').value;
            
            // Basic validation
            if (password.length < 6) {
                showError('Password should be at least 6 characters');
                return;
            }
            
            try {
                const userCredential = await createUserWithEmailAndPassword(auth, email, password);
                const user = userCredential.user;
                console.log('User created:', user);
                
                // Redirect after successful signup
                window.location.href = 'index.html';
            } catch (error) {
                console.error('Error signing up:', error);
                showError(error.message);
            }
        });
    }
    
    // Google Sign-In
    document.querySelector('.google-btn')?.addEventListener('click', async () => {
        const provider = new GoogleAuthProvider();
        try {
            const result = await signInWithPopup(auth, provider);
            const user = result.user;
            console.log('Google sign-in success:', user);
            window.location.href = 'dashboard.html';
        } catch (error) {
            console.error('Google sign-in error:', error);
            showError(error.message);
        }
    });
    
    // Apple Sign-In
    document.querySelector('.apple-btn')?.addEventListener('click', async () => {
        const provider = new OAuthProvider('apple.com');
        try {
            const result = await signInWithPopup(auth, provider);
            const user = result.user;
            console.log('Apple sign-in success:', user);
            window.location.href = 'dashboard.html';
        } catch (error) {
            console.error('Apple sign-in error:', error);
            showError(error.message);
        }
    });
});

function showError(message) {
    const errorElement = document.getElementById('error-message');
    if (errorElement) {
        errorElement.textContent = message;
        errorElement.style.display = 'block';
        
        // Hide error after 5 seconds
        setTimeout(() => {
            errorElement.style.display = 'none';
        }, 5000);
    }
}


// // main.js or a new signup.js file
// import { auth, createUserWithEmailAndPassword } from './firebase.js';

// document.addEventListener('DOMContentLoaded', () => {
//     const signupForm = document.querySelector('.signup-form');
    
//     if (signupForm) {
//         signupForm.addEventListener('submit', async (e) => {
//             e.preventDefault();
            
//             const email = signupForm.querySelector('input[type="email"]').value;
//             const password = signupForm.querySelector('input[type="password"]').value;
            
//             try {
//                 const userCredential = await createUserWithEmailAndPassword(auth, email, password);
//                 const user = userCredential.user;
//                 console.log('User created:', user);
                
//                 // Redirect to dashboard or home page after successful signup
//                 window.location.href = 'dashboard.html';
//             } catch (error) {
//                 console.error('Error signing up:', error);
//                 alert(error.message); // Show error message to user
//             }
//         });
//     }
// });

// // Add to your form submit handler
// if (password.length < 6) {
//     showError('Password should be at least 6 characters');
//     return;
// }
















// const auth = getAuth();
// const db = getFirestore();

// createUserWithEmailAndPassword(auth, email, password)
//   .then(async (userCredential) => {
//     const user = userCredential.user;

//     // Add extra data to Firestore
//     await setDoc(doc(db, "users", user.uid), {
//       username: "desiredUsername",
//       email: user.email,
//       membershipType: "silver"
//     });

//     console.log("User profile created!");
//   })
//   .catch((error) => {
//     console.error(error);
//   });

// async function checkUsername() {
//   return new Promise((resolve, reject) => {
//     onAuthStateChanged(auth, async (user) => {
//       if (user) {
//         try {
//           const docRef = doc(db, "users", user.uid);
//           const docSnap = await getDoc(docRef);

//           if (docSnap.exists()) {
//             const data = docSnap.data();
//             if (data.username) {
//               console.log("✅ Username found:", data.username);
//               resolve(data.username);
//             } else {
//               console.warn("⚠️ Username field missing in user profile.");
//               resolve(null);
//             }
//           } else {
//             console.warn("⚠️ User profile document does not exist.");
//             resolve(null);
//           }
//         } catch (error) {
//           console.error("❌ Error fetching username:", error);
//           reject(error);
//         }
//       } else {
//         console.warn("⚠️ No user is logged in.");
//         resolve(null);
//       }
//     });
//   });
// }