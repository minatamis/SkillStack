import { initializeApp } from "https://www.gstatic.com/firebasejs/11.0.1/firebase-app.js";
import {
    getFirestore,
    collection,
    getDocs,
    doc,
    getDoc
} from "https://www.gstatic.com/firebasejs/11.0.1/firebase-firestore.js";

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

async function fetchExercises() {
    try {
        const exercisesCollection = collection(db, "tbl_exercises");
        const exerciseDocs = await getDocs(exercisesCollection);

        const gridContainer = document.querySelector(".grid-container");
        gridContainer.innerHTML = "";

        for (const exerciseDoc of exerciseDocs.docs) {
            const exerciseData = exerciseDoc.data();

            const userDocRef = doc(db, "tbl_users", exerciseData.fld_userId);
            const userDocSnap = await getDoc(userDocRef);

            const creatorName = userDocSnap.exists()
                ? `${userDocSnap.data().fld_firstName} ${userDocSnap.data().fld_lastName}`
                : "Unknown Creator";

            const exerciseCard = `
                <div class="col">
                    <div class="card">
                        <div class="card-details">
                            <img src="../assets/images/interface.jpg" alt="${exerciseData.fld_title}">
                            <p class="text-title">${exerciseData.fld_title}</p>
                            <p class="text-body">${exerciseData.fld_instruction}</p>
                            <p class="text-muted">Created by: ${creatorName}</p>
                        </div>
                        <button class="card-button">Start Now</button>
                    </div>
                </div>
            `;

            gridContainer.innerHTML += exerciseCard;
        }
    } catch (error) {
        console.error("Error fetching exercises:", error);
    }
}

fetchExercises();
