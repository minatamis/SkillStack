import { initializeApp } from "https://www.gstatic.com/firebasejs/11.0.1/firebase-app.js";
import { getFirestore, doc, getDoc, collection, query, where, getDocs, updateDoc, setDoc } from "https://www.gstatic.com/firebasejs/11.0.1/firebase-firestore.js";

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
const totalQuestionsInput = document.getElementById("questionCountStore");
const questionSection = document.getElementById("question-section");
const saveButton = document.getElementById("saveButton");

// Function to update the "Total Questions to be Asked" input
function updateTotalQuestionsInput() {
    totalQuestionsInput.value = questionCountStore;
}

// Function to add a new question
function addNewQuestion(questionData = null) {
    questionCounter++;
    questionCountStore++;
    updateTotalQuestionsInput();

    const newQuestionDiv = document.createElement("div");
    newQuestionDiv.classList.add("question-section");
    newQuestionDiv.innerHTML = `
        <h2>Question ${questionCounter}</h2>
        <div class="question-container">
            <input type="text" id="questionText${questionCounter}" value="${questionData?.fld_question || ""}" placeholder="Write a Question..." />
            <input type="text" id="answer${questionCounter}" value="${questionData?.fld_answer || ""}" placeholder="Answer" />
            <input type="text" id="hint${questionCounter}" value="${questionData?.fld_hint || ""}" placeholder="Hint" />
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

// Function to load quiz data
async function loadQuizData(exerciseId) {
    try {
        const exerciseDocRef = doc(db, "tbl_exercises", exerciseId);
        const exerciseDocSnap = await getDoc(exerciseDocRef);

        if (!exerciseDocSnap.exists()) {
            console.error("Quiz not found!");
            return;
        }

        const exerciseData = exerciseDocSnap.data();
        document.getElementById("language").value = exerciseData.fld_language;
        document.querySelector(".text1").value = exerciseData.fld_title;
        document.querySelector(".text2").value = exerciseData.fld_instruction;

        questionCountStore = exerciseData.fld_questionCountStore || 0; // Load `questionCountStore`
        updateTotalQuestionsInput();

        const questionsQuery = query(
            collection(db, "tbl_questions"),
            where("fld_exerciseId", "==", exerciseId)
        );

        const questionsSnap = await getDocs(questionsQuery);
        questionSection.innerHTML = "";

        questionCounter = 0; // Reset question counter
        questionsSnap.forEach((questionDoc) => {
            questionCounter++;
            addNewQuestion(questionDoc.data());
        });
    } catch (error) {
        console.error("Error loading quiz data:", error);
    }
}

// Function to update quiz data
async function updateQuizData(exerciseId) {
    try {
        const exerciseDocRef = doc(db, "tbl_exercises", exerciseId);

        const updatedData = {
            fld_language: document.getElementById("language").value,
            fld_title: document.querySelector(".text1").value.trim(),
            fld_instruction: document.querySelector(".text2").value.trim(),
            fld_questionCountStore: questionCountStore, // Save `questionCountStore`
        };

        // Update exercise data
        await updateDoc(exerciseDocRef, updatedData);

        const questions = document.querySelectorAll(".question-section");
        for (let i = 0; i < questions.length; i++) {
            const questionText = questions[i].querySelector(`#questionText${i + 1}`).value.trim();
            const answer = questions[i].querySelector(`#answer${i + 1}`).value.trim();
            const hint = questions[i].querySelector(`#hint${i + 1}`).value.trim();

            if (questionText && answer && hint) {
                const questionDocRef = doc(
                    db,
                    "tbl_questions",
                    `${exerciseId}-${i + 1}`
                ); // Generate question ID using exerciseId
                await setDoc(questionDocRef, {
                    fld_exerciseId: exerciseId,
                    fld_question: questionText,
                    fld_answer: answer,
                    fld_hint: hint,
                });
            }
        }

        console.log("Quiz updated successfully!");
        window.location.href = "dashboard-instructor.html";
    } catch (error) {
        console.error("Error updating quiz data:", error);
    }
}

// Event listener for "Total Questions to be Asked" input
totalQuestionsInput.addEventListener("input", function () {
    const newValue = parseInt(totalQuestionsInput.value, 10);

    if (isNaN(newValue) || newValue < 0) {
        totalQuestionsInput.value = questionCountStore; // Revert to the previous value
    } else if (newValue > questionCounter) {
        totalQuestionsInput.value = questionCounter; // Prevent going above questionCounter
    } else {
        questionCountStore = newValue; // Update `questionCountStore`
    }
});

// Load quiz data and attach event listener for save button
const urlParams = new URLSearchParams(window.location.search);
const exerciseId = urlParams.get("exerciseId");

if (exerciseId) {
    loadQuizData(exerciseId);

    saveButton.addEventListener("click", function (e) {
        e.preventDefault();
        updateQuizData(exerciseId);
    });
} else {
    console.error("No exercise ID provided in the URL!");
}
