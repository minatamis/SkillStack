import { initializeApp } from "https://www.gstatic.com/firebasejs/11.0.1/firebase-app.js";
import {getAuth, onAuthStateChanged, signOut} from "https://www.gstatic.com/firebasejs/11.0.1/firebase-auth.js";
import{getFirestore, getDoc, doc} from "https://www.gstatic.com/firebasejs/11.0.1/firebase-firestore.js";

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

const auth=getAuth();
const db=getFirestore();

onAuthStateChanged(auth, (user)=>{
  const loggedInUserId=localStorage.getItem('loggedInUserId');
  if(loggedInUserId){
      console.log(user);
      const docRef = doc(db, "tbl_users", loggedInUserId);
      getDoc(docRef)
      .then((docSnap)=>{
          if(docSnap.exists()){
              const userData=docSnap.data();
              document.getElementById('loggedUserFName').innerText=userData.fld_firstName;
              document.getElementById('loggedUserLName').innerText=userData.fld_lastName;

          }
          else{
              console.log("no document found matching id");
          }
      })
      .catch((error)=>{
          console.log("Error getting document");
      })
  }
  else{
      console.log("User Id not Found in Local storage");
  }
});

const logoutButton=document.getElementById('logout');

logoutButton.addEventListener('click',()=>{
  localStorage.removeItem('loggedInUserId');
  signOut(auth)
  .then(()=>{
      window.location.href='../index.html';
  })
  .catch((error)=>{
      console.error('Error Signing out:', error);
  })
});
