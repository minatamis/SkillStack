import { initializeApp } from "https://www.gstatic.com/firebasejs/11.0.1/firebase-app.js";
import { getFirestore, doc, getDoc, collection, query, where, getDocs } from "https://www.gstatic.com/firebasejs/11.0.1/firebase-firestore.js";

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

let questionCounter = 0;

async function loadQuizData(exerciseId) {
    try {
        // Fetch the quiz details
        const exerciseDocRef = doc(db, "tbl_exercises", exerciseId);
        const exerciseDocSnap = await getDoc(exerciseDocRef);

        if (!exerciseDocSnap.exists()) {
            console.error("Quiz not found!");
            return;
        }

        const exerciseData = exerciseDocSnap.data();
        document.getElementById('language').value = exerciseData.fld_language;
        document.querySelector('.text1').value = exerciseData.fld_title;
        document.querySelector('.text2').value = exerciseData.fld_instruction;

        // Fetch the related questions
        const questionsQuery = query(
            collection(db, "tbl_questions"),
            where("fld_exerciseId", "==", exerciseId)
        );

        const questionsSnap = await getDocs(questionsQuery);
        const questionSection = document.getElementById('question-section');
        questionSection.innerHTML = ""; // Clear existing questions

        questionsSnap.forEach((questionDoc) => {
            questionCounter++;
            const questionData = questionDoc.data();

            const newQuestionDiv = document.createElement('div');
            newQuestionDiv.classList.add('question-section');
            newQuestionDiv.innerHTML = `
                <h2>Question ${questionCounter}</h2>
                <div class="question-container">
                    <input type="text" id="questionText${questionCounter}" value="${questionData.fld_question}" placeholder="Write a Question..." />
                    <input type="text" id="answer${questionCounter}" value="${questionData.fld_answer}" placeholder="Answer" />
                    <input type="text" id="hint${questionCounter}" value="${questionData.fld_hint}" placeholder="Hint" />
                    <button class="delete-button">Delete Question</button>
                </div>
            `;

            // Add delete functionality
            const deleteButton = newQuestionDiv.querySelector('.delete-button');
            deleteButton.addEventListener('click', function () {
                questionCounter--;
                newQuestionDiv.remove();
            });

            questionSection.appendChild(newQuestionDiv);
        });
    } catch (error) {
        console.error("Error loading quiz data:", error);
    }
}

// Fetch `exerciseId` from the URL
const urlParams = new URLSearchParams(window.location.search);
const exerciseId = urlParams.get('exerciseId');

if (exerciseId) {
    loadQuizData(exerciseId);
} else {
    console.error("No exercise ID provided in the URL!");
}

// Add new question functionality
const addQuestionButton = document.getElementById('add-question-button');
const questionSection = document.getElementById('question-section');

function addNewQuestion() {
    questionCounter++;

    const newQuestionDiv = document.createElement('div');
    newQuestionDiv.classList.add('question-section');
    newQuestionDiv.innerHTML = `
        <h2>Question ${questionCounter}</h2>
        <div class="question-container">
            <input type="text" id="questionText${questionCounter}" placeholder="Write a Question..." />
            <input type="text" id="answer${questionCounter}" placeholder="Answer" />
            <input type="text" id="hint${questionCounter}" placeholder="Hint" />
            <button class="delete-button">Delete Question</button>
        </div>
    `;

    // Add delete functionality
    const deleteButton = newQuestionDiv.querySelector('.delete-button');
    deleteButton.addEventListener('click', function () {
        questionCounter--;
        newQuestionDiv.remove();
    });

    questionSection.appendChild(newQuestionDiv);
}

addQuestionButton.addEventListener('click', function (e) {
    e.preventDefault();
    addNewQuestion();
});
