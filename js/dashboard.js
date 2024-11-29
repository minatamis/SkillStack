import { initializeApp } from "https://www.gstatic.com/firebasejs/11.0.1/firebase-app.js";
import { getFirestore, doc, getDoc, collection, query, where, getDocs, writeBatch } from "https://www.gstatic.com/firebasejs/11.0.1/firebase-firestore.js";

// Firebase configuration
const firebaseConfig = {
    apiKey: "AIzaSyBcp4pT_gjNkNJV8PU8T2Fx2ahBblFLMEs",
    authDomain: "skill-stack-df84c.firebaseapp.com",
    projectId: "skill-stack-df84c",
    storageBucket: "skill-stack-df84c.appspot.com",
    messagingSenderId: "208320005858",
    appId: "1:208320005858:web:ec4bf63c6da69c598680bb",
    measurementId: "G-WMJQPKF15X"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore();

async function getUserData(userId) {
    const userDocRef = doc(db, "tbl_users", userId);
    const userDocSnap = await getDoc(userDocRef);

    if (userDocSnap.exists()) {
        const userData = userDocSnap.data();
        document.getElementById('user-name').textContent = `${userData.fld_firstName} ${userData.fld_lastName}`;
        document.getElementById('user-email').textContent = userData.fld_email;
        document.getElementById('user-status').textContent = userData.fld_isTeacher ? "INSTRUCTOR" : "STUDENT";
        document.getElementById('loggedUserName').textContent = `${userData.fld_firstName} ${userData.fld_lastName}`;
    } else {
        console.error("No such user document!");
    }
}

async function getQuizScores(userId) {
    const scoresQuery = query(
        collection(db, "tbl_scores"),
        where("fld_userId", "==", userId)
    );

    try {
        const scoresQuerySnap = await getDocs(scoresQuery);
        const quizList = document.querySelector(".quiz-list");
        quizList.innerHTML = "";

        if (scoresQuerySnap.empty) {
            console.log("No quiz scores found for this user.");
            return;
        }

        scoresQuerySnap.forEach(doc => {
            const scoreData = doc.data();
            const score = scoreData.fld_score;
            const totalQuestions = scoreData.fld_totalQuestions;

            if (score != null && totalQuestions != null) {
                const percentage = (score / totalQuestions) * 100;

                const quizItem = document.createElement("li");
                quizItem.classList.add("quiz-item");

                const quizName = `Quiz ID: ${doc.id}`;
                const quizScore = `${Math.round(percentage)}%`;

                quizItem.innerHTML = `
                    <span class="quiz-name">${quizName}</span>
                    <span class="quiz-score">${quizScore}</span>
                `;
                quizList.appendChild(quizItem);
            } else {
                console.error(`Missing score or totalQuestions for document: ${doc.id}`);
            }
        });
    } catch (error) {
        console.error("Error fetching quiz scores:", error);
    }
}

async function getExercises(userId) {
    const exercisesQuery = query(
        collection(db, "tbl_exercises"),
        where("fld_userId", "==", userId)
    );

    try {
        const exercisesQuerySnap = await getDocs(exercisesQuery);
        const listContainer = document.querySelector(".list");
        listContainer.innerHTML = "";

        if (exercisesQuerySnap.empty) {
            listContainer.innerHTML = "<p>No exercises found.</p>";
            return;
        }

        exercisesQuerySnap.forEach(doc => {
            const exerciseData = doc.data();
            const title = exerciseData.fld_title;
            const exerciseId = doc.id;
        
            if (title) {
                const quizItem = document.createElement("div");
                quizItem.classList.add("quiz-item");
        
                quizItem.innerHTML = `
                    <a href="#">
                        <img src="../assets/images/quiz dashboard.png" alt="Quiz">
                        <span class="quiz-name">${title}</span>
                    </a>
                    <span class="dots">...</span>
                    <div class="options">
                        <button class="edit" id="edit-${exerciseId}">Edit</button>
                        <button class="delete" id="delete-${exerciseId}">Delete</button>
                        <button class="view-scores" id="view-scores-${exerciseId}">View Scores</button>
                    </div>
                `;
        
                listContainer.appendChild(quizItem);

                const editBtn = quizItem.querySelector(`#edit-${exerciseId}`);
                editBtn.addEventListener("click", function () {
                    window.location.href = `edit.html?exerciseId=${exerciseId}`;
                });
        
                const deleteBtn = quizItem.querySelector(`#delete-${exerciseId}`);
                deleteBtn.addEventListener("click", function() {
                    deleteExercise(exerciseId, quizItem);
                });

                const viewScoresBtn = quizItem.querySelector(`#view-scores-${exerciseId}`);
                viewScoresBtn.addEventListener("click", function () {
                    window.location.href = `score-list.html?exerciseId=${exerciseId}`;
                });

            } else {
                console.error(`Missing title for document: ${doc.id}`);
            }
        });

        attachDotsListeners();
    } catch (error) {
        console.error("Error fetching exercises:", error);
    }
}

async function deleteExercise(exerciseId, exerciseDiv) {
    const exerciseRef = doc(db, "tbl_exercises", exerciseId);
    const questionsQuery = query(
        collection(db, "tbl_questions"),
        where("fld_exerciseId", "==", exerciseId)
    );

    const batch = writeBatch(db); // Firebase batch to handle multiple writes

    try {
        // Delete the related questions first
        const questionsSnapshot = await getDocs(questionsQuery);
        questionsSnapshot.forEach((questionDoc) => {
            const questionRef = doc(db, "tbl_questions", questionDoc.id);
            batch.delete(questionRef); // Add delete operation to the batch
        });

        // Delete the exercise document
        batch.delete(exerciseRef);

        // Commit the batch
        await batch.commit();

        // Remove the corresponding div from the DOM
        if (exerciseDiv && exerciseDiv.parentElement) {
            exerciseDiv.remove(); // Directly remove the element
        }
        
        console.log(`Exercise with ID: ${exerciseId} and its related questions deleted successfully.`);
    } catch (error) {
        console.error("Error deleting exercise and related questions: ", error);
    }
}

const userId = localStorage.getItem('loggedInUserId');
if (userId) {
    getUserData(userId);
    getQuizScores(userId);
    getExercises(userId);
} else {
    console.error("User ID not found in localStorage.");
}

const currentDate = new Date();
const options = { year: 'numeric', month: 'long', day: 'numeric', weekday: 'long' };
const formattedDate = currentDate.toLocaleDateString('en-US', options);
document.getElementById('current-date').textContent = formattedDate;

// Define the function
function attachDotsListeners() {
    const dots = document.querySelectorAll(".dots");

    dots.forEach(dot => {
        dot.addEventListener("click", function () {
            const options = this.nextElementSibling;

            // Toggle the visibility of the options
            options.style.display = options.style.display === "block" ? "none" : "block";

            // Close other open menus
            dots.forEach(otherDot => {
                if (otherDot !== dot) {
                    const otherOptions = otherDot.nextElementSibling;
                    otherOptions.style.display = "none";
                }
            });
        });
    });

    // Close the menu if clicked outside
    document.addEventListener("click", function (e) {
        dots.forEach(dot => {
            const options = dot.nextElementSibling;
            if (!dot.contains(e.target) && !options.contains(e.target)) {
                options.style.display = "none";
            }
        });
    });
}

// Call the function after DOM is ready
document.addEventListener("DOMContentLoaded", function () {
    attachDotsListeners();
});