import { initializeApp } from "https://www.gstatic.com/firebasejs/11.0.1/firebase-app.js";
import { getFirestore, collection, query, where, getDocs, doc, getDoc } from "https://www.gstatic.com/firebasejs/11.0.1/firebase-firestore.js";

// Firebase initialization
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

// Fetch scores by exercise ID and populate the table
async function fetchScoresByExerciseId(exerciseId) {
    const tblScoresRef = collection(db, "tbl_scores");
    const q = query(tblScoresRef, where("fld_exerciseId", "==", exerciseId));

    try {
        const querySnapshot = await getDocs(q);

        const tableBody = document.querySelector("table tbody");
        tableBody.innerHTML = ""; // Clear table content before appending new rows

        if (querySnapshot.empty) {
            console.log("No scores found for this exercise.");
            tableBody.innerHTML = `<tr><td colspan="3">No scores available</td></tr>`;
            return;
        }

        for (const docSnap of querySnapshot.docs) {
            const data = docSnap.data();
            const userId = data.fld_userId;

            // Fetch user details
            const userDocRef = doc(db, "tbl_users", userId);
            const userDocSnap = await getDoc(userDocRef);

            const userName = userDocSnap.exists()
                ? `${userDocSnap.data().fld_firstName} ${userDocSnap.data().fld_lastName}`
                : "Unknown User";

            const timeAnswered = new Date(data.fld_answeredAt.seconds * 1000).toLocaleString();
            const score = data.fld_score;

            // Append row to the table
            const row = document.createElement("tr");
            row.innerHTML = `
                <td>${userName}</td>
                <td>${timeAnswered}</td>
                <td>${score}</td>
            `;
            tableBody.appendChild(row);
        }
    } catch (error) {
        console.error("Error fetching scores:", error);
    }
}

// Get exercise ID from the URL
const urlParams = new URLSearchParams(window.location.search);
const exerciseId = urlParams.get("exerciseId");

if (exerciseId) {
    fetchScoresByExerciseId(exerciseId);
} else {
    console.error("No exercise ID found in the URL.");
}
