import { initializeApp } from "https://www.gstatic.com/firebasejs/11.0.1/firebase-app.js";
import { getFirestore, getDoc, doc, query, collection, where, getDocs, addDoc, serverTimestamp } from "https://www.gstatic.com/firebasejs/11.0.1/firebase-firestore.js";

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
const db = getFirestore();

// Function to fetch data
async function fetchExerciseData(exerciseId) {
    try {
        const exerciseDocRef = doc(db, "tbl_exercises", exerciseId);
        const exerciseDocSnap = await getDoc(exerciseDocRef);

        if (exerciseDocSnap.exists()) {
            const exerciseData = exerciseDocSnap.data();
            document.getElementById("quiz-title").innerText = exerciseData.fld_title;
            document.getElementById("Instruction").innerText = exerciseData.fld_instruction;

            const exerciseLanguage = exerciseData.fld_language;
            let aceMode;

            switch (exerciseLanguage) {
                case "Java":
                    aceMode = "ace/mode/java";
                    break;
                case "Python":
                    aceMode = "ace/mode/python";
                    break;
                case "C#":
                    aceMode = "ace/mode/csharp";
                    break;
                default:
                    console.warn(`Unsupported language: ${exerciseLanguage}`);
                    aceMode = "ace/mode/text";
            }

            const questionsQuery = query(
                collection(db, "tbl_questions"),
                where("fld_exerciseId", "==", exerciseId)
            );
            const questionsQuerySnap = await getDocs(questionsQuery);

            let questionCount = 1;
            questionsQuerySnap.forEach((doc) => {
                const questionData = doc.data();

                const editorId = `editor-${questionCount}`;
                const questionDiv = document.createElement("div");
                questionDiv.innerHTML = `
                    <p id="qNumber">Question ${questionCount}</p>
                    <p id="hint">${questionData.fld_hint}</p>
                    <div id="${editorId}" class="editor">${questionData.fld_question}</div>
                `;
                document.getElementById("question-section").appendChild(questionDiv);

                const editor = ace.edit(editorId);
                editor.setTheme("ace/theme/monokai");
                editor.session.setMode(aceMode);

                questionCount++;
            });

        } else {
            console.log("No such exercise document!");
        }
    } catch (error) {
        console.error("Error fetching data:", error);
    }
}

// Function to get query parameters from URL
function getQueryParam(param) {
    const urlParams = new URLSearchParams(window.location.search);
    return urlParams.get(param);
}

// Mock function to get the current user ID (replace with your actual implementation)
function getCurrentUserId() {
    const loggedInUserId=localStorage.getItem('loggedInUserId');
    return loggedInUserId;
}

const currentExerciseId = getQueryParam("exerciseId");

if (currentExerciseId) {
    fetchExerciseData(currentExerciseId);
} else {
    console.error("No exercise ID found in the URL.");
}

// Add event listener for submit button
document.querySelector(".custom-btn").addEventListener("click", async () => {
    const userAnswers = [];
    const editors = document.querySelectorAll(".editor");

    // Collect user answers
    editors.forEach((editor, index) => {
        const aceEditor = ace.edit(editor.id);
        userAnswers.push({
            questionNumber: index + 1,
            answer: aceEditor.getValue()
        });
    });

    const exerciseId = getQueryParam("exerciseId");
    const userId = getCurrentUserId();

    if (exerciseId && userId) {
        try {
            // Fetch correct answers
            const questionsQuery = query(
                collection(db, "tbl_questions"),
                where("fld_exerciseId", "==", exerciseId)
            );
            const questionsQuerySnap = await getDocs(questionsQuery);

            const questionsWithAnswers = [];
            questionsQuerySnap.forEach((doc) => {
                questionsWithAnswers.push({
                    questionId: doc.id,
                    question: doc.data().fld_question,
                    hint: doc.data().fld_hint,
                    correctAnswer: doc.data().fld_answer
                });
            });

            // Evaluate answers and calculate score
            let correctAnswersCount = 0;
            const questionsToDisplay = questionsWithAnswers.map((question, index) => {
                const userAnswer = userAnswers[index]?.answer || "";
                const isCorrect = userAnswer.trim() === question.correctAnswer.trim();
                if (isCorrect) correctAnswersCount++;
                return {
                    ...question,
                    userAnswer,
                    isCorrect
                };
            });

            // Save score to Firestore
            await addDoc(collection(db, "tbl_scores"), {
                fld_userId: userId,
                fld_score: correctAnswersCount,
                fld_exerciseId: exerciseId,
                fld_answeredAt: serverTimestamp()
            });

            // Redirect with data in session storage
            sessionStorage.setItem("checkedQuestions", JSON.stringify(questionsToDisplay));
            window.location.href = "checked.html";

        } catch (error) {
            console.error("Error saving score or processing answers:", error);
        }
    } else {
        console.error("Exercise ID or User ID is missing!");
    }
});
