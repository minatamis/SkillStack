import { initializeApp } from "https://www.gstatic.com/firebasejs/11.0.1/firebase-app.js";
import { getFirestore, doc, getDoc, collection, addDoc } from "https://www.gstatic.com/firebasejs/11.0.1/firebase-firestore.js";

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

// Initialize Firebase and Firestore
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

// Fetch the logged-in user's name and populate the input field
async function populateUserName() {
    const userId = localStorage.getItem('loggedInUserId'); // Retrieve user ID from localStorage

    if (userId) {
        try {
            const userDocRef = doc(db, "tbl_users", userId); // Reference to the user's document
            const userDocSnap = await getDoc(userDocRef);

            if (userDocSnap.exists()) {
                const userData = userDocSnap.data();
                const nameField = document.querySelector("#name");
                const mailField = document.querySelector("#email");

                if (nameField) {
                    nameField.value = `${userData.fld_firstName} ${userData.fld_lastName}`;
                    mailField.value = `${userData.fld_email}`;
                }
            } else {
                console.error("No user document found!");
            }
        } catch (error) {
            console.error("Error fetching user data:", error);
        }
    } else {
        console.error("User ID not found in localStorage.");
    }
}

// Function to handle form submission
document.addEventListener("DOMContentLoaded", () => {
    populateUserName(); // Populate the name field when the page loads

    const contactForm = document.querySelector("#contact-form");

    if (contactForm) {
        contactForm.addEventListener("submit", async (event) => {
            event.preventDefault(); // Prevent form's default submission

            const name = document.querySelector("#name").value;
            const email = document.querySelector("#email").value;
            const phone = document.querySelector("#phone").value || "Not provided";
            const message = document.querySelector("#message").value;

            try {
                // Add an email document to Firestore
                await addDoc(collection(db, "tbl_mail"), {
                    to: "skillstackservice@gmail.com", // Destination email
                    message: {
                        subject: `New Message from ${name}`, // Subject of the email
                        text: `Name: ${name}\nEmail: ${email}\nPhone: ${phone}\nMessage: ${message}`, // Plain text body
                        html: `
                            <p><strong>Name:</strong> ${name}</p>
                            <p><strong>Email:</strong> ${email}</p>
                            <p><strong>Phone:</strong> ${phone}</p>
                            <p><strong>Message:</strong></p>
                            <p>${message}</p>
                        ` // HTML body
                    }
                });

                alert("Your message has been sent successfully!");
                contactForm.reset();
            } catch (error) {
                console.error("Error sending message:", error);
                alert("Failed to send your message. Please try again.");
            }
        });
    }
});
