import { initializeApp } from "firebase/app";
import { 
    auth, 
    createUserWithEmailAndPassword,
    GoogleAuthProvider, 
    signInWithPopup,
    OAuthProvider
} from './firebase.js';
import { doc, setDoc, serverTimestamp } from 'firebase/firestore';

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


                await setDoc(doc(db, "Accounts", user.uid), 
                {email: user.email,
                    createdAt: serverTimestamp(),
                    favoritePlayers: [], // Initialize empty array
                    membershipType: "bronze", // Default tier
                    lastLogin: serverTimestamp()
});

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
            window.location.href = 'index.html';
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
            window.location.href = 'index.html';
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
