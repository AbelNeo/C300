import { 
  auth, 
  createUserWithEmailAndPassword,
  GoogleAuthProvider, 
  signInWithPopup,
  OAuthProvider,
  sendEmailVerification
} from './firebase.js';

// DOM Elements
const signupForm = document.getElementById('signupForm');
const googleBtn = document.getElementById('googleSignup');
const appleBtn = document.getElementById('appleSignup');
const signupBtn = document.getElementById('signupButton');
const errorElement = document.getElementById('error-message');

// Email/Password Signup
if (signupForm) {
  signupForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    const email = signupForm.email.value;
    const password = signupForm.password.value;
    
    // Show loading state
    signupBtn.disabled = true;
    signupBtn.textContent = 'Creating account...';
    errorElement.textContent = '';
    errorElement.style.display = 'none';
    
    // Validation
    if (password.length < 6) {
      showError('Password must be at least 6 characters');
      signupBtn.disabled = false;
      signupBtn.textContent = 'Create Account';
      return;
    }
    
    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      
      // Send verification email
      await sendEmailVerification(userCredential.user);
      
      showSuccess('Account created! Please check your email for verification.');
      setTimeout(() => {
        window.location.href = 'dashboard.html';
      }, 3000);
      
    } catch (error) {
      showError(error.message);
      signupBtn.disabled = false;
      signupBtn.textContent = 'Create Account';
    }
  });
}

// Google Sign-In
if (googleBtn) {
  googleBtn.addEventListener('click', async () => {
    try {
      const provider = new GoogleAuthProvider();
      const result = await signInWithPopup(auth, provider);
      
      // Check if user is new
      if (result.user.metadata.creationTime === result.user.metadata.lastSignInTime) {
        showSuccess('Welcome to FootMaster Pro!');
      }
      
      setTimeout(() => {
        window.location.href = 'dashboard.html';
      }, 1000);
      
    } catch (error) {
      showError(error.message);
    }
  });
}

// Apple Sign-In
if (appleBtn) {
  appleBtn.addEventListener('click', async () => {
    try {
      const provider = new OAuthProvider('apple.com');
      const result = await signInWithPopup(auth, provider);
      
      if (result.user.metadata.creationTime === result.user.metadata.lastSignInTime) {
        showSuccess('Welcome to FootMaster Pro!');
      }
      
      setTimeout(() => {
        window.location.href = 'dashboard.html';
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

// // auth.js
// import { initializeApp } from "https://www.gstatic.com/firebasejs/9.22.0/firebase-app.js";
// import { 
//     getAuth, 
//     signInWithEmailAndPassword,
//     onAuthStateChanged
// } from "https://www.gstatic.com/firebasejs/9.22.0/firebase-auth.js";

// // Your Firebase config (same as before)
// const firebaseConfig = {
//     apiKey: "AIzaSyDZVSQAwB1YnKv6Pr_5kbsjvUz074mDsQ0",
//     authDomain: "football-club-management-3c136.firebaseapp.com",
//     projectId: "football-club-management-3c136",
//     storageBucket: "football-club-management-3c136.appspot.com",
//     messagingSenderId: "388394869174",
//     appId: "1:388394869174:web:ec8f93ab8fb685e9846117"
// };

// // Initialize Firebase
// const app = initializeApp(firebaseConfig);
// const auth = getAuth(app);

// // DOM Elements
// const loginForm = document.getElementById('loginForm');
// const emailInput = document.getElementById('email');
// const passwordInput = document.getElementById('password');
// const togglePassword = document.getElementById('togglePassword');
// const emailError = document.getElementById('emailError');
// const passwordError = document.getElementById('passwordError');

// // Toggle password visibility
// togglePassword.addEventListener('click', () => {
//     const type = passwordInput.getAttribute('type') === 'password' ? 'text' : 'password';
//     passwordInput.setAttribute('type', type);
//     togglePassword.textContent = type === 'password' ? 'Show' : 'Hide';
// });

// // Login form submission
// loginForm.addEventListener('submit', async (e) => {
//     e.preventDefault();
    
//     const email = emailInput.value;
//     const password = passwordInput.value;
    
//     // Clear previous errors
//     emailError.textContent = '';
//     passwordError.textContent = '';
    
//     try {
//         const userCredential = await signInWithEmailAndPassword(auth, email, password);
//         const user = userCredential.user;
        
//         // Redirect to dashboard after successful login
//         window.location.href = 'index.html';
//     } catch (error) {
//         handleLoginError(error);
//     }
// });

// // Handle login errors
// function handleLoginError(error) {
//     switch (error.code) {
//         case 'auth/invalid-email':
//             emailError.textContent = 'Invalid email format';
//             break;
//         case 'auth/user-not-found':
//             emailError.textContent = 'No account found with this email';
//             break;
//         case 'auth/wrong-password':
//             passwordError.textContent = 'Incorrect password';
//             break;
//         case 'auth/too-many-requests':
//             passwordError.textContent = 'Account temporarily locked due to too many attempts';
//             break;
//         default:
//             passwordError.textContent = 'Login failed. Please try again.';
//             console.error('Login error:', error);
//     }
// }

// // Check auth state (if user is already logged in)
// onAuthStateChanged(auth, (user) => {
//     if (user) {
//         // User is signed in, redirect to index
//         window.location.href = 'index.html';
//     }
// });