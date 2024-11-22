import { initializeApp } from "https://www.gstatic.com/firebasejs/11.0.1/firebase-app.js";
import { getFirestore, doc, getDoc, collection, query, where, getDocs } from "https://www.gstatic.com/firebasejs/11.0.1/firebase-firestore.js";

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

const userId = localStorage.getItem('loggedInUserId');
if (userId) {
    getUserData(userId);
    getQuizScores(userId);
} else {
    console.error("User ID not found in localStorage.");
}

const currentDate = new Date();
const options = { year: 'numeric', month: 'long', day: 'numeric', weekday: 'long' };
const formattedDate = currentDate.toLocaleDateString('en-US', options);
document.getElementById('current-date').textContent = formattedDate;
