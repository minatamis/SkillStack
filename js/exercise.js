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

const exerciseId = '2MTxA4KjNmgrUJ1tHnoU'; // Use the given exercise ID

// Fetch the quiz data
async function fetchExerciseData() {
    try {
        // Fetch the exercise document
        const exerciseDocRef = doc(db, "tbl_exercises", exerciseId);
        const exerciseDoc = await getDoc(exerciseDocRef);
        
        if (exerciseDoc.exists()) {
            const exerciseData = exerciseDoc.data();

            // Set title and instruction
            document.getElementById("quiz-title").textContent = exerciseData.fld_title;
            document.getElementById("Instruction").textContent = exerciseData.fld_instruction;

            // Fetch associated questions
            await fetchQuestions(exerciseData.fld_title); // Pass title for display
        } else {
            console.log("No such exercise found!");
        }
    } catch (error) {
        console.error("Error fetching exercise data:", error);
    }
}

// Fetch questions related to the exercise
async function fetchQuestions(exerciseTitle) {
    try {
        const questionsQuery = query(collection(db, "tbl_questions"), where("fld_exerciseId", "==", exerciseId));
        const querySnapshot = await getDocs(questionsQuery);

        let questionCounter = 0;

        querySnapshot.forEach((doc) => {
            const questionData = doc.data();
            questionCounter++;

            // Create question elements dynamically
            const questionSection = document.getElementById("question-section");

            const questionDiv = document.createElement("div");
            questionDiv.classList.add('question');

            // Add Question Number
            const qNumber = document.createElement("p");
            qNumber.id = `qNumber${questionCounter}`;
            qNumber.textContent = `Question ${questionCounter}`;
            questionDiv.appendChild(qNumber);

            // Add Hint
            const hint = document.createElement("p");
            hint.id = `hint${questionCounter}`;
            hint.textContent = questionData.fld_hint;
            questionDiv.appendChild(hint);

            // Add Ace editor for question code
            const editorDiv = document.createElement("div");
            editorDiv.id = `editor${questionCounter}`;
            questionDiv.appendChild(editorDiv);

            // Initialize Ace editor inside each editor div
            const editor = ace.edit(`editor${questionCounter}`);
            editor.setTheme("ace/theme/monokai");
            editor.session.setMode("ace/mode/csharp");

            // Add the question text in the editor as initial content
            editor.setValue(questionData.fld_question);

            questionSection.appendChild(questionDiv);
        });
    } catch (error) {
        console.error("Error fetching questions:", error);
    }
}

// Call the function to load data on page load
document.addEventListener("DOMContentLoaded", fetchExerciseData);
