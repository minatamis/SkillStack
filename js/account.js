import { initializeApp } from "https://www.gstatic.com/firebasejs/11.0.1/firebase-app.js";
import { getAuth, onAuthStateChanged, signOut } from "https://www.gstatic.com/firebasejs/11.0.1/firebase-auth.js";
import { getFirestore, getDoc, doc } from "https://www.gstatic.com/firebasejs/11.0.1/firebase-firestore.js";

const firebaseConfig = {
  apiKey: "AIzaSyBcp4pT_gjNkNJV8PU8T2Fx2ahBblFLMEs",
  authDomain: "skill-stack-df84c.firebaseapp.com",
  projectId: "skill-stack-df84c",
  storageBucket: "skill-stack-df84c.appspot.com",
  messagingSenderId: "208320005858",
  appId: "1:208320005858:web:ec4bf63c6da69c598680bb",
  measurementId: "G-WMJQPKF15X"
};
 
const app = initializeApp(firebaseConfig);

const auth = getAuth();
const db = getFirestore();

onAuthStateChanged(auth, (user) => {
  const loggedInUserId = localStorage.getItem('loggedInUserId'); // Retrieve user ID from local storage
  if (user && loggedInUserId) { // Ensure both a logged-in user and valid ID are present
      console.log(user); // Debug: Log user object
      const docRef = doc(db, "tbl_users", loggedInUserId); // Reference to the Firestore document
      getDoc(docRef)
          .then((docSnap) => {
              if (docSnap.exists()) {
                  const userData = docSnap.data(); // Extract user data from Firestore
                  const isTeacher = userData.fld_isTeacher; // Determine user status
                  
                  // Update user information in the header
                  document.getElementById('loggedUserFName').innerText = userData.fld_firstName;
                  document.getElementById('loggedUserLName').innerText = userData.fld_lastName;
                  document.getElementById('stat').innerText = isTeacher ? "Instructor" : "Student";

                  // Update the user icon image based on the user type
                  const userIcon = document.getElementById('userIcon');
                  if (isTeacher) {
                      userIcon.src = "../assets/images/instructor.png";
                      userIcon.alt = "Instructor"; // Update the alt text for accessibility
                  } else {
                      userIcon.src = "../assets/images/profile.png"; // Default image for non-teachers
                      userIcon.alt = "Student";
                  }
              } else {
                  console.error("No document found matching the provided user ID.");
              }
          })
          .catch((error) => {
              console.error("Error fetching document:", error);
          });
  } else {
      console.log("No user authenticated or user ID missing in local storage.");
  }
});

  

// Handle profile button click using id="profButton"
const profileButton = document.getElementById('profButton');

profileButton.addEventListener('click', () => {
  const loggedInUserId = localStorage.getItem('loggedInUserId');
  if (loggedInUserId) {
      const docRef = doc(db, "tbl_users", loggedInUserId);
      getDoc(docRef)
      .then((docSnap) => {
          if (docSnap.exists()) {
                const userData = docSnap.data();
                const isTeacher = userData.fld_isTeacher; // Check if the user is a teacher
                if (isTeacher) {
                    window.location.href = 'dashboard-instructor.html'; // Redirect to instructor dashboard
                } else {
                    window.location.href = 'dashboard-student.html'; // Redirect to student dashboard
                }
          } else {
              console.log("No document found matching id");
          }
      })
      .catch((error) => {
          console.log("Error getting document:", error);
      })
  } else {
      console.log("User Id not Found in Local storage");
  }
});

// Handle logout functionality
const logoutButton = document.getElementById('logout');
logoutButton.addEventListener('click', () => {
  localStorage.removeItem('loggedInUserId');
  signOut(auth)
  .then(() => {
      window.location.href = '../index.html'; // Redirect to home page after sign-out
  })
  .catch((error) => {
      console.error('Error Signing out:', error);
  })
});
