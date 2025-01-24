import { initializeApp } from "https://www.gstatic.com/firebasejs/11.0.1/firebase-app.js";
import { getFirestore, collection, getDocs, doc, getDoc, orderBy, query, where, setDoc } from "https://www.gstatic.com/firebasejs/11.0.1/firebase-firestore.js";

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
const db = getFirestore(app);

document.addEventListener("DOMContentLoaded", async () => {
    const urlParams = new URLSearchParams(window.location.search);
    const lessonId = urlParams.get("lessonId");
    const userId = localStorage.getItem('loggedInUserId');

    if (lessonId && userId) {
        try {
            const lessonRef = doc(db, "tbl_lessons", lessonId);
            const lessonSnap = await getDoc(lessonRef);

            if (lessonSnap.exists()) {
                const lessonData = lessonSnap.data();
                const titleElement = document.querySelector(".centered-container .title h1");

                if (titleElement && lessonData.fld_lessonName) {
                    titleElement.textContent = lessonData.fld_lessonName;
                } else {
                    console.error("Lesson name or title element is missing.");
                }

                const fld_language = lessonData.fld_language;
                await fetchLessonContent(lessonId, fld_language, userId);
            } else {
                console.error(`Lesson with ID ${lessonId} not found.`);
            }
        } catch (error) {
            console.error("Error fetching lesson:", error);
        }
    } else {
        console.error("No lesson ID or User ID specified in the URL.");
    }
});

async function fetchLessonContent(lessonId, fld_language, userId) {
    try {
        const lessonDiv = document.querySelector("#lesson-div");
        if (!lessonDiv) {
            console.error("Lesson container not found.");
            return;
        }

        const lessonsRef = collection(db, "tbl_lessonContents");
        const lessonQuery = query(
            lessonsRef,
            where("fld_lessonId", "==", lessonId),
            orderBy("fld_order")
        );
        const lessonsSnapshot = await getDocs(lessonQuery);

        const totalLessonContents = lessonsSnapshot.size;
        if (totalLessonContents === 0) {
            console.warn("No lesson contents found for the given lesson ID.");
            updateProgress(0);
            return;
        }

        // Collect content IDs
        const contentIds = lessonsSnapshot.docs.map(doc => doc.id);

        // Fetch progress documents
        const progressRef = collection(db, "tbl_progress");
        const progressQuery = query(
            progressRef,
            where("fld_contentId", "in", contentIds),
            where("fld_userId", "==", userId)
        );
        const progressSnapshot = await getDocs(progressQuery);

        const totalProgress = progressSnapshot.size;

        // Calculate progress percentage
        const progressPercentage = Math.round((totalProgress / totalLessonContents) * 100);

        // Update progress UI
        updateProgress(progressPercentage);

        // Display lesson contents
        lessonDiv.innerHTML = "";
        for (const lessonDoc of lessonsSnapshot.docs) {
            const lessonContent = lessonDoc.data();
        
            // Determine if this content is "Done" based on progress data
            const isDone = progressSnapshot.docs.some(
                (progressDoc) => progressDoc.data().fld_contentId === lessonDoc.id
            );
        
            const statusText = isDone ? "Done" : "Unfinished";
        
            const card = document.createElement("div");
            card.className = "card";
        
            const cardDetails = `
                <div class="card-details">
                    <img src="../assets/images/1.png" alt="${lessonContent.fld_contentName} Lesson">
                    <p class="text-title">${lessonContent.fld_contentName}</p>
                    <p class="text-body">${lessonContent.fld_contentType}</p>
                    <p class="text-body">Status: ${statusText}</p>
                </div>
            `;
        
            const button = document.createElement("button");
            button.className = "card-button";
            button.textContent = "Start Now";
        
            if (lessonContent.fld_contentType === "Lecture") {
                button.addEventListener("click", async () => {
                    const progressDocId = `${lessonDoc.id}${userId}`;
        
                    try {
                        await setDoc(doc(db, "tbl_progress", progressDocId), {
                            fld_userId: userId,
                            fld_contentId: lessonDoc.id,
                            fld_lastUpdated: new Date().toISOString()
                        });
                        console.log(`Progress document created with ID: ${progressDocId}`);
                    } catch (error) {
                        console.error("Error creating progress document:", error);
                    }
        
                    window.open(`../assets/modules/${fld_language}/${lessonContent.fld_fileName}`, "_blank");

                });
            } else if (lessonContent.fld_contentType === "Quiz") {
                button.addEventListener("click", () => {
                    window.location.href = `exercise.html?exerciseId=${lessonContent.fld_exerciseId}&contentId=${lessonDoc.id}`;
                });
            } else if (lessonContent.fld_contentType === "Coding") {
                button.addEventListener("click", () => {
                    window.location.href = `compact-student.html?contentId=${lessonDoc.id}&lessonLang=${fld_language}`;
                });
            }
        
            card.innerHTML = cardDetails;
            card.appendChild(button);
            lessonDiv.appendChild(card);
        }
        
    } catch (error) {
        console.error("Error fetching lesson contents:", error);
    }
}

// Progress Bar Elements
const progressCircle = document.getElementById('progress-circle');
const progressValueDisplay = document.getElementById('progress-value');

// Maximum circumference of the progress circle (radius = 70)
const circumference = 2 * Math.PI * 70;
progressCircle.style.strokeDasharray = circumference;

// Function to update the progress bar and display
function updateProgress(value) {
    const offset = circumference - (value / 100) * circumference;
    progressCircle.style.strokeDashoffset = offset;
    progressValueDisplay.textContent = `${value}%`;
}
