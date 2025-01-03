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

async function fetchLessons() {
  const loggedInUserId = localStorage.getItem('loggedInUserId');
  if (!loggedInUserId) return;

  const lessonsRef = collection(db, "tbl_lessons");
  const q = query(lessonsRef,
    where("fld_userId", "==", loggedInUserId),
    orderBy("fld_createdTime")
  );

  const querySnapshot = await getDocs(q);
  const moduleList = document.querySelector('.module-list');
  moduleList.innerHTML = '';

  let count = 0;

  querySnapshot.forEach((doc) => {
    count++;

    const data = doc.data();
    const lessonId = doc.id;
    const { fld_lessonName } = data;

    const lessonItem = document.createElement('div');
    lessonItem.classList.add('module-item');

    lessonItem.innerHTML = `
      <a href="addlesson.html?lessonId=${lessonId}">
        <img src="../assets/images/pdf icon.png" alt="Lesson">
        <span class="quiz-name">${fld_lessonName}</span>
      </a>
      <span class="dots">...</span>
      <div class="options" style="display: none;">
        <button class="edit" id="view-${lessonId}" onclick="window.location.href='addlesson.html?lessonId=${lessonId}'">View</button>
        <button class="delete" id="delete-${lessonId}">Delete</button>
      </div>
    `;

    lessonItem.querySelector('.dots').addEventListener('click', toggleOptions);

    lessonItem.querySelector(`#delete-${lessonId}`).addEventListener('click', () => {
        deleteLesson(lessonId);
    });

    moduleList.appendChild(lessonItem);
  });
  document.getElementById("total-modules").innerHTML = `Total Lessons Created<br>${count}`;
}

async function deleteLesson(lessonId) {
  try {
    const lessonRef = doc(db, "tbl_lessons", lessonId);
    await deleteDoc(lessonRef);
    alert("Lesson deleted successfully!");
    fetchLessons();
  } catch (error) {
    console.error("Error deleting lesson:", error);
    alert("Failed to delete lesson.");
  }
}

window.addEventListener('DOMContentLoaded', () => {
  fetchLessons();
});
