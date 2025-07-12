import { 
  db, 
  setDoc, 
  doc, 
  serverTimestamp,
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
      const user = userCredential.user;

      // Create Firestore user document
      await setDoc(doc(db, "Accounts", user.uid), {
        email: user.email,
        createdAt: serverTimestamp(),
        favoritePlayers: [],
        tier: "Bronze",
        lastLogin: serverTimestamp(),
        emailVerified: false // Set to false by default, only true after email verification
      });

      // Send verification email
      await sendEmailVerification(user);

      showSuccess('Account created! Please check your email for verification.');
      setTimeout(() => {
        window.location.href = 'index.html';
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
      const user = result.user;

      if (auth && user) {
        // Email is already in use
        showError('An account already exists with this email. Please log in instead next time.');
      showSuccess('Welcome back to FootMaster Pro!');
      setTimeout(() => {
        window.location.href = 'index.html';
      }, 1000);
        return; // Proceed without creating a new account
      }

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

// Apple Sign-In
if (appleBtn) {
  appleBtn.addEventListener('click', async () => {
    try {
      const provider = new OAuthProvider('apple.com');
      const result = await signInWithPopup(auth, provider);
      const user = result.user;

      if (auth && user) {
        // Email is already in use
        showError('An account already exists with this email. Please log in instead next time.');
      showSuccess('Welcome back to FootMaster Pro!');
      setTimeout(() => {
        window.location.href = 'index.html';
      }, 1000);
        return; // Proceed without creating a new account
      }

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