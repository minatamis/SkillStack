import { initializeApp } from "https://www.gstatic.com/firebasejs/11.0.1/firebase-app.js";
import { getFirestore, getDoc, doc, query, collection, where, getDocs, addDoc, serverTimestamp } from "https://www.gstatic.com/firebasejs/11.0.1/firebase-firestore.js";

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

const db = getFirestore();

// Function to send message
function sendMessage() {
    const userInput = document.getElementById('user-input');
    const userMessage = userInput.value.trim();
  
    if (userMessage !== "") {
      // Append the user's message
      appendMessage(userMessage, 'user');
  
      // Clear the input field
      userInput.value = "";
  
      // Upload user input to Firestore
      uploadUserMessage(userMessage);
  
      // Simulate a bot response after a short delay
      setTimeout(() => {
        const botResponse = "Bot: " + getBotResponse();
        appendMessage(botResponse, 'bot');
      }, 1000);
    }
  }
  
  // Upload user message to Firestore
  async function uploadUserMessage(message) {
    try {
      // Create a new document in the 'fld_messages' collection
      const docRef = await addDoc(collection(db, "fld_messages"), {
        fld_prompt: message,
      });
      console.log("Message uploaded successfully!", docRef.id);
    } catch (error) {
      console.error("Error uploading message:", error);
    }
  }

// Append message to the chat
function appendMessage(message, sender) {
    const chatMessages = document.getElementById('chat-messages');
    const messageDiv = document.createElement('div');
    messageDiv.classList.add('chat-message', sender === 'user' ? 'user-message' : 'bot-message');
    messageDiv.textContent = message;
    chatMessages.appendChild(messageDiv);

    // Scroll to the bottom
    chatMessages.scrollTop = chatMessages.scrollHeight;
}

// Get bot's response (this can be replaced with real logic later)
function getBotResponse() {
    return "I'm here to help! What can I do for you?";
}

// Add event listener to send message when pressing 'Enter'
document.getElementById('user-input').addEventListener('keydown', function(event) {
    if (event.key === 'Enter') {
        event.preventDefault(); // Prevent the default behavior of Enter (new line)
        sendMessage(); // Send the message
    }
});
