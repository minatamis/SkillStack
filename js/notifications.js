import { initializeApp } from "https://www.gstatic.com/firebasejs/11.0.1/firebase-app.js";
import { getFirestore, collection, query, where, getDocs, doc, getDoc } from "https://www.gstatic.com/firebasejs/11.0.1/firebase-firestore.js";

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
const db = getFirestore(app);

async function fetchNotifications() {
    try {
        // Check if 'notif=true' is in the URL
        const urlParams = new URLSearchParams(window.location.search);
        const showNotif = urlParams.get("notif") === "true";
        if (!showNotif) return; // Exit if notif is not true

        const userId = localStorage.getItem("loggedInUserId");
        if (!userId) {
            console.error("No user is logged in.");
            return;
        }

        const oneDayAgo = new Date();
        oneDayAgo.setDate(oneDayAgo.getDate() - 1);

        console.log("Fetching lesson contents uploaded after:", oneDayAgo);

        // Fetch lesson contents (but filter manually since Firestore can't compare string dates)
        const lessonContentsQuery = query(collection(db, "tbl_lessonContents"));
        const lessonContentsSnap = await getDocs(lessonContentsQuery);

        const newContents = lessonContentsSnap.docs
            .map(doc => ({
                id: doc.id,
                ...doc.data()
            }))
            .filter(content => {
                if (!content.fld_uploadedAt) return false; // Skip if missing

                const uploadedDate = new Date(content.fld_uploadedAt); // Convert string to Date
                return uploadedDate > oneDayAgo; // Compare dates
            });

        console.log("New lesson contents fetched:", newContents);

        if (newContents.length === 0) {
            console.log("No new lesson contents found.");
            return;
        }

        // Fetch user progress
        const progressQuery = query(
            collection(db, "tbl_progress"),
            where("fld_userId", "==", userId)
        );
        const progressSnap = await getDocs(progressQuery);
        const userProgressIds = new Set(progressSnap.docs.map(doc => doc.data().fld_contentId));

        console.log("User progress content IDs:", userProgressIds);

        // Filter contents the user hasn't accessed
        const unreadContents = newContents.filter(content => !userProgressIds.has(content.id));

        if (unreadContents.length > 0) {
            let message = "";

            for (const content of unreadContents) {
                console.log("Fetching lesson name for:", content.fld_lessonId);
                const lessonDoc = await getDoc(doc(db, "tbl_lessons", content.fld_lessonId));
                const lessonName = lessonDoc.exists() ? lessonDoc.data().fld_lessonName : "Unknown Lesson";
                message += `${content.fld_contentName} in ${lessonName}\n`;
            }

            // Use SweetAlert instead of alert()
            swal({
                title: "📢 New Contents are available. Check it out now!",
                text: message,
                icon: "info",
                buttons: ["Close", "View Now"]
            }).then((viewNow) => {
                if (viewNow) {
                    window.location.href = "tutorials.html";
                }
            });
        } else {
            console.log("No new unread contents for the user.");
        }

    } catch (error) {
        console.error("Error fetching notifications:", error);
    }
}

// Call the function
fetchNotifications();