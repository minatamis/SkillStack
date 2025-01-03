import { initializeApp } from "https://www.gstatic.com/firebasejs/11.0.1/firebase-app.js";
import { getFirestore, collection, query, where, getDocs, doc, getDoc } from "https://www.gstatic.com/firebasejs/11.0.1/firebase-firestore.js";

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
const db = getFirestore(app);

async function fetchAndDisplayExerciseTitle(exerciseId) {
    try {
        const exerciseDocRef = doc(db, "tbl_exercises", exerciseId);
        const exerciseDocSnap = await getDoc(exerciseDocRef);

        if (exerciseDocSnap.exists()) {
            const exerciseData = exerciseDocSnap.data();
            const title = exerciseData.fld_title;

            const quizTitleElement = document.getElementById("quiz-ttl");
            quizTitleElement.textContent = title;
        } else {
            console.error("No exercise found for this ID.");
        }
    } catch (error) {
        console.error("Error fetching exercise title:", error);
    }
}

async function fetchScoresByExerciseId(exerciseId) {
    const tblScoresRef = collection(db, "tbl_scores");
    const q = query(tblScoresRef, where("fld_exerciseId", "==", exerciseId));
    const scoresData = [];

    try {
        const querySnapshot = await getDocs(q);

        if (querySnapshot.empty) {
            console.log("No scores found for this exercise.");
            return scoresData;
        }

        for (const docSnap of querySnapshot.docs) {
            const data = docSnap.data();
            const userId = data.fld_userId;

            const userDocRef = doc(db, "tbl_users", userId);
            const userDocSnap = await getDoc(userDocRef);

            const userName = userDocSnap.exists()
                ? `${userDocSnap.data().fld_firstName} ${userDocSnap.data().fld_lastName}`
                : "Unknown User";

            const timeAnswered = new Date(data.fld_answeredAt.seconds * 1000);
            const score = data.fld_score;
            const totalQuestions = data.fld_totalQuestions;
            const percentage = totalQuestions ? Math.round((score / totalQuestions) * 100) : 0;

            scoresData.push({
                userName,
                timeAnswered,
                percentage
            });
        }

        scoresData.sort((a, b) => b.timeAnswered - a.timeAnswered);

    } catch (error) {
        console.error("Error fetching scores:", error);
    }

    return scoresData;
}

function renderScoresTable(scoresData) {
    const tableBody = document.querySelector("table tbody");
    tableBody.innerHTML = "";

    if (scoresData.length === 0) {
        tableBody.innerHTML = `<tr><td colspan="3">No scores available</td></tr>`;
        return;
    }

    scoresData.forEach((scoreData) => {
        const row = document.createElement("tr");

        row.innerHTML = `
            <td>${scoreData.userName}</td>
            <td>${scoreData.timeAnswered.toLocaleString()}</td>
            <td class="quiz-score">${scoreData.percentage}%</td>
        `;

        const scoreCell = row.querySelector(".quiz-score");
        scoreCell.style.color = scoreData.percentage < 75 ? "red" : "green";

        tableBody.appendChild(row);
    });
}

async function displayScores() {
    const urlParams = new URLSearchParams(window.location.search);
    const exerciseId = urlParams.get("exerciseId");

    if (exerciseId) {
        await fetchAndDisplayExerciseTitle(exerciseId);

        const scoresData = await fetchScoresByExerciseId(exerciseId);
        renderScoresTable(scoresData);
    } else {
        console.error("No exercise ID found in the URL.");
    }
}

displayScores();

document.getElementById("search-btn").addEventListener("click", () => {
    const searchValue = document.getElementById("search-input").value.toLowerCase();
    const rows = document.querySelectorAll("table tbody tr");

    rows.forEach(row => {
        const studentName = row.querySelector("td:first-child").textContent.toLowerCase();
        if (studentName.includes(searchValue)) {
            row.style.display = "";
        } else {
            row.style.display = "none";
        }
    });
});
