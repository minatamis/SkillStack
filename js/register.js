document.addEventListener('DOMContentLoaded', function() {

    console.log("JavaScript is loaded and running");
    const userRole = document.getElementById('userRole');
    const teacherIdContainer = document.getElementById('teacherIdContainer');
  
    userRole.addEventListener('change', function() {
      if (userRole.value === 'teacher') {
        teacherIdContainer.style.display = 'block';
      } else {
        teacherIdContainer.style.display = 'none';
      }
    });
  });
  