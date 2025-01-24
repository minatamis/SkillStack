import { initializeApp } from "https://www.gstatic.com/firebasejs/11.0.1/firebase-app.js";
import { getFirestore, collection, query, where, getDocs, doc, getDoc, deleteDoc, addDoc, updateDoc, orderBy } from "https://www.gstatic.com/firebasejs/11.0.1/firebase-firestore.js";

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

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

// Get lessonId from URL
const urlParams = new URLSearchParams(window.location.search);
const lessonId = urlParams.get("lessonId");

// DOM Elements
const container = document.getElementById("container");
const addCardElement = document.getElementById("add-card");
const options = document.getElementById("options");
const popup = document.getElementById("popup");
const closePopup = document.getElementById("closePopup");
const uploadForm = document.getElementById("uploadForm");
const dropArea = document.getElementById("upload-area");
const moduleTitleInput = document.getElementById("moduleTitle");
const containerTitle = document.querySelector(".container-title");

let selectedFile = null;
let lessonLanguage = "";

// Fetch Lesson Title
async function fetchLessonTitle() {
    if (!lessonId) {
        console.error("Lesson ID not found in URL.");
        return;
    }

    try {
        const lessonDocRef = doc(db, "tbl_lessons", lessonId);
        const lessonDoc = await getDoc(lessonDocRef);

        if (lessonDoc.exists()) {
            const data = lessonDoc.data();
            containerTitle.textContent = data.fld_lessonName || "Untitled Lesson";
        } else {
            console.warn("No lesson found with the given ID.");
        }
    } catch (error) {
        console.error("Error fetching lesson title:", error);
    }
}

// Fetch Lesson Contents
async function fetchLessonContents() {
    if (!lessonId) {
        console.error("Lesson ID not found in URL.");
        return;
    }

    try {
        const lessonContentsRef = collection(db, "tbl_lessonContents");
        const q = query(
            lessonContentsRef,
            where("fld_lessonId", "==", lessonId)
        );
        const querySnapshot = await getDocs(q);

        // Fetch language from tbl_lessons
        const lessonDocRef = doc(db, "tbl_lessons", lessonId);
        const lessonDoc = await getDoc(lessonDocRef);
        const fld_language = lessonDoc.exists() ? lessonDoc.data().fld_language : "";

        // Collect and sort documents
        const contents = [];
        querySnapshot.forEach(doc => {
            const data = doc.data();
            contents.push({
                id: doc.id,
                ...data,
            });
        });

        // Sort contents: entries with fld_order go first, followed by those without
        contents.sort((a, b) => {
            if (a.fld_order === undefined && b.fld_order === undefined) return 0;
            if (a.fld_order === undefined) return 1; // No fld_order goes last
            if (b.fld_order === undefined) return -1; // No fld_order goes last
            return a.fld_order - b.fld_order; // Ascending order
        });

        // Display sorted contents
        contents.forEach(content => {
            const { id, fld_contentName, fld_contentType, fld_fileName, fld_exerciseId } = content;
            createCard(
                fld_contentType || "Unknown",
                fld_contentName || "Untitled Content",
                id,
                fld_language,
                fld_fileName || "",
                fld_exerciseId || ""
            );
        });
    } catch (error) {
        console.error("Error fetching lesson contents:", error);
    }
}



// Create a New Card
function createCard(type, title, contentId, language = "", fileName = "", exerciseId = "") {
    const card = document.createElement("div");
    card.classList.add("card");
    card.setAttribute("data-content-id", contentId);

    let buttonAction = "";
    if (type === "Lecture") {
        buttonAction = `window.location.href='../assets/modules/${language}/${fileName}'`;
    } else if (type === "Quiz") {
        buttonAction = `window.location.href='edit.html?exerciseId=${exerciseId}&lessonContentId=${contentId}'`;
    } else if (type === "Coding") {
        buttonAction = `window.location.href='compact-edit.html?contentId=${contentId}&lessonId=${lessonId}'`;
    }

    card.innerHTML = `
        <div class="menu-container">
            <span class="menu-btn" onclick="toggleMenu(event, this)">...</span>
            <div class="menu-options">
                <button onclick="deleteCard(this)">Delete</button>
            </div>
        </div>
        <img src="../assets/images/1.png" alt="Module Image">
        <h3>${title}</h3>
        <p>${type}</p>
        <button class="btn-start" onclick="${buttonAction}">View</button>
        <div class="card-controls">
            <button class="btn-left" onclick="moveCard(this, 'left')">&larr;</button>
            <button class="btn-right" onclick="moveCard(this, 'right')">&rarr;</button>
        </div>
    `;

    container.insertBefore(card, addCardElement);
}



