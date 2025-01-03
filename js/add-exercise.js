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

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

let questionCounter = 0; // Tracks the number of created questions
let questionCountStore = 0; // User-controlled variable for "Total Questions to be Asked"

// Elements
const addQuestionButton = document.getElementById("add-question-button");
const questionSection = document.getElementById("question-section");
const totalQuestionsInput = document.getElementById("questionCountStore");

// Get lessonId from URL
const urlParams = new URLSearchParams(window.location.search);
const lessonId = urlParams.get("lessonId");

// Function to update the "Total Questions to be Asked" input
function updateTotalQuestionsInput() {
    totalQuestionsInput.value = questionCountStore;
}

// Function to add a new question
function addNewQuestion() {
    questionCounter++;
    questionCountStore++;
    updateTotalQuestionsInput();

    const newQuestionDiv = document.createElement("div");
    newQuestionDiv.classList.add("question-section");
    newQuestionDiv.innerHTML = `
        <h2>Question ${questionCounter}</h2>
        <div class="question-container">
            <input type="text" id="hint${questionCounter}" placeholder="Write a Question..." />
            <input type="text" id="answer${questionCounter}" placeholder="Answer" />
            <input type="text" id="questionText${questionCounter}" placeholder="Hint" />
            <button class="delete-button">Delete Question</button>
        </div>
    `;

    const deleteButton = newQuestionDiv.querySelector(".delete-button");
    deleteButton.addEventListener("click", function () {
        newQuestionDiv.remove();
        questionCounter--;
        questionCountStore--;
        updateTotalQuestionsInput();
    });

    questionSection.appendChild(newQuestionDiv);
}

// Event listener for "Add New Question" button
addQuestionButton.addEventListener("click", function (e) {
    e.preventDefault();
    addNewQuestion();
});

// Event listener for "Total Questions to be Asked" input
totalQuestionsInput.addEventListener("input", function () {
    const newValue = parseInt(totalQuestionsInput.value, 10);

    if (isNaN(newValue) || newValue < 0) {
        totalQuestionsInput.value = questionCountStore; // Revert to the previous value
    } else if (newValue > questionCounter) {
        totalQuestionsInput.value = questionCounter; // Prevent going above questionCounter
    } else {
        questionCountStore = newValue; // Update questionCountStore
    }
});

// Event listener for "Save" button
const saveButton = document.getElementById("saveButton");
saveButton.addEventListener("click", async function (e) {
    e.preventDefault();

    const language = document.getElementById("language").value;
    const title = document.querySelector(".text1").value.trim();
    const instructions = document.querySelector(".text2").value.trim();
    const userId = localStorage.getItem("loggedInUserId");

    if (!userId) {
        alert("User not logged in!");
        return;
    }

    if (!title || !instructions) {
        alert("Title and instructions are required!");
        return;
    }

    try {
        const exerciseRef = await addDoc(collection(db, "tbl_exercises"), {
            fld_language: language,
            fld_title: title,
            fld_instruction: instructions,
            fld_questionCountStore: questionCountStore,
            fld_userId: userId,
            fld_createdAt: new Date().toISOString(),
        });

        const exerciseId = exerciseRef.id;

        // Save questions
        const questions = document.querySelectorAll(".question-section");
        for (let i = 0; i < questions.length; i++) {
            const questionText = questions[i].querySelector(`#questionText${i + 1}`).value.trim();
            const answer = questions[i].querySelector(`#answer${i + 1}`).value.trim();
            const hint = questions[i].querySelector(`#hint${i + 1}`).value.trim();

            if (questionText && answer && hint) {
                await addDoc(collection(db, "tbl_questions"), {
                    fld_exerciseId: exerciseId,
                    fld_question: questionText,
                    fld_answer: answer,
                    fld_hint: hint,
                });
            }
        }

        // If lessonId is present in URL, add to tbl_lessonContents
        if (lessonId) {
            await addDoc(collection(db, "tbl_lessonContents"), {
                fld_contentName: title,
                fld_contentType: "Quiz",
                fld_lessonId: lessonId,
                fld_exerciseId: exerciseId,
            });

            // Redirect to addlesson.html with lessonId
            window.location.href = `addlesson.html?lessonId=${lessonId}`;
        } else {
            // Redirect to dashboard-instructor.html
            window.location.href = "dashboard-instructor.html";
        }
    } catch (error) {
        console.error("Error saving exercise:", error);
        alert("Failed to save exercise. Please try again.");
    }
});

// Initialize "Total Questions to be Asked" input
updateTotalQuestionsInput();
