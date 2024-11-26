import { initializeApp } from "https://www.gstatic.com/firebasejs/11.0.1/firebase-app.js";
import { getStorage, ref, uploadBytes } from "https://www.gstatic.com/firebasejs/11.0.1/firebase-storage.js";
import { getFirestore, doc, setDoc, serverTimestamp } from "https://www.gstatic.com/firebasejs/11.0.1/firebase-firestore.js";

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
const storage = getStorage(app);  // Firebase Storage instance
const db = getFirestore(app);  // Firestore instance

const addModuleBtn = document.getElementById('addModuleBtn');
const popup = document.getElementById('popup');
const dropArea = document.getElementById('dropArea');
const closePopup = document.getElementById('closePopup');
const languageSelect = document.getElementById('language'); // Select element for language

// Show the popup when the button is clicked
addModuleBtn.addEventListener('click', () => {
    popup.style.display = 'block';
});

// Close the popup
closePopup.addEventListener('click', () => {
    popup.style.display = 'none';
});

// Drag-and-drop functionality
dropArea.addEventListener('dragover', (e) => {
    e.preventDefault();
    dropArea.classList.add('drag-over');
});

dropArea.addEventListener('dragleave', () => {
    dropArea.classList.remove('drag-over');
});

dropArea.addEventListener('drop', (e) => {
    e.preventDefault();
    dropArea.classList.remove('drag-over');

    const file = e.dataTransfer.files[0];
    const language = languageSelect.value; // Get selected language
    const userId = localStorage.getItem('loggedInUserId');  // Get logged-in user ID

    if (file && file.type === "application/pdf" && language) {
        const storageRef = ref(storage, `modules/${language}/${file.name}`);

        // Upload file to Firebase Storage
        uploadBytes(storageRef, file)
            .then((snapshot) => {
                console.log('Uploaded file:', snapshot);
                
                // After file is uploaded, create a new record in Firestore
                const moduleRef = doc(db, "tbl_modules", snapshot.metadata.name);
                const moduleData = {
                    fld_moduleTitle: file.name,
                    fld_language: language,
                    fld_uploaderId: userId,
                    fld_uploadedAt: serverTimestamp()
                };

                return setDoc(moduleRef, moduleData);
            })
            .then(() => {
                alert('File uploaded successfully!');
                popup.style.display = 'none'; // Close popup after successful upload
            })
            .catch((error) => {
                console.error('Error uploading file:', error);
                alert('Error uploading file.');
            });
    } else {
        alert("Please upload a valid PDF file and select a language.");
    }
});

// Handle click on drop area to open file picker
dropArea.addEventListener('click', () => {
    const fileInput = document.createElement('input');
    fileInput.type = 'file';
    fileInput.accept = '.pdf';
    fileInput.click();

    fileInput.addEventListener('change', (e) => {
        const file = e.target.files[0];
        const language = languageSelect.value;
        const userId = localStorage.getItem('loggedInUserId');  // Get logged-in user ID

        if (file && file.type === "application/pdf" && language) {
            const storageRef = ref(storage, `modules/${language}/${file.name}`);

            // Upload file to Firebase Storage
            uploadBytes(storageRef, file)
                .then((snapshot) => {
                    console.log('Uploaded file:', snapshot);

                    // After file is uploaded, create a new record in Firestore
                    const moduleRef = doc(db, "tbl_modules", snapshot.metadata.name);
                    const moduleData = {
                        fld_moduleTitle: file.name,
                        fld_language: language,
                        fld_uploaderId: userId,
                        fld_uploadedAt: serverTimestamp()
                    };

                    return setDoc(moduleRef, moduleData);
                })
                .then(() => {
                    alert('File uploaded successfully!');
                    popup.style.display = 'none'; // Close popup after successful upload
                })
                .catch((error) => {
                    console.error('Error uploading file:', error);
                    alert('Error uploading file.');
                });
        } else {
            alert("Please upload a valid PDF file and select a language.");
        }
    });
});
