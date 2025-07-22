class NavbarComponent extends HTMLElement {
    constructor() {
        super();
        this.handleLogout = this.handleLogout.bind(this);
    }

    async connectedCallback() {
        try {
            this.innerHTML = '<div class="navbar-loading">Loading...</div>';
            await this.loadNavbar();
            this.setupEventListeners();
            window.addEventListener('storage', () => {
            this.updateAuthUI();
        });

        } catch (error) {
            console.error('Navbar loading failed:', error);
            this.innerHTML = '<p>Error loading navigation</p>';
        }
    }

async loadNavbar() {
    const response = await fetch('components/navbar.html');
    if (!response.ok) throw new Error('Failed to load navbar');
    this.innerHTML = await response.text();
    this.adjustBodyPadding(); // Push content down after navbar is rendered
    this.updateAuthUI();
}

adjustBodyPadding() {
    const navbar = this.querySelector('.navbar');
    if (navbar) {
        const updatePadding = () => {
            document.body.style.paddingTop = navbar.offsetHeight + 'px';
        };

        updatePadding();
        window.addEventListener('resize', updatePadding);
    }
}


    setupEventListeners() {
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
        window.location.href = 'index.html';
    }

    updateAuthUI() {
        const user = localStorage.getItem('currentUser');
        const loginBtn = this.querySelector('#loginBtn');
        const signupBtn = this.querySelector('#signupBtn');
        const logoutBtn = this.querySelector('#logoutBtn');
        const manageMatchesNav = this.querySelector('#manageMatchesNav');

        [loginBtn, signupBtn, logoutBtn].forEach(btn => {
            if (!btn) return;
            if (user) {
                btn.style.display = btn.id === 'logoutBtn' ? 'block' : 'none';
            } else {
                btn.style.display = btn.id === 'logoutBtn' ? 'none' : 'block';
            }
        });
        // Show/hide Manage Matches button
        if (manageMatchesNav) {
            let showBtn = false;
            if (user) {
                try {
                    const userObj = JSON.parse(user);
                    if (userObj.email === "evansker94@gmail.com") {
                        showBtn = true;
                    }
                } catch (e) {}
            }
            manageMatchesNav.style.display = showBtn ? 'inline-block' : 'none';
        }
    }
}

customElements.define('navbar-component', NavbarComponent);