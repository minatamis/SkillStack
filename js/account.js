import { initializeApp } from "https://www.gstatic.com/firebasejs/11.0.1/firebase-app.js";
import { getAuth, onAuthStateChanged, signOut } from "https://www.gstatic.com/firebasejs/11.0.1/firebase-auth.js";
import { getFirestore, getDoc, doc } from "https://www.gstatic.com/firebasejs/11.0.1/firebase-firestore.js";

document.addEventListener("DOMContentLoaded", () => {
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

    // Select loading container after DOM is fully loaded
    const loadingContainer = document.getElementById('loadingContainer');

    function showLoading() {
        if (loadingContainer) loadingContainer.style.display = 'flex';
    }

    function hideLoading() {
        if (loadingContainer) loadingContainer.style.display = 'none';
    }

    showLoading(); // Show loading initially

    onAuthStateChanged(auth, (user) => {
        const loggedInUserId = localStorage.getItem('loggedInUserId');
        if (user && loggedInUserId) {
            console.log(user);
            const docRef = doc(db, "tbl_users", loggedInUserId);
            getDoc(docRef)
                .then((docSnap) => {
                    if (docSnap.exists()) {
                        const userData = docSnap.data();
                        const isTeacher = userData.fld_isTeacher;

                        document.getElementById('loggedUserFName').innerText = userData.fld_firstName;
                        document.getElementById('loggedUserLName').innerText = userData.fld_lastName;
                        document.getElementById('stat').innerText = isTeacher ? "Instructor" : "Student";

                        const userIcon = document.getElementById('userIcon');
                        userIcon.src = isTeacher ? "../assets/images/instructor.png" : "../assets/images/profile.png";
                        userIcon.alt = isTeacher ? "Instructor" : "Student";

                        hideLoading(); // Hide loading animation once data is loaded
                    } else {
                        console.error("No document found matching the provided user ID.");
                        hideLoading();
                    }
                })
                .catch((error) => {
                    console.error("Error fetching document:", error);
                    hideLoading();
                });
        } else {
            console.log("No user authenticated or user ID missing in local storage.");
            hideLoading();
        }
    });

    // Handle profile button click
    const profileButton = document.getElementById('profButton');
    if (profileButton) {
        profileButton.addEventListener('click', () => {
            showLoading();
            const loggedInUserId = localStorage.getItem('loggedInUserId');
            if (loggedInUserId) {
                const docRef = doc(db, "tbl_users", loggedInUserId);
                getDoc(docRef)
                    .then((docSnap) => {
                        if (docSnap.exists()) {
                            const userData = docSnap.data();
                            const isTeacher = userData.fld_isTeacher;
                            window.location.href = isTeacher ? 'dashboard-instructor.html' : 'dashboard-student.html';
                        } else {
                            console.log("No document found matching ID");
                        }
                        hideLoading();
                    })
                    .catch((error) => {
                        console.log("Error getting document:", error);
                        hideLoading();
                    });
            } else {
                console.log("User ID not found in local storage");
                hideLoading();
            }
        });
    }

    // Handle logout functionality
    const logoutButton = document.getElementById('logout');
    if (logoutButton) {
        logoutButton.addEventListener('click', () => {
            showLoading();
            localStorage.removeItem('loggedInUserId');
            signOut(auth)
                .then(() => {
                    window.location.href = '../index.html';
                })
                .catch((error) => {
                    console.error('Error Signing out:', error);
                })
                .finally(() => {
                    hideLoading();
                });
        });
    }
});
