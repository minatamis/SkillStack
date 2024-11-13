import { initializeApp } from "https://www.gstatic.com/firebasejs/11.0.1/firebase-app.js";
import { getFirestore, addDoc, collection } from "https://www.gstatic.com/firebasejs/11.0.1/firebase-firestore.js";

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

const saveButton = document.getElementById('saveButton');
saveButton.addEventListener('click', async (event) => {
    event.preventDefault();

    const language = document.getElementById('language').value;
    const title = document.getElementById('qTitle').value;
    const instruction = document.getElementById('qInstruction').value;

    const quizData = {
        fld_language: language,
        fld_title: title,
        fld_instruction: instruction,
        fld_createdAt: new Date().toISOString()
    };

    try {
        const docRef = await addDoc(collection(db, "tbl_quizzes"), quizData);
        console.log("Quiz added successfully with ID:", docRef.id);
        window.location.href = 'index.html';
    } catch (error) {
        console.error("Error adding quiz:", error);
    }
});
