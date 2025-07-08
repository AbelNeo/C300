import { 
    db, // Use your initialized db from firebase.js
    auth, 
    createUserWithEmailAndPassword,
    GoogleAuthProvider, 
    signInWithPopup,
    OAuthProvider,
    setDoc, doc, serverTimestamp
} from './firebase.js';

document.addEventListener('DOMContentLoaded', () => {
    // Email/password signup
    const signupForm = document.querySelector('.signup-form');
    if (signupForm) {
        signupForm.addEventListener('submit', async (e) => {
            e.preventDefault();
            
            const email = signupForm.querySelector('input[type="email"]').value;
            const password = signupForm.querySelector('input[type="password"]').value;
            
            if (password.length < 6) {
                showError('Password should be at least 6 characters');
                return;
            }
            
            try {
                const userCredential = await createUserWithEmailAndPassword(auth, email, password);
                const user = userCredential.user;

                await setDoc(doc(db, "Accounts", user.uid), {
                    email: user.email,
                    createdAt: serverTimestamp(),
                    favoritePlayers: [],
                    tier: "Bronze", // Default tier
                    lastLogin: serverTimestamp(),
                    emailVerified: true // mark as verified for demo
                });

                window.location.href = 'index.html';

            } catch (error) {
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

            await setDoc(doc(db, "Accounts", user.uid), {
                email: user.email,
                createdAt: serverTimestamp(),
                favoritePlayers: [],
                tier: "Bronze",
                lastLogin: serverTimestamp(),
                emailVerified: true
            }, { merge: true });

            window.location.href = 'index.html';
        } catch (error) {
            showError(error.message);
        }
    });
    
    // Apple Sign-In
    document.querySelector('.apple-btn')?.addEventListener('click', async () => {
        const provider = new OAuthProvider('apple.com');
        try {
            const result = await signInWithPopup(auth, provider);
            const user = result.user;

            await setDoc(doc(db, "Accounts", user.uid), {
                email: user.email,
                createdAt: serverTimestamp(),
                favoritePlayers: [],
                tier: "Bronze",
                lastLogin: serverTimestamp(),
                emailVerified: true
            }, { merge: true });

            window.location.href = 'index.html';
        } catch (error) {
            showError(error.message);
        }
    });
});

function showError(message) {
    const errorElement = document.getElementById('error-message');
    if (errorElement) {
        errorElement.textContent = message;
        errorElement.style.display = 'block';
        setTimeout(() => {
            errorElement.style.display = 'none';
        }, 5000);
    }
}