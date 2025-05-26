class NavbarComponent extends HTMLElement {
    connectedCallback() {
        this.loadNavbar();
    }

    async loadNavbar() {
        const response = await fetch('components/navbar.html');
        const html = await response.text();
        this.innerHTML = html;
        this.updateAuthUI();
    }

    updateAuthUI() {
        // Same as previous updateAuthUI()
    }
}

customElements.define('navbar-component', NavbarComponent);