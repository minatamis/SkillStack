import { initializeApp } from "https://www.gstatic.com/firebasejs/11.0.1/firebase-app.js";
import { getStorage, ref, uploadBytes, getDownloadURL } from "https://www.gstatic.com/firebasejs/11.0.1/firebase-storage.js";
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
const db = getFirestore(app);
const storage = getStorage(app);

const uploadForm = document.getElementById("uploadForm");
const dropArea = document.getElementById("dropArea");
const moduleTitle = document.getElementById("moduleTitle");
const languageSelect = document.getElementById("language");
let selectedFile;

// Handle drag-and-drop
dropArea.addEventListener("dragover", (e) => {
  e.preventDefault();
  dropArea.classList.add("dragging");
});

dropArea.addEventListener("dragleave", () => {
  dropArea.classList.remove("dragging");
});

dropArea.addEventListener("drop", (e) => {
  e.preventDefault();
  dropArea.classList.remove("dragging");
  selectedFile = e.dataTransfer.files[0];
  if (!selectedFile.type.startsWith("image/")) {
    alert("Only image files are allowed.");
    selectedFile = null;
  } else {
    dropArea.textContent = `File Selected: ${selectedFile.name}`;
  }
});

dropArea.addEventListener("click", () => {
  const fileInput = document.createElement("input");
  fileInput.type = "file";
  fileInput.accept = "image/*";
  fileInput.click();
  fileInput.onchange = () => {
    selectedFile = fileInput.files[0];
    if (!selectedFile.type.startsWith("image/")) {
      alert("Only image files are allowed.");
      selectedFile = null;
    } else {
      dropArea.textContent = `File Selected: ${selectedFile.name}`;
    }
  };
});

// Handle form submission
uploadForm.addEventListener("submit", async (e) => {
  e.preventDefault();

  if (!selectedFile) {
    alert("Please select an image file.");
    return;
  }

  const moduleName = moduleTitle.value.trim();
  const language = languageSelect.value;

  if (!moduleName) {
    alert("Please enter a module title.");
    return;
  }

  try {
    // Upload image to Firebase Storage
    const fileRef = ref(storage, `images/${selectedFile.name}`);
    await uploadBytes(fileRef, selectedFile);
    const fileURL = await getDownloadURL(fileRef);

    // Save metadata to Firestore
    await addDoc(collection(db, "images"), {
      title: moduleName,
      language,
      fileURL,
      uploadedAt: new Date()
    });

    alert("Image uploaded successfully!");
    uploadForm.reset();
    dropArea.textContent = "Drag and drop your image file here or click to select";
    selectedFile = null;
  } catch (error) {
    console.error("Error uploading image:", error);
    alert("Failed to upload image. Please try again.");
  }
});

// const app = initializeApp(firebaseConfig);
// const storage = getStorage();
// const db = getFirestore();

// const addModuleBtn = document.getElementById("addModuleBtn");
// const popup = document.getElementById("popup");
// const dropArea = document.getElementById("dropArea");
// const closePopup = document.getElementById("closePopup");
// const uploadForm = document.getElementById("uploadForm");

// let selectedFile = null;

// addModuleBtn.addEventListener("click", () => {
//     popup.style.display = "block";
// });

// closePopup.addEventListener("click", () => {
//     popup.style.display = "none";
// });

// dropArea.addEventListener("dragover", (e) => {
//     e.preventDefault();
//     dropArea.classList.add("drag-over");
// });

// dropArea.addEventListener("dragleave", () => {
//     dropArea.classList.remove("drag-over");
// });

// dropArea.addEventListener("drop", (e) => {
//     e.preventDefault();
//     dropArea.classList.remove("drag-over");
//     const file = e.dataTransfer.files[0];
//     handleFile(file);
// });

// dropArea.addEventListener("click", () => {
//     const fileInput = document.createElement("input");
//     fileInput.type = "file";
//     fileInput.accept = ".pdf";
//     fileInput.click();

//     fileInput.addEventListener("change", (e) => {
//         const file = e.target.files[0];
//         handleFile(file);
//     });
// });

// function handleFile(file) {
//     if (file && file.type === "application/pdf") {
//         selectedFile = file;
//         dropArea.textContent = `Selected file: ${file.name}`;
//     } else {
//         alert("Please upload a valid PDF file.");
//     }
// }

// uploadForm.addEventListener("submit", async (e) => {
//     e.preventDefault();

//     const moduleTitle = document.getElementById("moduleTitle").value;
//     const language = document.getElementById("language").value;
//     const uploaderId = localStorage.getItem("loggedInUserId");

//     if (!selectedFile) {
//         alert("Please select a PDF file.");
//         return;
//     }

//     if (!moduleTitle || !language) {
//         alert("Please fill in all fields.");
//         return;
//     }

//     try {
//         const storageRef = ref(storage, `modules/${language}/${selectedFile.name}`);
//         const snapshot = await uploadBytes(storageRef, selectedFile);
//         const downloadURL = await getDownloadURL(snapshot.ref);

//         const moduleData = {
//             fld_moduleTitle: moduleTitle,
//             fld_language: language,
//             fld_uploaderId: uploaderId,
//             fld_uploadedAt: new Date(),
//             fld_downloadURL: downloadURL
//         };

//         await addDoc(collection(db, "tbl_modules"), moduleData);

//         alert("Module uploaded successfully!");
//         uploadForm.reset();
//         dropArea.textContent = "Drag and drop your PDF file here or click to select";
//         popup.style.display = "none";
//     } catch (error) {
//         console.error("Error uploading module:", error);
//         alert("Error uploading module. Please try again.");
//     }
// });
