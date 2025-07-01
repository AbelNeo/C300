class NavbarComponent extends HTMLElement {
    constructor() {
        super();
        this.handleLogout = this.handleLogout.bind(this); // Bind context
    }

    async connectedCallback() {
        try {
            await this.loadNavbar();
            this.setupEventListeners();
            this.updateAuthUI();
        } catch (error) {
            console.error('Navbar loading failed:', error);
            this.innerHTML = '<p>Error loading navigation</p>';
        }
    }

    async loadNavbar() {
        const response = await fetch('/HTML/components/navbar.html');
        if (!response.ok) throw new Error('Failed to load navbar');
        this.innerHTML = await response.text();
    }

    setupEventListeners() {
        // Use event delegation for dynamic elements
        this.addEventListener('click', (e) => {
            if (e.target.closest('#logoutBtn')) {
                this.handleLogout(e);
            }
        });
    }

    handleLogout(e) {
        e.preventDefault();
        localStorage.removeItem('currentUser');
        this.updateAuthUI();
        window.location.href = '/HTML/index.html';
    }

    connectedCallback() {
    this.innerHTML = '<div class="navbar-loading">Loading...</div>';
    this.loadNavbar().catch(/* ... */);
}

    updateAuthUI() {
        const user = localStorage.getItem('currentUser');
        const loginBtn = this.querySelector('#loginBtn');
        const signupBtn = this.querySelector('#signupBtn');
        const logoutBtn = this.querySelector('#logoutBtn');

        [loginBtn, signupBtn, logoutBtn].forEach(btn => {
            if (!btn) return;
            
            if (user) {
                btn.style.display = btn.id === 'logoutBtn' ? 'block' : 'none';
            } else {
                btn.style.display = btn.id === 'logoutBtn' ? 'none' : 'block';
            }
        });
    }
}

customElements.define('navbar-component', NavbarComponent);



// class NavbarComponent extends HTMLElement {
//     connectedCallback() {
//         this.loadNavbar();
//     }

//     async loadNavbar() {
//         const response = await fetch('components/navbar.html');
//         const html = await response.text();
//         this.innerHTML = html;
//         this.updateAuthUI();
//     }

//     updateAuthUI() {
//     const user = localStorage.getItem('currentUser');
//     const loginBtn = document.getElementById('loginBtn');
//     const signupBtn = document.getElementById('signupBtn');
//     const logoutBtn = document.getElementById('logoutBtn');

//     if (user) {
//         if (loginBtn) loginBtn.style.display = 'none';
//         if (signupBtn) signupBtn.style.display = 'none';
//         if (logoutBtn) logoutBtn.style.display = 'block';
//     } else {
//         if (loginBtn) loginBtn.style.display = 'block';
//         if (signupBtn) signupBtn.style.display = 'block';
//         if (logoutBtn) logoutBtn.style.display = 'none';
//     }
//     }
//     //logout functionality
// document.addEventListener('click', (e) => {
//     if (e.target.closest('#logoutBtn')) {
//         e.preventDefault();
//         localStorage.removeItem('currentUser');
//         updateAuthUI();
//         window.location.href = 'index.html';
//     }
// })

// }

// customElements.define('navbar-component', NavbarComponent);