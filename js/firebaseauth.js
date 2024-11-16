import { initializeApp } from "https://www.gstatic.com/firebasejs/11.0.1/firebase-app.js";
import { getAnalytics } from "https://www.gstatic.com/firebasejs/11.0.1/firebase-analytics.js";
import { getAuth, createUserWithEmailAndPassword, signInWithEmailAndPassword, sendEmailVerification, sendPasswordResetEmail  } from "https://www.gstatic.com/firebasejs/11.0.1/firebase-auth.js";
import { getFirestore, setDoc, doc } from "https://www.gstatic.com/firebasejs/11.0.1/firebase-firestore.js";

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
const analytics = getAnalytics(app);

function showMessage(message, divId) {
    var messageDiv = document.getElementById(divId);
    messageDiv.style.display = "block";
    messageDiv.innerHTML = message;
    messageDiv.style.opacity = 1;
    setTimeout(function () {
        messageDiv.style.opacity = 0;
    }, 5000);
}

function validatePassword(password) {
    const regex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).{8,}$/;
    return regex.test(password);
}

const signUp = document.getElementById('submitSignUp');
signUp.addEventListener('click', (event) => {
    event.preventDefault();
    const email = document.getElementById('rEmail').value;
    const password = document.getElementById('rPassword').value;
    const firstName = document.getElementById('fName').value;
    const lastName = document.getElementById('lName').value;
    const teacherId = document.getElementById('teacherId').value;

    const auth = getAuth();
    const db = getFirestore();

    if (!validatePassword(password)) {
        showMessage('Password must be at least 8 characters long, with at least one uppercase letter, one lowercase letter, and one number.', 'signUpMessage');
        return;
    }

    

    createUserWithEmailAndPassword(auth, email, password)
        .then((userCredential) => {
            const user = userCredential.user;
            
            sendEmailVerification(user)
                .then(() => {
                    showMessage('Verification email sent. Please check your inbox.', 'signUpMessage');
                })
                .catch((error) => {
                    console.error("Error sending verification email", error);
                    showMessage('Unable to send verification email', 'signUpMessage');
                });

            const userData = {
                fld_email: email,
                fld_firstName: firstName,
                fld_lastName: lastName,
                fld_isTeacher: false,
                fld_teacherId: teacherId ? teacherId : null
            };

            const docRef = doc(db, "tbl_users", user.uid);
            setDoc(docRef, userData)
                .then(() => {
                    window.location.href = 'index.html';
                })
                .catch((error) => {
                    console.error("Error writing document", error);
                    showMessage('Unable to save user data', 'signUpMessage');
                });
        })
        .catch((error) => {
            const errorCode = error.code;
            if (errorCode === 'auth/email-already-in-use') {
                showMessage('Email Address Already Exists !!!', 'signUpMessage');
            } else {
                showMessage('Unable to create user', 'signUpMessage');
            }
        });
});

const signIn = document.getElementById('submitSignIn');
signIn.addEventListener('click', (event) => {
    event.preventDefault();
    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;

    const auth = getAuth();

    signInWithEmailAndPassword(auth, email, password)
        .then((userCredential) => {
            const user = userCredential.user;
            if (user.emailVerified) {
                showMessage('Login successful', 'signInMessage');
                localStorage.setItem('loggedInUserId', user.uid);
                window.location.href = 'html/home.html';
            } else {
                showMessage('Please verify your email before logging in.', 'signInMessage');
            }
        })
        .catch((error) => {
            const errorCode = error.code;
            if (errorCode === 'auth/invalid-credential') {
                showMessage('Incorrect Email or Password', 'signInMessage');
            } else {
                showMessage('Account does not Exist', 'signInMessage');
            }
        });
});

//for forgot password
const forgotPasswordLink = document.getElementById('forgotPasswordLink');
const resetPasswordButton = document.getElementById('resetPasswordButton');

forgotPasswordLink.addEventListener('click', () => {
    document.getElementById('forgotPasswordDiv').style.display = 'block';
});

resetPasswordButton.addEventListener('click', () => {
    const email = document.getElementById('forgotPasswordEmail').value;
    const auth = getAuth();

    sendPasswordResetEmail(auth, email)
        .then(() => {
            showMessage('Password reset email sent. Check your inbox.', 'resetPasswordMessage');
        })
        .catch((error) => {
            console.error("Error sending reset email", error);
            showMessage('Error: Unable to send reset email', 'resetPasswordMessage');
        });
});