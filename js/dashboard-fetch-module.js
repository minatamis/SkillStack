import { initializeApp } from "https://www.gstatic.com/firebasejs/11.0.1/firebase-app.js";
import { getFirestore, collection, getDocs, query, where, doc, deleteDoc, orderBy } from "https://www.gstatic.com/firebasejs/11.0.1/firebase-firestore.js";

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

function toggleOptions(event) {
  const dots = event.target;
  const options = dots.nextElementSibling;
  
  if (options.style.display === "block") {
    options.style.display = "none";
  } else {
    options.style.display = "block";
  }
}

async function fetchModules() {
  const loggedInUserId = localStorage.getItem('loggedInUserId');
  if (!loggedInUserId) return;

  const modulesRef = collection(db, "tbl_modules");
  const q = query(modulesRef,
    where("fld_userId", "==", loggedInUserId),
    orderBy("fld_uploadedAt")
  );

  const querySnapshot = await getDocs(q);
  const moduleList = document.querySelector('.module-list');
  moduleList.innerHTML = '';

  let count = 0;

  querySnapshot.forEach((doc) => {
    count++;

    const data = doc.data();
    const moduleId = doc.id;
    const { fld_name, fld_language, fld_fileName } = data;

    const moduleItem = document.createElement('div');
    moduleItem.classList.add('module-item');

    moduleItem.innerHTML = `
      <a href="#">
        <img src="../assets/images/pdf icon.png" alt="Quiz">
        <span class="quiz-name">${fld_name}</span>
      </a>
      <span class="dots">...</span>
      <div class="options" style="display: none;">
        <button class="view" id="view-${moduleId}" onclick="window.location.href='../assets/modules/${fld_language}/${fld_fileName}'">View</button>
        <button class="delete" id="delete-${moduleId}">Delete</button>
      </div>
    `;

    moduleItem.querySelector('.dots').addEventListener('click', toggleOptions);

    moduleItem.querySelector(`#delete-${moduleId}`).addEventListener('click', () => {
        deleteModule(moduleId);
    });

    moduleList.appendChild(moduleItem);
  });
  document.getElementById("total-modules").innerHTML = `Total Modules Created<br>${count}`;

}

async function deleteModule(moduleId) {
  try {
    const moduleRef = doc(db, "tbl_modules", moduleId);
    await deleteDoc(moduleRef);
    alert("Module deleted successfully!");
    fetchModules();
  } catch (error) {
    console.error("Error deleting module:", error);
    alert("Failed to delete module.");
  }
}

window.addEventListener('DOMContentLoaded', () => {
  fetchModules();
});
