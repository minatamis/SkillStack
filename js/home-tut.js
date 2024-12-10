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
    fetchRandomModules();
});

async function fetchRandomModules() {
    try {
        const tutorialsContainer = document.querySelector(".grid-container");

        if (!tutorialsContainer) {
            console.error("Tutorials container not found.");
            return;
        }

        const modulesSnapshot = await getDocs(collection(db, "tbl_modules"));
        const modules = modulesSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));

        if (modules.length === 0) {
            console.warn("No modules found.");
            return;
        }

        const randomModules = modules.sort(() => 0.5 - Math.random()).slice(0, 4);

        for (const module of randomModules) {
            if (!module.fld_userId || !module.fld_fileName) {
                console.error(`Module ${module.id} is missing required fields.`);
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
                <div class="col">
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
                </div>
            `;

            tutorialsContainer.innerHTML += cardHTML;
        }

        document.querySelectorAll(".card-button").forEach(button => {
            button.addEventListener("click", event => {
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