class FooterComponent extends HTMLElement {
    constructor() {
        super();
        // Bind methods (good practice)
        this.handleLogout = this.handleLogout.bind(this);
        this.updateAuthUI = this.updateAuthUI.bind(this);
    }

    async connectedCallback() {
        try {
            this.renderLoading();
            await this.loadFooter();
            this.setupEventListeners();
            this.updateAuthUI();
            
            // Dispatch event when footer is ready
            this.dispatchEvent(new CustomEvent('footer-loaded'));
        } catch (error) {
            this.renderError();
            console.error('Footer loading failed:', error);
        }
    }

    renderLoading() {
        this.innerHTML = `
            <div class="footer-loading" style="
                padding: 1rem;
                text-align: center;
                color: #ffcc00;
            ">
                Loading footer...
            </div>
        `;
    }

    renderError() {
        this.innerHTML = `
            <div class="footer-error" style="
                padding: 1rem;
                text-align: center;
                color: #dc3545;
                border: 1px solid #dc3545;
            ">
                Failed to load footer. Please refresh the page.
            </div>
        `;
    }

    async loadFooter() {
        const response = await fetch('components/footer.html');
        if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
        this.innerHTML = await response.text();
    }

    setupEventListeners() {
        // Better event delegation pattern
        this.addEventListener('click', (e) => {
            if (e.target.closest('[data-action="logout"]')) {
                this.handleLogout(e);
            }
        });
    }

    handleLogout(e) {
        e.preventDefault();
        // Consider using a more secure auth system in production
        localStorage.removeItem('currentUser');
        sessionStorage.removeItem('authToken'); // If using tokens
        
        // Dispatch event before navigation
        this.dispatchEvent(new CustomEvent('user-logged-out'));
        
        // Consider using router.navigate() if you have a SPA
        window.location.href = 'index.html';
    }

    updateAuthUI() {
        const user = localStorage.getItem('currentUser');
        const authElements = this.querySelectorAll('[data-auth-state]');
        
        authElements.forEach(element => {
            const showWhen = element.dataset.authState;
            element.style.display = 
                (showWhen === 'authenticated' && user) ||
                (showWhen === 'anonymous' && !user)
                    ? 'block' 
                    : 'none';
        });
    }
}

// Register the component
if (!customElements.get('footer-component')) {
    customElements.define('footer-component', FooterComponent);
}























































// class FooterComponent extends HTMLElement {
//     constructor() {
//         super();
//         this.handleLogout = this.handleLogout.bind(this);
//     }

//     async connectedCallback() {
//         try {
//             this.innerHTML = '<div class="footer-loading">Loading...</div>';
//             await this.loadFooter();
//             this.setupEventListeners();
//             this.updateAuthUI();
//         } catch (error) {
//             console.error('Footer loading failed:', error);
//             this.innerHTML = '<p>Error loading navigation</p>';
//         }
//     }

//     async loadFooter() {
//         const response = await fetch('components/footer.html');
//         if (!response.ok) throw new Error('Failed to load footer');
//         this.innerHTML = await response.text();
//     }

//     setupEventListeners() {
//         this.addEventListener('click', (e) => {
//             if (e.target.closest('#logoutBtn')) {
//                 this.handleLogout(e);
//             }
//         });
//     }

//     handleLogout(e) {
//         e.preventDefault();
//         localStorage.removeItem('currentUser');
//         this.updateAuthUI();
//         window.location.href = 'index.html';
//     }

//     updateAuthUI() {
//         const user = localStorage.getItem('currentUser');
//         const loginBtn = this.querySelector('#loginBtn');
//         const signupBtn = this.querySelector('#signupBtn');
//         const logoutBtn = this.querySelector('#logoutBtn');

//         [loginBtn, signupBtn, logoutBtn].forEach(btn => {
//             if (!btn) return;
//             if (user) {
//                 btn.style.display = btn.id === 'logoutBtn' ? 'block' : 'none';
//             } else {
//                 btn.style.display = btn.id === 'logoutBtn' ? 'none' : 'block';
//             }
//         });
//     }
// }

// customElements.define('footer-component', FooterComponent);