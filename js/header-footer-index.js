class HeaderElem extends HTMLElement {
    connectedCallback() {
        this.innerHTML = `
        <div class="header py-3">
            <div class="d-flex justify-content-between align-items-center">
                <div class="d-flex align-items-center">
                    <img src="assets/images/Logo.png" alt="Logo" class="logo">
                    <h1 class="site-title">Coding Tutorial Website</h1>
                </div>
                <div class="search-bar-container">
                    <input type="text" class="search-bar" placeholder="Search...">
                    <span class="search-icon">
                        <img src="assets/images/search.png" alt="Search Icon">
                    </span>
                </div>
                <div class="user-info d-none d-md-flex">
                    <span class="username"><a href="html/login.html">Log in</a></span>
                </div>
                <button class="navbar-toggler d-md-none" type="button" data-bs-toggle="offcanvas" data-bs-target="#mobileMenu" aria-controls="mobileMenu">
                    <img src="assets/images/navigation-bar.png" alt="Menu" style="width: 30px; height: 30px;">
                </button>
            </div>
            <nav class="navbar navbar-expand-md navbar-light">
                <div class="container-fluid">
                    <div class="collapse navbar-collapse">
                        <ul class="navbar-nav">
                            <li class="nav-item"><a class="nav-link" href="#">Home</a></li>
                            <li class="nav-item"><a class="nav-link" href="#">Tutorials</a></li>
                            <li class="nav-item"><a class="nav-link" href="#">Compiler</a></li>
                            <li class="nav-item"><a class="nav-link" href="#">Exercises</a></li>
                            <li class="nav-item"><a class="nav-link" href="#">Contact Us</a></li>
                        </ul>
                    </div>
                </div>
            </nav>
        </div>

        <!-- Offcanvas Menu -->
        <div class="offcanvas offcanvas-end" tabindex="-1" id="mobileMenu" aria-labelledby="mobileMenuLabel">
            <div class="offcanvas-header">
                <h5 class="offcanvas-title" id="mobileMenuLabel">Menu</h5>
                <button type="button" class="btn-close" data-bs-dismiss="offcanvas" aria-label="Close"></button>
            </div>
            
            <div class="offcanvas-body">
                <div class="user-info d-flex flex-column align-items-center">
                    <span class="username"><a href="html/login.html">Log in</a></span>
                </div>
                <ul class="navbar-nav mt-4">
                    <li class="nav-item"><a class="nav-link" href="#">Home</a></li>
                    <li class="nav-item"><a class="nav-link" href="#">Tutorials</a></li>
                    <li class="nav-item"><a class="nav-link" href="#">Compiler</a></li>
                    <li class="nav-item"><a class="nav-link" href="#">Exercises</a></li>
                    <li class="nav-item"><a class="nav-link" href="#">Contact Us</a></li>
                </ul>
            </div>
        </div>
        `;
    }
}



class FooterElem extends HTMLElement {
    connectedCallback() {
        this.innerHTML = `
        <div class="footer">
            <div class="container">
                <p>&copy; 2024 Skill Stack. All rights reserved.</p>
                <div class="social-icons">
                    <a href="#"><img src="IMAGES/facebook.png" alt="Facebook"></a>
                    <a href="#"><img src="IMAGES/twitter.png" alt="Twitter"></a>
                    <a href="#"><img src="IMAGES/linkedin.png" alt="LinkedIn"></a>
                </div>
            </div>
        </div>
        `;
    }
}

customElements.define('head-element', HeaderElem)
customElements.define('foot-element', FooterElem)