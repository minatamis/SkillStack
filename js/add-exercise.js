import { initializeApp } from "https://www.gstatic.com/firebasejs/11.0.1/firebase-app.js";
import { getFirestore, addDoc, collection } from "https://www.gstatic.com/firebasejs/11.0.1/firebase-firestore.js";
import { getAuth, onAuthStateChanged } from "https://www.gstatic.com/firebasejs/11.0.1/firebase-auth.js";


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
const auth = getAuth(app);

let currentUserId = null;

onAuthStateChanged(auth, (user) => {
    if (user) {
        currentUserId = user.uid;
    } else {
        console.error("User is not logged in!");
        window.location.href = 'login.html';
    }
});

document.addEventListener('DOMContentLoaded', function () {
    let questionCounter = 0;

    const saveButton = document.getElementById('saveButton');
    const addQuestionButton = document.getElementById('add-question-button');
    const questionSection = document.getElementById('question-section');

    // Function to add new question
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

    // Add event listener to "Add New Question" button
    addQuestionButton.addEventListener('click', function (e) {
        e.preventDefault();
        addNewQuestion();
    });

    // Save button event listener
    saveButton.addEventListener('click', async (event) => {
        event.preventDefault();

        const language = document.getElementById('language').value;
        const title = document.querySelector('.text1').value;
        const instruction = document.querySelector('.text2').value;

        // Prepare quiz data
        const quizData = {
            fld_language: language,
            fld_title: title,
            fld_instruction: instruction,
            fld_userId: currentUserId,
            fld_createdAt: new Date().toISOString()
        };

        try {
            const docRef = await addDoc(collection(db, "tbl_exercises"), quizData);
            console.log("Quiz added successfully with ID:", docRef.id);

            const questions = [];
            for (let i = 1; i <= questionCounter; i++) {
                const questionText = document.getElementById(`questionText${i}`)?.value;
                const answer = document.getElementById(`answer${i}`)?.value;
                const hint = document.getElementById(`hint${i}`)?.value;

                // Only add questions that have all fields filled
                if (questionText && answer && hint) {
                    questions.push({
                        fld_question: questionText,
                        fld_answer: answer,
                        fld_hint: hint,
                        fld_exerciseId: docRef.id,
                    });
                }
            }

            const questionPromises = questions.map((question) =>
                addDoc(collection(db, "tbl_questions"), question)
            );
            await Promise.all(questionPromises);

            console.log("All questions added successfully!");
            window.location.href = 'home.html';
        } catch (error) {
            console.error("Error adding quiz or questions:", error);
        }
    });
});

