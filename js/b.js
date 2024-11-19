document.addEventListener("DOMContentLoaded", function () {
    const userIcon = document.getElementById("userIcon");
    const userOptions = document.getElementById("userOptions");
    const userFullName = document.getElementById("userFullName");
  
    // Example: Set username dynamically
    const user = {
      firstName: "Jemuel",
      lastName: "Cebuano"
    };
    userFullName.textContent = `${user.firstName} ${user.lastName}`;
  
    // Toggle dropdown on user icon click
    userIcon.addEventListener("click", function (e) {
      e.stopPropagation(); // Prevent click event from propagating
      userOptions.style.display = userOptions.style.display === "block" ? "none" : "block";
    });
  
    // Close dropdown if clicked outside
    document.addEventListener("click", function (e) {
      if (!userIcon.contains(e.target) && !userOptions.contains(e.target)) {
        userOptions.style.display = "none";
      }
    });
  });
  