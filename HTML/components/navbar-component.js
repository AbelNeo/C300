class NavbarComponent extends HTMLElement {
    constructor() {
        super();
        this.handleLogout = this.handleLogout.bind(this);
        this.toggleMobileMenu = this.toggleMobileMenu.bind(this);
        this.handleResize = this.handleResize.bind(this);
    }

    async connectedCallback() {
        try {
            this.innerHTML = '<div class="navbar-loading">Loading...</div>';
            await this.loadNavbar();
            this.setupEventListeners();
            window.addEventListener('storage', () => {
                this.updateAuthUI();
            });
            window.addEventListener('resize', this.handleResize);
            this.handleResize();
        } catch (error) {
            console.error('Navbar loading failed:', error);
            this.innerHTML = '<p>Error loading navigation</p>';
        }
    }

    async loadNavbar() {
        const response = await fetch('components/navbar.html');
        if (!response.ok) throw new Error('Failed to load navbar');
        this.innerHTML = await response.text();
        this.adjustBodyPadding();
        this.injectMobileMenuButton();
        this.updateAuthUI();
        this.setupMobileMenu();
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

    injectMobileMenuButton() {
        // Only inject if not present
        if (this.querySelector('.navbar-mobile-toggle')) return;
        const nav = this.querySelector('.navbar .container');
        if (!nav) return;
        const btn = document.createElement('button');
        btn.className = 'navbar-mobile-toggle';
        btn.setAttribute('aria-label', 'Toggle navigation');
        btn.innerHTML = `<span style="font-size:2rem;">&#9776;</span>`;
        btn.style.background = 'none';
        btn.style.border = 'none';
        btn.style.cursor = 'pointer';
        btn.style.display = 'none'; // Hide by default, show via CSS on mobile
        nav.prepend(btn);
    }

    setupMobileMenu() {
        const toggleBtn = this.querySelector('.navbar-mobile-toggle');
        const navLinks = this.querySelector('.nav-links');
        // For mobile menu
        if (!toggleBtn || !navLinks) return;
        toggleBtn.addEventListener('click', this.toggleMobileMenu);
        // Hide menu when link is clicked (mobile)
        navLinks.querySelectorAll('a').forEach(link => {
            link.addEventListener('click', () => {
                if (window.innerWidth <= 900) {
                    navLinks.classList.remove('navbar-open');
                }
            });
        });
    }

    toggleMobileMenu() {
        const navLinks = this.querySelector('.nav-links');
        if (!navLinks) return;
        navLinks.classList.toggle('navbar-open');
    }

    handleResize() {
        const toggleBtn = this.querySelector('.navbar-mobile-toggle');
        const navLinks = this.querySelector('.nav-links');
        if (!toggleBtn || !navLinks) return;
        if (window.innerWidth <= 900) {
            toggleBtn.style.display = 'inline-block';
            navLinks.classList.remove('navbar-open'); // Closed by default
        } else {
            toggleBtn.style.display = 'none';
            navLinks.classList.remove('navbar-open');
        }
    }
}

customElements.define('navbar-component', NavbarComponent);