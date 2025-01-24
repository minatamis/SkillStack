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
              
              <div class="user-info d-none d-md-flex">
                  <div class="username">
                    <span id="loggedUserFName"></span> <span id="loggedUserLName"></span><br>
                    <small id="stat">User</small>
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
        <div class="user-info1 d-flex flex-column align-items-center">
    <div class="user-icon1-container" id="profButton">
      <img src="../assets/images/profile.png" alt="User" class="user-icon1">
    </div>
    
  </div>
  <div class="nav-buttons d-flex flex-column align-items-center mt-3">
    <button class="btn btn-logout mt-2" id="logout">Logout</button>
  </div>
</div>
              <ul class="navbar-nav1 mt-4">
                  <li class="nav-item1"><a class="nav-link1" href="home.html">Home</a></li>
                  <li class="nav-item1"><a class="nav-link1" href="tutorials.html">Tutorials</a></li>
                  <li class="nav-item1"><a class="nav-link1" href="text-editor.html">Compiler</a></li>
                  <li class="nav-item1"><a class="nav-link1" href="exercise-list.html">Exercises</a></li>
                  <li class="nav-item1"><a class="nav-link1" href="contact-us.html">Contact Us</a></li>
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
      <div class="logo2">
      <a href="home.html">
        <img src="../assets/images/Logo.png" alt="Skill Stack Logo">
      </a>
    </div>
          <div class="container1">
              <ul class="wrapper">
    <li class="icon facebook">
      <a href="https://www.facebook.com/profile.php?id=61569136590076" target="_blank" rel="noopener noreferrer">
      <span class="tooltip">Facebook</span>
      <svg
        viewBox="0 0 320 512"
        height="1.2em"
        fill="currentColor"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path
          d="M279.14 288l14.22-92.66h-88.91v-60.13c0-25.35 12.42-50.06 52.24-50.06h40.42V6.26S260.43 0 225.36 0c-73.22 0-121.08 44.38-121.08 124.72v70.62H22.89V288h81.39v224h100.17V288z"
        ></path>
      </svg>
  </a>
    </li>
  
  
  
    <li class="icon gmail">
      <a href="https://mail.google.com/mail/u/0/#inbox?compose=CllgCJvkXgcblhFPrTbzKLgdBhNDxsvmHJrdjMQzsbdnmMBnZtpmpsMqWPzpJjzWHDGdRvSXxMg">
        <span class="tooltip">Gmail</span>
        <svg
          viewBox="0 0 32 32"
          height="1.9em"
          fill="currentColor"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
      <path d="M22.0515 8.52295L16.0644 13.1954L9.94043 8.52295V8.52421L9.94783 8.53053V15.0732L15.9954 19.8466L22.0515 15.2575V8.52295Z" fill="#EA4335"/>
      <path d="M23.6231 7.38639L22.0508 8.52292V15.2575L26.9983 11.459V9.17074C26.9983 9.17074 26.3978 5.90258 23.6231 7.38639Z" fill="#FBBC05"/>
      <path d="M22.0508 15.2575V23.9924H25.8428C25.8428 23.9924 26.9219 23.8813 26.9995 22.6513V11.459L22.0508 15.2575Z" fill="#34A853"/>
      <path d="M9.94811 24.0001V15.0732L9.94043 15.0669L9.94811 24.0001Z" fill="#C5221F"/>
      <path d="M9.94014 8.52404L8.37646 7.39382C5.60179 5.91001 5 9.17692 5 9.17692V11.4651L9.94014 15.0667V8.52404Z" fill="#C5221F"/>
      <path d="M9.94043 8.52441V15.0671L9.94811 15.0734V8.53073L9.94043 8.52441Z" fill="#C5221F"/>
      <path d="M5 11.4668V22.6591C5.07646 23.8904 6.15673 24.0003 6.15673 24.0003H9.94877L9.94014 15.0671L5 11.4668Z" fill="#4285F4"/>
        </svg>
      </li>
  
    <li class="icon instagram">
  <a href="https://www.instagram.com/skillstackwebsite/profilecard/">
    <span class="tooltip">Instagram</span>
    <svg
      xmlns="http://www.w3.org/2000/svg"
      height="1.2em"
      fill="currentColor"
      class="bi bi-instagram"
      viewBox="0 0 16 16"
    >
      <path
        d="M8 0C5.829 0 5.556.01 4.703.048 3.85.088 3.269.222 2.76.42a3.917 3.917 0 0 0-1.417.923A3.927 3.927 0 0 0 .42 2.76C.222 3.268.087 3.85.048 4.7.01 5.555 0 5.827 0 8.001c0 2.172.01 2.444.048 3.297.04.852.174 1.433.372 1.942.205.526.478.972.923 1.417.444.445.89.719 1.416.923.51.198 1.09.333 1.942.372C5.555 15.99 5.827 16 8 16s2.444-.01 3.298-.048c.851-.04 1.434-.174 1.943-.372a3.916 3.916 0 0 0 1.416-.923c.445-.445.718-.891.923-1.417.197-.509.332-1.09.372-1.942C15.99 10.445 16 10.173 16 8s-.01-2.445-.048-3.299c-.04-.851-.175-1.433-.372-1.941a3.926 3.926 0 0 0-.923-1.417A3.911 3.911 0 0 0 13.24.42c-.51-.198-1.092-.333-1.943-.372C10.443.01 10.172 0 7.998 0h.003zm-.717 1.442h.718c2.136 0 2.389.007 3.232.046.78.035 1.204.166 1.486.275.373.145.64.319.92.599.28.28.453.546.598.92.11.281.24.705.275 1.485.039.843.047 1.096.047 3.231s-.008 2.389-.047 3.232c-.035.78-.166 1.203-.275 1.485a2.47 2.47 0 0 1-.599.919c-.28.28-.546.453-.92.598-.28.11-.704.24-1.485.276-.843.038-1.096.047-3.232.047s-2.39-.009-3.233-.047c-.78-.036-1.203-.166-1.485-.276a2.478 2.478 0 0 1-.92-.598 2.48 2.48 0 0 1-.6-.92c-.109-.281-.24-.705-.275-1.485-.038-.843-.046-1.096-.046-3.233 0-2.136.008-2.388.046-3.231.036-.78.166-1.204.276-1.486.145-.373.319-.64.599-.92.28-.28.546-.453.92-.598.282-.11.705-.24 1.485-.276.738-.034 1.024-.044 2.515-.045v.002zm4.988 1.328a.96.96 0 1 0 0 1.92.96.96 0 0 0 0-1.92zm-4.27 1.122a4.109 4.109 0 1 0 0 8.217 4.109 4.109 0 0 0 0-8.217zm0 1.441a2.667 2.667 0 1 1 0 5.334 2.667 2.667 0 0 1 0-5.334z"
      ></path>
    </svg>
    </a>
  </li>
  </ul>
  </div>
  
  
         <div class="container2">
      <div class="navbar">
        <a href="home.html">Home</a>
        <a href="tutorials.html">Tutorials</a>
        <a href="text-editor.html">Compiler</a>
        <a href="exercise-list.html">Exercises</a>
        <a href="contact-us.html">Contact Us</a>
      </div>
    </div>
  
      </footer>
       <div class="copyright">
          <p>Copyright 2024.  |<a href="../assets/Policy.pdf">Policy</a></p>
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