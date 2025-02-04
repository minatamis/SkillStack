import { initializeApp } from "https://www.gstatic.com/firebasejs/11.0.1/firebase-app.js";
import { getFirestore, collection, addDoc, serverTimestamp } from "https://www.gstatic.com/firebasejs/11.0.1/firebase-firestore.js";

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

const addModuleBtn = document.getElementById("addLessonBtn");
const addQuizBtn = document.getElementById("addQuizBtn");
const popup = document.getElementById("popup");
const closePopup = document.getElementById("closePopup");
const createBtn = document.getElementById("createBtn");
const lessonTitleInput = document.getElementById("lessonTitle");
const languageSelect = document.getElementById("language");

addQuizBtn.addEventListener("click", () => {
    window.location.href = `create.html`;
});

addModuleBtn.addEventListener("click", () => {
    popup.style.display = "block";
});

closePopup.addEventListener("click", () => {
    popup.style.display = "none";
});

createBtn.addEventListener("click", async (e) => {
    e.preventDefault();

    const lessonTitle = lessonTitleInput.value.trim();
    const language = languageSelect.value;
    const userId = localStorage.getItem('loggedInUserId');

    if (!lessonTitle || !language) {
        swal({title:"Please fill out all fields.",icon:"warning"});
        return;
    }

    try {
        // Add a new document to the "tbl_lessons" collection
        const docRef = await addDoc(collection(db, "tbl_lessons"), {
            fld_lessonName: lessonTitle,
            fld_language: language,
            fld_userId: userId,
            fld_createdTime: serverTimestamp() // Use Firebase server timestamp
        });

        swal({title:"Lesson created successfully!",icon:"success"});

        // Redirect to addlesson.html with the document ID as a query parameter
        window.location.href = `addlesson.html?lessonId=${docRef.id}`;
    } catch (error) {
        console.error("Error creating lesson:", error);
        swal({text:"An error occurred while creating the lesson. Please try again.",icon:"error"});
    }
});
