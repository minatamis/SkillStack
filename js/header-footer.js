class HeaderElem extends HTMLElement {
  connectedCallback() {
    this.innerHTML = `
    <div class="header py-3">
        <div class="d-flex justify-content-between align-items-center">
            <div class="d-flex align-items-center">
                <img src="../assets/images/Logo.png" alt="Logo" class="logo">
                <h1 class="site-title">Coding Tutorial Website</h1>
                 <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.0.0-beta3/css/all.min.css">
            </div>
            <div class="search-bar-container">
                <!--<input type="text" class="search-bar" placeholder="Search...">
                <span class="search-icon">
                    <img src="../assets/images/search.png" alt="Search Icon">
                </span>-->
            </div>
            <div class="user-info d-none d-md-flex">
                <div class="username">
                  <span id="loggedUserFName"></span> <span id="loggedUserLName"></span><br>
                  <small>User</small>
                  <div id="userOptions" class="user-options">
                    <a id="profButton">Profile</a>
                    <button id="logout">Logout</button>
                  </div>
                </div>
                <img src="../assets/images/profile.png" alt="User" class="user-icon" id="userIcon">
            </div>

            <button class="navbar-toggler d-md-none" type="button" data-bs-toggle="offcanvas" data-bs-target="#mobileMenu" aria-controls="mobileMenu">
                <img src="../assets/images/navigation-bar.png" alt="Menu" style="width: 30px; height: 30px;">
            </button>
        </div>
        <nav class="navbar navbar-expand-md navbar-light">
            <div class="container-fluid">
                <div class="collapse navbar-collapse">
                    <ul class="navbar-nav">
                        <li class="nav-item"><a class="nav-link" href="home.html">Home</a></li>
                        <li class="nav-item"><a class="nav-link" href="tutorials.html">Tutorials</a></li>
                        <li class="nav-item"><a class="nav-link" href="text-editor.html">Compiler</a></li>
                        <li class="nav-item"><a class="nav-link" href="exercise-list.html">Exercises</a></li>
                        <li class="nav-item"><a class="nav-link" href="contact-us.html">Contact Us</a></li>
                    </ul>
                </div>
            </div>
        </nav>
    </div>
    <div class="offcanvas offcanvas-end" tabindex="-1" id="mobileMenu" aria-labelledby="mobileMenuLabel">
        <div class="offcanvas-header">
            <h5 class="offcanvas-title" id="mobileMenuLabel">Menu</h5>
            <button type="button" class="btn-close" data-bs-dismiss="offcanvas" aria-label="Close"></button>
        </div>
        <div class="offcanvas-body">
            <div class="user-info d-flex flex-column align-items-center">
                <img src="../assets/images/profile.png" alt="User" class="user-icon">
                <span id="loggedUserFName"></span> <span id="loggedUserLName"></span><br>
            </div>
            <ul class="navbar-nav mt-4">
                <li class="nav-item"><a class="nav-link" href="home.html">Home</a></li>
                <li class="nav-item"><a class="nav-link" href="tutorials.html">Tutorials</a></li>
                <li class="nav-item"><a class="nav-link" href="text-editor.html">Compiler</a></li>
                <li class="nav-item"><a class="nav-link" href="exercise-list.html">Exercises</a></li>
                <li class="nav-item"><a class="nav-link" href="contact-us.html">Contact Us</a></li>
            </ul>
        </div>
    </div>
    `;
  }
}

class FooterElem extends HTMLElement {
  connectedCallback() {
    this.innerHTML = `
    <footer class="footer">
        <div class="container1">
            <h3>Connect with us!</h3>
            <p>Polytechnic University of the Philippines - <br> Binan Campus</p>
            <ul class="wrapper">
                <li class="icon gmail">
                    <a href="https://mail.google.com/mail/u/0/#inbox?compose=CllgCJvkXgcblhFPrTbzKLgdBhNDxsvmHJrdjMQzsbdnmMBnZtpmpsMqWPzpJjzWHDGdRvSXxMg">
                        <span class="tooltip">Gmail</span>
                        <svg
                            viewBox="0 0 32 32"
                            height="1.9em"
                            fill="currentColor"
                            xmlns="http://www.w3.org/2000/svg"
                        >
                            <path d="..." fill="#EA4335"/>
                        </svg>
                    </a>
                </li>
                <!-- Other social media icons -->
            </ul>
        </div>
        <div class="container2">
<<<<<<< Updated upstream
            <div class="links">
                <h3>Links</h3>
                <ul>
                    <li><a href="home.html">Home</a></li>
                    <li><a href="tutorials.html">Tutorials</a></li>
                    <li><a href="text-editor.html">Compiler</a></li>
                    <li><a href="exercise-list.html">Exercises</a></li>
                    <li><a href="contact-us.html">Contact Us</a></li>
                </ul>
            </div>
=======
        <div class="links">
            <ul>
                <li><a href="home.html" title="Home"><i class="fas fa-home"></i></a></li>
                <li><a href="tutorials.html" title="Tutorials"><i class="fas fa-book"></i></a></li>
                <li><a href="text-editor.html" title="Compiler"><i class="fas fa-code"></i></a></li>
                <li><a href="exercise-list.html" title="Exercises"><i class="fas fa-chalkboard-teacher"></i></a></li>
                <li><a href="contact-us.html" title="Contact Us"><i class="fas fa-phone-alt"></i></a></li>
            </ul>
>>>>>>> Stashed changes
        </div>
    </div>

    </footer>
     <div class="copyright">
        <p>Copyright 2024.  |<a href="policy.html">Policy</a></p>
    </div>
    `;
  }
}

customElements.define('head-element', HeaderElem);
customElements.define('foot-element', FooterElem);

document.addEventListener("DOMContentLoaded", function () {
  const userIcon = document.getElementById("userIcon");
  const userOptions = document.getElementById("userOptions");

  userIcon.addEventListener("click", function (e) {
    e.stopPropagation();
    userOptions.style.display = userOptions.style.display === "block" ? "none" : "block";
  });

  document.addEventListener("click", function (e) {
    if (!userIcon.contains(e.target) && !userOptions.contains(e.target)) {
      userOptions.style.display = "none";
    }
  });

  // JavaScript for dynamically setting the active class
  const currentPage = window.location.pathname;
  const navLinks = document.querySelectorAll('.nav-link');

  navLinks.forEach(link => {
    if (link.href.includes(currentPage)) {
      link.classList.add('active');
    }
  });
});
