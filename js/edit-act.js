import { initializeApp } from "https://www.gstatic.com/firebasejs/11.0.1/firebase-app.js";
import { getFirestore, doc, getDoc, updateDoc, collection, query, where, getDocs } from "https://www.gstatic.com/firebasejs/11.0.1/firebase-firestore.js";

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
const db = getFirestore(app);

// Extract contentId and lessonId from the URL
const urlParams = new URLSearchParams(window.location.search);
const contentId = urlParams.get("contentId");
const lessonId = urlParams.get("lessonId");

// Load existing data for activity
async function loadActivity() {
    if (!contentId) {
        console.error("No contentId found in the URL");
        return;
    }

    try {
        // Fetch document from tbl_lessonContents
        const docRef = doc(db, "tbl_lessonContents", contentId);
        const docSnap = await getDoc(docRef);

        if (docSnap.exists()) {
            const data = docSnap.data();

            // Pre-fill form inputs with data from Firestore
            document.getElementById("activity-title").value = data.fld_contentName || "";
            document.getElementById("instruction").value = data.fld_question || "";
            const [minutes, seconds] = (data.fld_timer || "0:0").split(":");
            document.getElementById("minutes").value = minutes || "0";
            document.getElementById("seconds").value = seconds || "0";
            editor.setValue(data.fld_answer || "");
        } else {
            console.error("No document found with ID:", contentId);
            alert("Activity not found.");
        }
    } catch (e) {
        console.error("Error fetching document: ", e);
        alert("Failed to load activity.");
    }
}

// Save updated activity
async function saveActivity(event) {
    event.preventDefault(); // Prevent form submission

    // Get updated form values
    const contentName = document.getElementById("activity-title").value;
    const question = document.getElementById("instruction").value;
    const timer = `${document.getElementById("minutes").value}:${document.getElementById("seconds").value}`;
    const answer = editor.getValue(); // Get value from Ace editor

    try {
        // Update the document in tbl_lessonContents
        const docRef = doc(db, "tbl_lessonContents", contentId);
        await updateDoc(docRef, {
            fld_contentName: contentName,
            fld_question: question,
            fld_timer: timer,
            fld_answer: answer,
            fld_lessonId: lessonId, // Keep the same lessonId
            fld_contentType: "Coding" // Ensure content type is consistent
        });

        console.log("Document updated with ID: ", contentId);
        alert("Activity updated successfully!");
    } catch (e) {
        console.error("Error updating document: ", e);
        alert("Failed to update activity.");
    }
}

// Load answers and populate the table
async function loadAnswers() {
    if (!contentId) {
        console.error("No contentId found in the URL");
        return;
    }

    try {
        const answersTableBody = document.querySelector("table tbody");

        // Fetch answers from tbl_compactAnswers
        const compactAnswersRef = collection(db, "tbl_compactAnswers");
        const q = query(compactAnswersRef, where("fld_contentId", "==", contentId));
        const querySnapshot = await getDocs(q);

        for (const answerDoc of querySnapshot.docs) {
            const answerData = answerDoc.data();

            // Fetch student name from tbl_users
            const userRef = doc(db, "tbl_users", answerData.fld_userId);
            const userSnap = await getDoc(userRef);

            const studentName = userSnap.exists()
                ? `${userSnap.data().fld_firstName || ""} ${userSnap.data().fld_lastName || ""}`
                : "Unknown";

            // Create table row
            const row = document.createElement("tr");

            row.innerHTML = `
                <td>${studentName}</td>
                <td>${answerData.fld_answer || ""}</td>
                <td>${answerData.fld_remainingTime || "0:0"}</td>
                <td>${answerData.fld_checkStatus ? "Correct" : "Incorrect"}</td>
            `;

            answersTableBody.appendChild(row);
        }
    } catch (e) {
        console.error("Error fetching answers: ", e);
        alert("Failed to load answers.");
    }
}

// Attach event listener to the form
const form = document.querySelector("form");
form.addEventListener("submit", saveActivity);

// Load activity and answers on page load
loadActivity();
loadAnswers();