// Toggle the Three-Dot Menu
window.toggleMenu = function (event, element) {
    event.stopPropagation();
    const menu = element.nextElementSibling;
    menu.style.display = menu.style.display === "block" ? "none" : "block";
};

// Delete the Card and Firestore Document
window.deleteCard = async function (button) {
    const card = button.closest(".card"); // Find the closest card container
    const contentId = card.getAttribute("data-content-id"); // Get the associated Firestore document ID

    if (!contentId) {
        console.error("Content ID not found for this card.");
        return;
    }

    try {
        const contentDocRef = doc(db, "tbl_lessonContents", contentId);
        await deleteDoc(contentDocRef); // Delete the Firestore document
        card.remove(); // Remove the card from the DOM
        console.log("Content deleted successfully.");
    } catch (error) {
        console.error("Error deleting content:", error);
    }
};

// Toggle Add Card Options
addCardElement.addEventListener("click", (event) => {
    event.stopPropagation();
    options.style.display = options.style.display === "flex" ? "none" : "flex";
});

// Add Card Based on Selection
// Add Card Based on Selection
window.addCard = async function (type) {
    options.style.display = "none";

    if (!lessonId) {
        alert("Lesson ID is missing. Cannot add new content.");
        return;
    }

    try {
        // Fetch fld_language from tbl_lessons
        const lessonDocRef = doc(db, "tbl_lessons", lessonId);
        const lessonDoc = await getDoc(lessonDocRef);

        if (lessonDoc.exists()) {
            const fld_language = lessonDoc.data().fld_language || "";

            if (type === "Lecture") {
                popup.classList.remove("hidden");
            } else if (type === "Quiz") {
                window.location.href = `create.html?lessonId=${lessonId}&lessonLang=${encodeURIComponent(fld_language)}`;
            } else if (type === "Coding") {
                window.location.href = `compact.html?lessonId=${lessonId}&lessonLang=${encodeURIComponent(fld_language)}`;
            }
        } else {
            console.warn("No lesson found with the given ID.");
        }
    } catch (error) {
        console.error("Error fetching fld_language:", error);
    }
};

// Close Popup
closePopup.addEventListener("click", () => {
    popup.classList.add("hidden");
});

// Fetch language from tbl_lessons
async function fetchLessonLanguage() {
    if (!lessonId) {
        console.error("Lesson ID not found in URL.");
        return;
    }

    try {
        const lessonDocRef = doc(db, "tbl_lessons", lessonId);
        const lessonDoc = await getDoc(lessonDocRef);

        if (lessonDoc.exists()) {
            const data = lessonDoc.data();
            lessonLanguage = data.fld_language || "";
        } else {
            console.warn("No lesson found with the given ID.");
        }
    } catch (error) {
        console.error("Error fetching lesson language:", error);
    }
}

// Supported file types
const allowedFileTypes = ["application/pdf", "video/mp4", "video/x-msvideo", "video/x-matroska", "video/quicktime", "video/x-ms-wmv", "video/x-flv"];

// Handle file selection
function handleFile(file) {
    if (file && allowedFileTypes.includes(file.type)) {
        selectedFile = file;
        dropArea.textContent = `Selected file: ${file.name}`;
    } else {
        alert("Please upload a valid file. Supported formats: PDF, MP4, AVI, MKV, MOV, WMV, FLV.");
    }
}

// Drag and drop functionality
dropArea.addEventListener("dragover", (e) => {
    e.preventDefault();
    dropArea.classList.add("drag-over");
});

dropArea.addEventListener("dragleave", () => {
    dropArea.classList.remove("drag-over");
});

dropArea.addEventListener("drop", (e) => {
    e.preventDefault();
    dropArea.classList.remove("drag-over");
    const file = e.dataTransfer.files[0];
    handleFile(file);
});

dropArea.addEventListener("click", () => {
    const fileInput = document.createElement("input");
    fileInput.type = "file";
    fileInput.accept = ".pdf, .mp4, .avi, .mkv, .mov, .wmv, .flv"; // Allow multiple formats
    fileInput.click();

    fileInput.addEventListener("change", (e) => {
        const file = e.target.files[0];
        handleFile(file);
    });
});

// Upload the file to the server
async function uploadFile(file, language) {
    return new Promise((resolve, reject) => {
        const formData = new FormData();
        formData.append("file", file);
        formData.append("language", language);

        const xhttp = new XMLHttpRequest();
        xhttp.open("POST", "ajaxfile.php", true);

        xhttp.onreadystatechange = function () {
            if (this.readyState === 4 && this.status === 200) {
                const response = this.responseText;
                if (response === "1") {
                    resolve(true);
                } else {
                    resolve(false);
                }
            }
        };

        xhttp.send(formData);
    });
}

