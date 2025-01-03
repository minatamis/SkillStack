import { initializeApp } from "https://www.gstatic.com/firebasejs/11.0.1/firebase-app.js";
// import { getStorage, ref, uploadBytes, getDownloadURL } from "https://www.gstatic.com/firebasejs/11.0.1/firebase-storage.js";
import { getFirestore, collection, addDoc } from "https://www.gstatic.com/firebasejs/11.0.1/firebase-firestore.js";

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
// const storage = getStorage(app);
const db = getFirestore(app);

const addModuleBtn = document.getElementById("addModuleBtn");
const addQuizBtn = document.getElementById("addQuizBtn");
const popup = document.getElementById("popup");
const dropArea = document.getElementById("dropArea");
const closePopup = document.getElementById("closePopup");
const uploadForm = document.getElementById("uploadForm");
const overlay = document.getElementById('overlay');


let selectedFile = null;

addQuizBtn.addEventListener("click", () => {
    window.location.href = `create.html`;
});

addModuleBtn.addEventListener("click", () => {
    popup.style.display = "block";
    overlay.style.display = "block";
});

closePopup.addEventListener("click", () => {
    popup.style.display = "none";
    overlay.style.display = "none";
});

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
    fileInput.accept = ".pdf";
    fileInput.click();

    fileInput.addEventListener("change", (e) => {
        const file = e.target.files[0];
        handleFile(file);
    });
});

function handleFile(file) {
    if (file && file.type === "application/pdf") {
        selectedFile = file;
        dropArea.textContent = `Selected file: ${file.name}`;
    } else {
        alert("Please upload a valid PDF file.");
    }
}

uploadForm.addEventListener("submit", async (e) => {
    e.preventDefault();

    const moduleTitle = document.getElementById("moduleTitle").value;
    const language = document.getElementById("language").value;
    const userId = localStorage.getItem("loggedInUserId") || "guest";

    if (!selectedFile) {
        alert("Please select a PDF file.");
        return;
    }

    if (!moduleTitle || !language) {
        alert("Please fill in all fields.");
        return;
    }

    try {
        const uploadSuccess = await uploadFile(selectedFile, language);

        if (uploadSuccess) {
            const moduleData = {
                fld_name: moduleTitle,
                fld_fileName: selectedFile.name,
                fld_language: language,
                fld_uploadedAt: new Date().toISOString(),
                fld_userId: userId
            };

            await addDoc(collection(db, "tbl_modules"), moduleData);

            alert("Module uploaded successfully!");
            uploadForm.reset();
            dropArea.textContent = "Drag and drop your PDF file here or click to select";
            popup.style.display = "none";
        } else {
            alert("Error uploading file to server.");
        }
    } catch (error) {
        console.error("Error uploading module:", error);
        alert(`Error uploading module: ${error.message}`);
    }
});

async function uploadFile(file, language) {
    return new Promise((resolve, reject) => {
        const formData = new FormData();
        formData.append("file", file);
        formData.append("language", language);

        const xhttp = new XMLHttpRequest();
        xhttp.open("POST", "ajaxfile.php", true);

        xhttp.onreadystatechange = function() {
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
