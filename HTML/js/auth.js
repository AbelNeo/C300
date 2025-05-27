// auth.js
import { initializeApp } from "https://www.gstatic.com/firebasejs/9.22.0/firebase-app.js";
import { 
    getAuth, 
    signInWithEmailAndPassword,
    onAuthStateChanged
} from "https://www.gstatic.com/firebasejs/9.22.0/firebase-auth.js";

// Your Firebase config (same as before)
const firebaseConfig = {
    apiKey: "AIzaSyDZVSQAwB1YnKv6Pr_5kbsjvUz074mDsQ0",
    authDomain: "football-club-management-3c136.firebaseapp.com",
    projectId: "football-club-management-3c136",
    storageBucket: "football-club-management-3c136.appspot.com",
    messagingSenderId: "388394869174",
    appId: "1:388394869174:web:ec8f93ab8fb685e9846117"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);

// DOM Elements
const loginForm = document.getElementById('loginForm');
const emailInput = document.getElementById('email');
const passwordInput = document.getElementById('password');
const togglePassword = document.getElementById('togglePassword');
const emailError = document.getElementById('emailError');
const passwordError = document.getElementById('passwordError');

// Toggle password visibility
togglePassword.addEventListener('click', () => {
    const type = passwordInput.getAttribute('type') === 'password' ? 'text' : 'password';
    passwordInput.setAttribute('type', type);
    togglePassword.textContent = type === 'password' ? 'Show' : 'Hide';
});

// Login form submission
loginForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    
    const email = emailInput.value;
    const password = passwordInput.value;
    
    // Clear previous errors
    emailError.textContent = '';
    passwordError.textContent = '';
    
    try {
        const userCredential = await signInWithEmailAndPassword(auth, email, password);
        const user = userCredential.user;
        
        // Redirect to dashboard after successful login
        window.location.href = 'index.html';
    } catch (error) {
        handleLoginError(error);
    }
});

// Handle login errors
function handleLoginError(error) {
    switch (error.code) {
        case 'auth/invalid-email':
            emailError.textContent = 'Invalid email format';
            break;
        case 'auth/user-not-found':
            emailError.textContent = 'No account found with this email';
            break;
        case 'auth/wrong-password':
            passwordError.textContent = 'Incorrect password';
            break;
        case 'auth/too-many-requests':
            passwordError.textContent = 'Account temporarily locked due to too many attempts';
            break;
        default:
            passwordError.textContent = 'Login failed. Please try again.';
            console.error('Login error:', error);
    }
}

// Check auth state (if user is already logged in)
onAuthStateChanged(auth, (user) => {
    if (user) {
        // User is signed in, redirect to index
        window.location.href = 'index.html';
    }
});