import { initializeApp } from "https://www.gstatic.com/firebasejs/11.0.1/firebase-app.js";
import { getFirestore, doc, getDoc, addDoc, collection, setDoc } from "https://www.gstatic.com/firebasejs/11.0.1/firebase-firestore.js";

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
const db = getFirestore(app);

let timerInterval;
let lessonId; // Variable to store `fld_lessonId` for redirection

// Timer function
// Timer function
function startTimer(duration, contentId) {
    let [minutes, seconds] = duration.split(":").map(Number);
    const timerElement = document.querySelector(".timer");

    timerInterval = setInterval(async () => {
        if (seconds === 0) {
            if (minutes === 0) {
                clearInterval(timerInterval);
                timerElement.textContent = "00:00";

                // Alert the user and save data
                alert("Time's up!");
                const editorContent = ace.edit("editor").getValue();

                try {
                    await saveCompactAnswer(editorContent, contentId, "00:00");
                    // Redirect after saving data
                    window.location.href = `lesson-contents.html?lessonId=${lessonId}`;
                } catch (error) {
                    console.error("Error saving data after timer:", error);
                }
                return;
            }
            minutes--;
            seconds = 59;
        } else {
            seconds--;
        }

        // Update the timer display
        timerElement.textContent = `${String(minutes).padStart(2, "0")}:${String(seconds).padStart(2, "0")}`;
    }, 1000);
}


// Fetch content from Firestore based on URL parameter
async function fetchContent() {
    try {
        const urlParams = new URLSearchParams(window.location.search);
        const contentId = urlParams.get("contentId");
        if (!contentId) {
            console.error("contentId is missing in the URL.");
            return;
        }

        const contentDocRef = doc(db, "tbl_lessonContents", contentId);
        const contentDoc = await getDoc(contentDocRef);

        if (!contentDoc.exists()) {
            console.error("No document found in tbl_lessonContents with the given contentId.");
            return;
        }

        const contentData = contentDoc.data();
        lessonId = contentData.fld_lessonId; // Save fld_lessonId for redirection

        const lessonDocRef = doc(db, "tbl_lessons", lessonId);
        const lessonDoc = await getDoc(lessonDocRef);

        if (!lessonDoc.exists()) {
            console.error("No document found in tbl_lessons with the given fld_lessonId.");
            return;
        }

        const lessonData = lessonDoc.data();

        document.querySelector("header h1").textContent = lessonData.fld_lessonName;
        document.querySelector(".activity-description h2").textContent = `Activity: ${contentData.fld_contentName}`;
        document.querySelector(".activity-description p").innerHTML = `<strong>Objective:</strong> ${contentData.fld_question}`;

        startTimer(contentData.fld_timer, contentId);
    } catch (error) {
        console.error("Error fetching content:", error);
    }
}

async function saveCompactAnswer(editorContent, contentId, remainingTime) {
    try {
        const userId = localStorage.getItem("loggedInUserId");
        if (!userId) {
            console.error("No user is logged in.");
            return;
        }

        const contentDocRef = doc(db, "tbl_lessonContents", contentId);
        const contentDoc = await getDoc(contentDocRef);

        if (!contentDoc.exists()) {
            console.error("No document found in tbl_lessonContents with the given contentId.");
            return;
        }

        const fldAnswer = contentDoc.data().fld_answer;
        const fldCheckStatus = editorContent.trim() === fldAnswer.trim();

        // Save answer to `tbl_compactAnswers`
        const compactAnswersRef = collection(db, "tbl_compactAnswers");
        const newAnswer = {
            fld_answer: editorContent,
            fld_contentId: contentId,
            fld_userId: userId,
            fld_remainingTime: remainingTime,
            fld_checkStatus: fldCheckStatus,
        };

        const docRef = await addDoc(compactAnswersRef, newAnswer);
        console.log("Document created in tbl_compactAnswers with ID:", docRef.id);

        // Create or update the progress document in `tbl_progress`
        const progressDocId = `${contentId}${userId}`;
        const progressData = {
            fld_userId: userId,
            fld_contentId: contentId,
            fld_lastUpdated: new Date().toISOString(),
        };

        await setDoc(doc(db, "tbl_progress", progressDocId), progressData)
            .then(() => {
                console.log(`Progress document created or updated with ID: ${progressDocId}`, progressData);
            })
            .catch((error) => {
                console.error(`Error writing progress document with ID: ${progressDocId}`, error);
            });

    } catch (error) {
        console.error("Error saving answer and progress:", error);
    }
}


// Attach event listener to Submit button
document.getElementById("submit").addEventListener("click", async () => {
    const editorContent = ace.edit("editor").getValue();
    const urlParams = new URLSearchParams(window.location.search);
    const contentId = urlParams.get("contentId");
    const remainingTime = document.querySelector(".timer").textContent;

    if (contentId) {
        await saveCompactAnswer(editorContent, contentId, remainingTime);
        clearInterval(timerInterval);
        window.location.href = `lesson-contents.html?lessonId=${lessonId}`;
    } else {
        console.error("Content ID is missing.");
    }
});

// Call the function to fetch and populate content
fetchContent();
