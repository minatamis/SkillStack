import { initializeApp } from "https://www.gstatic.com/firebasejs/11.0.1/firebase-app.js";
import { getFirestore, collection, getDocs, doc, getDoc, orderBy, query, where } from "https://www.gstatic.com/firebasejs/11.0.1/firebase-firestore.js";

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

document.addEventListener("DOMContentLoaded", () => {
    const urlParams = new URLSearchParams(window.location.search);
    const language = urlParams.get("language");

    if (language) {
        document.title = `${language} Tutorials`;
        const titleElement = document.querySelector(".centered-container .title h1");
        const titleImage = document.querySelector(".centered-container .title img");
        if (titleElement) {
            const ttl = language=="Java"?"Java":language=="CSharp"?"C#":language=="Python"?"Python":"Language";
            titleElement.textContent = ttl;

        }
        if (titleImage) {
            const im = language=="Java"?"java":language=="Csharp"?"csharp":language=="Python"?"py":"none";
            titleImage.src = `../assets/images/${im}.png`;
            titleImage.alt = `${language} Tutorial Icon`;
        }
        fetchLessons(language);
    } else {
        console.error("No language specified in the URL.");
    }
});

async function fetchLessons(language) {
    try {
        const lessonDiv = document.querySelector("#lesson-div");
        if (!lessonDiv) {
            console.error("Lesson container not found.");
            return;
        }

        const lessonsRef = collection(db, "tbl_lessons");
        const lessonQuery = query(
            lessonsRef,
            where("fld_language", "==", language.toLowerCase())
        );
        const lessonsSnapshot = await getDocs(lessonQuery);

        lessonDiv.innerHTML = "";

        for (const lessonDoc of lessonsSnapshot.docs) {
            const lesson = lessonDoc.data();

            if (!lesson.fld_language || !lesson.fld_userId || !lesson.fld_lessonName) {
                console.error(`Lesson ${lessonDoc.id} is missing required fields.`);
                continue;
            }

            const userRef = doc(db, "tbl_users", lesson.fld_userId);
            const userSnap = await getDoc(userRef);

            if (!userSnap.exists()) {
                console.error(`User with ID ${lesson.fld_userId} not found.`);
                continue;
            }

            const user = userSnap.data();

            const cardHTML = `
                <div class="card">
                    <div class="card-details">
                        <img src="../assets/images/Java1.png" alt="${lesson.fld_language} Tutorial">
                        <p class="text-title">${lesson.fld_lessonName}</p>
                        <p class="text-body">Uploaded by: ${user.fld_firstName} ${user.fld_lastName}</p>
                    </div>
                    <button class="card-button" data-lesson-id="${lessonDoc.id}">
                        Start Now
                    </button>
                </div>
            `;
            lessonDiv.innerHTML += cardHTML;
        }

        // Add event listeners to all buttons
        document.querySelectorAll(".card-button").forEach((button) => {
            button.addEventListener("click", (event) => {
                const lessonId = event.target.getAttribute("data-lesson-id");
                if (lessonId) {
                    window.location.href = `lesson-contents.html?lessonId=${lessonId}`;
                } else {
                    console.error("Lesson ID is missing for this button.");
                }
            });
        });
    } catch (error) {
        console.error("Error fetching lessons:", error);
    }
}
