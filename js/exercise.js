import { initializeApp } from "https://www.gstatic.com/firebasejs/11.0.1/firebase-app.js";
import { getFirestore, getDoc, doc, query, collection, where, getDocs } from "https://www.gstatic.com/firebasejs/11.0.1/firebase-firestore.js";

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

            // Get language from tbl_exercises
            const exerciseLanguage = exerciseData.fld_language;
            let aceMode;

            // Map fld_language to ACE mode
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
                    aceMode = "ace/mode/text"; // Fallback to plain text
            }

            // Fetch questions associated with the exercise
            const questionsQuery = query(
                collection(db, "tbl_questions"),
                where("fld_exerciseId", "==", exerciseId)
            );
            const questionsQuerySnap = await getDocs(questionsQuery);

            let questionCount = 1;
            questionsQuerySnap.forEach((doc) => {
                const questionData = doc.data();

                // Create unique editor ID for each question
                const editorId = `editor-${questionCount}`;
                const questionDiv = document.createElement("div");
                questionDiv.innerHTML = `
                    <p id="qNumber">Question ${questionCount}</p>
                    <p id="hint">${questionData.fld_hint}</p>
                    <div id="${editorId}" class="editor">${questionData.fld_question}</div>
                `;
                document.getElementById("question-section").appendChild(questionDiv);

                // Initialize the ACE editor for the newly created div
                const editor = ace.edit(editorId);
                editor.setTheme("ace/theme/monokai");
                editor.session.setMode(aceMode); // Set mode from fld_language

                questionCount++;
            });

        } else {
            console.log("No such exercise document!");
        }
    } catch (error) {
        console.error("Error fetching data:", error);
    }
}

// Example: Replace with the actual exercise ID
const currentExerciseId = "2MTxA4KjNmgrUJ1tHnoU";
fetchExerciseData(currentExerciseId);
