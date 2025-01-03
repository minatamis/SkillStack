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
        fetchModules(language);
    } else {
        console.error("No language specified in the URL.");
    }
});

async function fetchModules(language) {
    try {
        const lessonDiv = document.querySelector("#lesson-div");
        if (!lessonDiv) {
            console.error("Lesson container not found.");
            return;
        }

        const modulesRef = collection(db, "tbl_modules");
        const moduleQuery = query(
            modulesRef,
            where("fld_language", "==", language.toLowerCase()),
            orderBy("fld_uploadedAt")
        );
        const modulesSnapshot = await getDocs(moduleQuery);

        lessonDiv.innerHTML = "";

        for (const moduleDoc of modulesSnapshot.docs) {
            const module = moduleDoc.data();

            if (!module.fld_language || !module.fld_userId || !module.fld_fileName) {
                console.error(`Module ${moduleDoc.id} is missing required fields.`);
                continue;
            }

            const userRef = doc(db, "tbl_users", module.fld_userId);
            const userSnap = await getDoc(userRef);

            if (!userSnap.exists()) {
                console.error(`User with ID ${module.fld_userId} not found.`);
                continue;
            }

            const user = userSnap.data();

            const cardHTML = `
                <div class="card">
                    <div class="card-details">
                        <img src="../assets/images/1.png" alt="${module.fld_language} Tutorial">
                        <p class="text-title">${module.fld_name}</p>
                        <p class="text-body">Uploaded by: ${user.fld_firstName} ${user.fld_lastName}</p>
                    </div>
                    <button class="card-button" data-file-path="../assets/modules/${module.fld_language}/${module.fld_fileName}">
                        Start Now
                    </button>
                </div>
            `;
            lessonDiv.innerHTML += cardHTML;
        }

        document.querySelectorAll(".card-button").forEach((button) => {
            button.addEventListener("click", (event) => {
                const filePath = event.target.getAttribute("data-file-path");
                if (filePath) {
                    window.open(filePath, "_blank");
                } else {
                    console.error("File path is missing for this module.");
                }
            });
        });
    } catch (error) {
        console.error("Error fetching modules:", error);
    }
}


// Set the progress value
let progressValue = 5; // Set progress percentage (0 to 100)

// Get elements
const progressCircle = document.getElementById('progress-circle');
const progressValueDisplay = document.getElementById('progress-value');

// Maximum circumference of the circle
const circumference = 2 * Math.PI * 70; // Radius is 70
progressCircle.style.strokeDasharray = circumference;

// Animate the progress
function updateProgress(value) {
    const offset = circumference - (value / 100) * circumference;
    progressCircle.style.strokeDashoffset = offset;
    progressValueDisplay.textContent = `${value}%`;
}

// Call the function with the initial value
updateProgress(progressValue);
