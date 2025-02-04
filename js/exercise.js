import { initializeApp } from "https://www.gstatic.com/firebasejs/11.0.1/firebase-app.js";
import { getFirestore, getDoc, doc, query, collection, where, getDocs, addDoc, serverTimestamp, setDoc, orderBy } from "https://www.gstatic.com/firebasejs/11.0.1/firebase-firestore.js";

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

// Global variable to store the displayed questions
let questionsArray = [];

// Function to shuffle an array (Fisher-Yates Shuffle)
function shuffleArray(array) {
    for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]];
    }
    return array;
}

// Function to fetch exercise data
async function fetchExerciseData(exerciseId) {
    try {
        const exerciseDocRef = doc(db, "tbl_exercises", exerciseId);
        const exerciseDocSnap = await getDoc(exerciseDocRef);

        if (exerciseDocSnap.exists()) {
            const exerciseData = exerciseDocSnap.data();
            document.getElementById("quiz-title").innerText = exerciseData.fld_title;
            document.getElementById("Instruction").innerText = exerciseData.fld_instruction;

            const fld_questionCountStore = exerciseData.fld_questionCountStore || null; // Get question count or default to null
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

            // Populate global questionsArray
            questionsArray = [];
            questionsQuerySnap.forEach((doc) => {
                questionsArray.push({ id: doc.id, ...doc.data() });
            });

            if (fld_questionCountStore && fld_questionCountStore > 0) {
                // Shuffle and slice the array to get a random subset
                questionsArray = shuffleArray(questionsArray).slice(0, fld_questionCountStore);
            }

            let questionCount = 1;
            questionsArray.forEach((questionData) => {
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

// Function to get a query parameter
function getQueryParam(param) {
    const urlParams = new URLSearchParams(window.location.search);
    return urlParams.get(param);
}

// Function to get the current user ID
function getCurrentUserId() {
    const loggedInUserId = localStorage.getItem('loggedInUserId');
    return loggedInUserId;
}

// Fetch the exercise data
const currentExerciseId = getQueryParam("exerciseId");
if (currentExerciseId) {
    fetchExerciseData(currentExerciseId);
} else {
    console.error("No exercise ID found in the URL.");
}

// Handle answer submission
document.querySelector(".custom-btn").addEventListener("click", async () => {
    const userAnswers = [];
    const editors = document.querySelectorAll(".editor");

    editors.forEach((editor, index) => {
        const aceEditor = ace.edit(editor.id);
        userAnswers.push({
            questionNumber: index + 1,
            answer: aceEditor.getValue()
        });
    });

    const exerciseId = getQueryParam("exerciseId");
    const userId = getCurrentUserId();
    const contentId = getQueryParam("contentId");

    if (exerciseId && userId) {
        try {
            const questionsWithAnswers = questionsArray.map((question, index) => {
                const userAnswer = userAnswers[index]?.answer || "";
                const isCorrect = userAnswer.trim() === question.fld_answer.trim();
                return {
                    question: question.fld_question,
                    correctAnswer: question.fld_answer,
                    userAnswer,
                    isCorrect,
                    hint: question.fld_hint
                };
            });
            

            const totalQuestions = questionsWithAnswers.length;
            const correctAnswersCount = questionsWithAnswers.filter(q => q.isCorrect).length;

            await addDoc(collection(db, "tbl_scores"), {
                fld_userId: userId,
                fld_score: correctAnswersCount,
                fld_totalQuestions: totalQuestions,
                fld_exerciseId: exerciseId,
                fld_answeredAt: serverTimestamp()
            });

            if (contentId) {
                const progressDocId = `${contentId}${userId}`;
                await setDoc(doc(db, "tbl_progress", progressDocId), {
                    fld_userId: userId,
                    fld_contentId: contentId,
                    fld_lastUpdated: new Date().toISOString()
                });
                console.log(`Progress added with ID: ${progressDocId}`);
            }

            sessionStorage.setItem("checkedQuestions", JSON.stringify(questionsWithAnswers));
            window.location.href = "checked.html";

        } catch (error) {
            console.error("Error saving score or processing answers:", error);
        }
    } else {
        console.error("Exercise ID or User ID is missing!");
    }
});

async function fetchExerciseHistory() {
    const userId = localStorage.getItem('loggedInUserId');
    const exerciseId = getQueryParam("exerciseId");

    if (!userId || !exerciseId) {
        console.error("User ID or Exercise ID is missing!");
        return;
    }

    try {
        const scoresQuery = query(
            collection(db, "tbl_scores"),
            where("fld_exerciseId", "==", exerciseId),
            where("fld_userId", "==", userId),
            orderBy("fld_answeredAt", "desc")
        );

        const scoresSnap = await getDocs(scoresQuery);
        const tableBody = document.querySelector("tbody");
        tableBody.innerHTML = ""; // Clear previous entries

        scoresSnap.forEach((doc) => {
            const data = doc.data();
            const { fld_answeredAt, fld_score, fld_totalQuestions } = data;
            const answeredAt = fld_answeredAt.toDate().toLocaleString(); // Convert timestamp to readable format
            const evaluation = (fld_score / fld_totalQuestions) * 100 >= 75 ? "Passed" : "Failed";

            const row = `
                <tr>
                    <td>${answeredAt}</td>
                    <td>${fld_score}</td>
                    <td>${fld_totalQuestions}</td>
                    <td>${evaluation}</td>
                </tr>
            `;
            tableBody.innerHTML += row;
        });

    } catch (error) {
        console.error("Error fetching exercise history:", error);
    }
}

// Call the function when the page loads
fetchExerciseHistory();
