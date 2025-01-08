import { initializeApp } from "https://www.gstatic.com/firebasejs/11.0.1/firebase-app.js";
import { getFirestore, collection, addDoc } from "https://www.gstatic.com/firebasejs/11.0.1/firebase-firestore.js";

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

// Extract lessonId from the URL
const urlParams = new URLSearchParams(window.location.search);
const lessonId = urlParams.get("lessonId");

// Save activity function
async function saveActivity(event) {
    event.preventDefault(); // Prevent form submission

    // Get form values
    const contentName = document.getElementById("activity-title").value;
    const question = document.getElementById("instruction").value;
    const timer = `${document.getElementById("minutes").value}:${document.getElementById("seconds").value}`;
    const answer = editor.getValue(); // Get value from Ace editor

    try {
        // Add new document to tbl_lessonContents
        const docRef = await addDoc(collection(db, "tbl_lessonContents"), {
            fld_contentName: contentName,
            fld_question: question,
            fld_timer: timer,
            fld_answer: answer,
            fld_lessonId: lessonId,
            fld_contentType: "Coding"
        });
        console.log("Document written with ID: ", docRef.id);
        window.location.href = `addlesson.html?lessonId=${lessonId}`;
    } catch (e) {
        console.error("Error adding document: ", e);
    }
}

// Attach event listener to the form
const form = document.querySelector("form");
form.addEventListener("submit", saveActivity);