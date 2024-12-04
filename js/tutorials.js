import { initializeApp } from "https://www.gstatic.com/firebasejs/11.0.1/firebase-app.js";
import { getFirestore, collection, getDocs, doc, getDoc } from "https://www.gstatic.com/firebasejs/11.0.1/firebase-firestore.js";

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
    fetchModules();
});

async function fetchModules() {
    try {
        // Get the parent containers for each language
        const javaDiv = document.querySelector("#java-div");
        const csharpDiv = document.querySelector("#csharp-div");
        const pythonDiv = document.querySelector("#python-div");

        if (!javaDiv || !csharpDiv || !pythonDiv) {
            console.error("One or more div containers for languages were not found.");
            return;
        }

        const modulesSnapshot = await getDocs(collection(db, "tbl_modules"));

        for (const moduleDoc of modulesSnapshot.docs) {
            const module = moduleDoc.data();

            if (!module.fld_language || !module.fld_userId || !module.fld_fileName) {
                console.error(`Module ${moduleDoc.id} is missing required fields.`);
                continue; // Skip this module if fields are missing
            }

            // Fetch the user associated with the module
            const userRef = doc(db, "tbl_users", module.fld_userId);
            const userSnap = await getDoc(userRef);

            if (!userSnap.exists()) {
                console.error(`User with ID ${module.fld_userId} not found.`);
                continue; // Skip if user doesn't exist
            }

            const user = userSnap.data();

            // Create the card HTML
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

            // Append the card to the correct div based on fld_language
            if (module.fld_language.toLowerCase() === "java") {
                javaDiv.innerHTML += cardHTML;
            } else if (module.fld_language.toLowerCase() === "csharp") {
                csharpDiv.innerHTML += cardHTML;
            } else if (module.fld_language.toLowerCase() === "python") {
                pythonDiv.innerHTML += cardHTML;
            } else {
                console.warn(`Unrecognized language "${module.fld_language}" for module ${moduleDoc.id}.`);
            }
        }

        // Add event listeners to all "Start Now" buttons
        document.querySelectorAll(".card-button").forEach((button) => {
            button.addEventListener("click", (event) => {
                const filePath = event.target.getAttribute("data-file-path");
                if (filePath) {
                    window.open(filePath, "_blank"); // Open the PDF in a new tab
                } else {
                    console.error("File path is missing for this module.");
                }
            });
        });
    } catch (error) {
        console.error("Error fetching modules:", error);
    }
}