// Handle module creation
uploadForm.addEventListener("submit", async (e) => {
    e.preventDefault();

    const moduleTitle = moduleTitleInput.value;
    const userId = localStorage.getItem("loggedInUserId") || "guest";

    if (!selectedFile) {
        alert("Please select a file.");
        return;
    }

    if (!moduleTitle || !lessonLanguage) {
        alert("Missing module title or lesson language.");
        return;
    }

    try {
        const uploadSuccess = await uploadFile(selectedFile, lessonLanguage);

        if (uploadSuccess) {
            const moduleData = {
                fld_contentName: moduleTitle,
                fld_contentType: "Lecture",
                fld_fileName: selectedFile.name,
                fld_uploadedAt: new Date().toISOString(),
                fld_lessonId: lessonId,
            };

            await addDoc(collection(db, "tbl_lessonContents"), moduleData);

            alert("Lecture uploaded successfully!");
            uploadForm.reset();
            dropArea.textContent = "Drag and drop your file here or click to select";
            popup.classList.add("hidden");
        } else {
            alert("Error uploading file to server.");
        }
    } catch (error) {
        console.error("Error uploading module:", error);
        alert(`Error uploading lecture: ${error.message}`);
    }
});


// Close popup
closePopup.addEventListener("click", () => {
    popup.classList.add("hidden");
});

// Initialize page
window.addEventListener("DOMContentLoaded", async () => {
    await fetchLessonLanguage();
});

// Handle Module Creation
document.getElementById("uploadForm").addEventListener("submit", (e) => {
    e.preventDefault();
    const moduleTitle = document.getElementById("moduleTitle").value;
    createCard("Lecture", moduleTitle, null); // No Firestore document ID yet for locally created modules
    popup.classList.add("hidden");
    document.getElementById("uploadForm").reset();
});

// Hide Options and Menus When Clicking Outside
document.addEventListener("click", () => {
    options.style.display = "none"; // Hide Add Card options
    document.querySelectorAll(".menu-options").forEach(menu => {
        menu.style.display = "none"; // Hide all three-dot menus
    });
});

// Fetch lesson title and contents, and initialize page on load
window.addEventListener("DOMContentLoaded", () => {
    fetchLessonTitle();
    fetchLessonContents();
});



window.moveCard = function (button, direction) {
    console.log('moveCard triggered', { button, direction });

    const card = button.closest('.card'); // Get the card element
    const container = card?.parentElement; // Get the parent container

    if (!card || !container) {
        console.error('Card or container not found.');
        return;
    }

    console.log('Card:', card);
    console.log('Container:', container);

    if (direction === 'left') {
        const previousSibling = card.previousElementSibling;

        console.log('Previous Sibling:', previousSibling);

        // Check if the sibling is a valid card and not the "add-card" element
        if (previousSibling && previousSibling.classList.contains('card')) {
            container.insertBefore(card, previousSibling);
            console.log('Card moved to the left.');
        } else {
            console.warn('No valid previous sibling found or at the beginning.');
        }
    } else if (direction === 'right') {
        const nextSibling = card.nextElementSibling;

        console.log('Next Sibling:', nextSibling);

        // Check if the sibling is a valid card
        if (nextSibling && nextSibling.classList.contains('card')) {
            container.insertBefore(nextSibling, card);
            console.log('Card moved to the right.');
        } else if (nextSibling === document.getElementById('add-card')) {
            // Allow moving to the position just before the "add-card" element
            container.insertBefore(card, nextSibling);
            console.log('Card moved before the "add-card" element.');
        } else {
            console.warn('No valid next sibling found or at the end.');
        }
    }
};

// Save Button Event Listener
const saveButton = document.querySelector(".btn-save");

saveButton.addEventListener("click", async () => {
    if (!lessonId) {
        alert("Lesson ID is missing. Cannot save order.");
        return;
    }

    try {
        // Get all cards (excluding the add-card element)
        const cards = Array.from(document.querySelectorAll(".card"))
            .filter(card => card.getAttribute("data-content-id"));

        // Update each card's order in Firestore
        const updates = cards.map((card, index) => {
            const contentId = card.getAttribute("data-content-id");
            const order = index + 1; // 1-based index for fld_order

            const contentDocRef = doc(db, "tbl_lessonContents", contentId);
            return updateDoc(contentDocRef, { fld_order: order });
        });

        // Wait for all updates to complete
        await Promise.all(updates);

        alert("Card order saved successfully!");
    } catch (error) {
        console.error("Error saving card order:", error);
        alert(`Error saving card order: ${error.message}`);
    }
});
