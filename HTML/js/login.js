import { 
  db, 
  setDoc, 
  doc, 
  serverTimestamp,
  auth, 
  signInWithEmailAndPassword,
  GoogleAuthProvider, 
  signInWithPopup,
  OAuthProvider
} from './firebase.js';

// DOM Elements
const loginForm = document.getElementById('loginForm');
const googleBtn = document.getElementById('googleLogin');
const appleBtn = document.getElementById('appleLogin');
const loginBtn = document.getElementById('loginButton');
const errorElement = document.getElementById('error-message');

// Email/Password Login
if (loginForm) {
  loginForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    const email = loginForm.email.value;
    const password = loginForm.password.value;

    // Show loading state
    loginBtn.disabled = true;
    loginBtn.textContent = 'Signing in...';
    errorElement.textContent = '';
    errorElement.style.display = 'none';
    
    
    try {
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;

      // Update last login timestamp in Firestore
      await setDoc(doc(db, "Accounts", user.uid), {
        lastLogin: serverTimestamp()
      }, { merge: true });

      showSuccess('Login successful! Redirecting...');
      setTimeout(() => {
        window.location.href = 'index.html';
      }, 3000);
      
    } catch (error) {
      showError(error.message);
      loginBtn.disabled = false;
      loginBtn.textContent = 'Sign In';
    }
  });
}

// Google login
if (googleBtn) {
  googleBtn.addEventListener('click', async () => {
    try {
      const provider = new GoogleAuthProvider();
      const result = await signInWithPopup(auth, provider);
      const user = result.user;

      // Update last login timestamp in Firestore
      await setDoc(doc(db, "Accounts", user.uid), {
        lastLogin: serverTimestamp(),
        emailVerified: user.emailVerified || false
      }, { merge: true });

      showSuccess('Welcome back to FootMaster Pro!');
      setTimeout(() => {
        window.location.href = 'index.html';
      }, 1000);

    } catch (error) {
      showError(error.message);
    }
  });
}

// Apple login
if (appleBtn) {
  appleBtn.addEventListener('click', async () => {
    try {
      const provider = new OAuthProvider('apple.com');
      const result = await signInWithPopup(auth, provider);
      const user = result.user;

      // Create Firestore user document if new user
      await setDoc(doc(db, "Accounts", user.uid), {
        email: user.email,
        createdAt: serverTimestamp(),
        favoritePlayers: [],
        tier: "Bronze",
        lastLogin: serverTimestamp(),
        emailVerified: user.emailVerified || false
      }, { merge: true });

      showSuccess('Welcome to FootMaster Pro!');
      setTimeout(() => {
        window.location.href = 'index.html';
      }, 1000);

    } catch (error) {
      showError(error.message);
    }
  });
}

// Helper functions
function showError(message) {
  errorElement.textContent = message;
  errorElement.style.display = 'block';
  errorElement.style.color = '#ff4444';
  errorElement.style.backgroundColor = '#ffebee';
}

function showSuccess(message) {
  errorElement.textContent = message;
  errorElement.style.display = 'block';
  errorElement.style.color = '#00C851';
  errorElement.style.backgroundColor = '#e8f5e9';
}


// import { 
//   db, 
//   setDoc, 
//   doc, 
//   serverTimestamp,
//   auth, 
//   createUserWithEmailAndPassword,
//   GoogleAuthProvider, 
//   signInWithPopup,
//   OAuthProvider,
//   sendEmailVerification,
//   signInWithEmailAndPassword // Add this import
// } from './firebase.js';

// // DOM Elements for Login
// const loginForm = document.getElementById('loginForm');
// const googleLoginBtn = document.getElementById('googleLogin');
// const appleLoginBtn = document.getElementById('appleLogin');
// const loginBtn = document.getElementById('loginButton');
// const loginErrorElement = document.getElementById('login-error-message');

// // Email/Password Login
// if (loginForm) {
//   loginForm.addEventListener('submit', async (e) => {
//     e.preventDefault();
//     const email = loginForm.email.value;
//     const password = loginForm.password.value;
    
//     // Show loading state
//     loginBtn.disabled = true;
//     loginBtn.textContent = 'Signing in...';
//     loginErrorElement.textContent = '';
//     loginErrorElement.style.display = 'none';
    
//     try {
//       const userCredential = await signInWithEmailAndPassword(auth, email, password);
//       const user = userCredential.user;

//       // Update last login timestamp in Firestore
//       await setDoc(doc(db, "Accounts", user.uid), {
//         lastLogin: serverTimestamp()
//       }, { merge: true });

//       showLoginSuccess('Login successful! Redirecting...');
//       setTimeout(() => {
//         window.location.href = 'index.html';
//       }, 1000);
      
//     } catch (error) {
//       let errorMessage = error.message;
      
//       // More user-friendly error messages
//       if (error.code === 'auth/user-not-found') {
//         errorMessage = 'No account found with this email.';
//       } else if (error.code === 'auth/wrong-password') {
//         errorMessage = 'Incorrect password. Please try again.';
//       } else if (error.code === 'auth/too-many-requests') {
//         errorMessage = 'Too many failed attempts. Account temporarily locked.';
//       } else if (error.code === 'auth/user-disabled') {
//         errorMessage = 'This account has been disabled.';
//       }
      
//       showLoginError(errorMessage);
//       loginBtn.disabled = false;
//       loginBtn.textContent = 'Sign In';
//     }
//   });
// }

// // Google login (for login page)
// if (googleLoginBtn) {
//   googleLoginBtn.addEventListener('click', async () => {
//     try {
//       const provider = new GoogleAuthProvider();
//       const result = await signInWithPopup(auth, provider);
//       const user = result.user;

//       // Update last login timestamp in Firestore
//       await setDoc(doc(db, "Accounts", user.uid), {
//         lastLogin: serverTimestamp(),
//         emailVerified: user.emailVerified || false
//       }, { merge: true });

//       showLoginSuccess('Welcome back to FootMaster Pro!');
//       setTimeout(() => {
//         window.location.href = 'index.html';
//       }, 1000);

//     } catch (error) {
//       showLoginError(error.message);
//     }
//   });
// }

// // Apple login (for login page)
// if (appleLoginBtn) {
//   appleLoginBtn.addEventListener('click', async () => {
//     try {
//       const provider = new OAuthProvider('apple.com');
//       const result = await signInWithPopup(auth, provider);
//       const user = result.user;

//       // Update last login timestamp in Firestore
//       await setDoc(doc(db, "Accounts", user.uid), {
//         lastLogin: serverTimestamp(),
//         emailVerified: user.emailVerified || false
//       }, { merge: true });

//       showLoginSuccess('Welcome back to FootMaster Pro!');
//       setTimeout(() => {
//         window.location.href = 'index.html';
//       }, 1000);

//     } catch (error) {
//       showLoginError(error.message);
//     }
//   });
// }

// // Helper functions for login
// function showLoginError(message) {
//   loginErrorElement.textContent = message;
//   loginErrorElement.style.display = 'block';
//   loginErrorElement.style.color = '#ff4444';
//   loginErrorElement.style.backgroundColor = '#ffebee';
// }

// function showLoginSuccess(message) {
//   loginErrorElement.textContent = message;
//   loginErrorElement.style.display = 'block';
//   loginErrorElement.style.color = '#00C851';
//   loginErrorElement.style.backgroundColor = '#e8f5e9';
// }