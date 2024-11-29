import { initializeApp } from "https://www.gstatic.com/firebasejs/11.0.1/firebase-app.js";
import { getFirestore, collection, addDoc, doc, getDoc, getDocs, query, where, orderBy } from "https://www.gstatic.com/firebasejs/11.0.1/firebase-firestore.js";

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

window.loadInitialChatResponse = async function() {
    try {
        avaFirstChat();

        const userId = localStorage.getItem('loggedInUserId');
        const querySnapshot = await getMessagesByUser(userId);

        querySnapshot.forEach(doc => {
            const data = doc.data();
            appendMessage(data.fld_prompt, 'user');
            appendMessage(data.fld_response, 'bot');
        });

    } catch (error) {
        console.error("Error fetching initial chat response:", error);
    }
};

async function getMessagesByUser(userId) {
    const messagesRef = collection(db, "tbl_messages");
    const q = query(messagesRef, 
      where("fld_userId", "==", userId), 
      orderBy("createTime")
    );
    const querySnapshot = await getDocs(q);
    return querySnapshot;
  }

async function avaFirstChat()
{
    try {
        const docRef = doc(db, "tbl_messages", "9xFrtlC1bZUtwaZTHRpQ");
        const docSnap = await getDoc(docRef);

        if (docSnap.exists()) {
            const initialResponse = docSnap.data().fld_response;
            appendMessage(`${initialResponse}`, 'bot');
        } else {
            console.error("Document not found!");
        }
    } catch (error) {
        console.error("Error fetching initial chat response:", error);
    }
}

class ChatHead extends HTMLElement {
    connectedCallback() {
        this.innerHTML = `
        <div class="chat-container">
            <div class="chat-head" id="chat-head" onclick="window.toggleChatbox()">
                <img src="../assets/images/ava.gif" alt="Chatbot Icon">
            </div>
            <div class="chatbox" id="chatbox">
                <div class="chatbox-header">
                    <span class="bot-name">AVA</span>
                    <button class="close-btn" onclick="window.closeChat()">
                        <img src="../assets/images/close.png" alt="Close" class="close-icon">
                    </button>
                </div>
                <div class="chat-messages" id="chat-messages"></div>
                <div class="chat-input">
                    <input type="text" id="user-input" placeholder="Type a message...">
                    <button id="send-btn" onclick="window.sendMessage()">
                        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <path fill="currentColor" d="M4 4v16l16-8z"/>
                        </svg>
                    </button>
                </div>
            </div>
        </div>
        `;
        if (typeof window.loadInitialChatResponse === 'function') {
            window.loadInitialChatResponse();
        }
    }
}

customElements.define('chat-head', ChatHead);

window.toggleChatbox = function() {
    const chatbox = document.getElementById('chatbox');
    chatbox.classList.toggle('active');
};

window.closeChat = function() {
    const chatbox = document.getElementById('chatbox');
    chatbox.classList.remove('active');
};

window.sendMessage = async function () {
    const userInput = document.getElementById('user-input');
    const userMessage = userInput.value.trim();
    const userId = localStorage.getItem('loggedInUserId');

    if (userMessage !== "") {
        appendMessage(userMessage, 'user');

        const typingMessage = appendMessage("Bot is typing...", 'bot', true);

        try {
            const docRef = await addDoc(collection(db, "tbl_messages"), {
                fld_prompt: userMessage,
                fld_userId: userId
            });

            console.log("Document written with ID:", docRef.id);

            const intervalId = setInterval(async () => {
                try {
                    const savedDoc = await getDoc(docRef);

                    if (savedDoc.exists()) {
                        const botResponse = savedDoc.data().fld_response;

                        if (botResponse) {
                            typingMessage.textContent = `${botResponse}`;
                            clearInterval(intervalId); 

                            clearTimeout(timeout);
                        }
                    } else {
                        console.warn("Document does not exist yet.");
                    }
                } catch (error) {
                    console.error("Error fetching document during polling:", error);
                }
            }, 500);

            const timeout = setTimeout(() => {
                clearInterval(intervalId);
                typingMessage.textContent = "Sorry, the response is taking too long.";
                console.error("Polling timed out after 10 seconds.");
            }, 10000);

        } catch (error) {
            console.error("Error adding or fetching message from Firestore:", error);
            typingMessage.textContent = "Sorry, something went wrong!";
        }

        userInput.value = "";
    }
};


function scrollToBottom() {
    const chatMessages = document.getElementById('chat-messages');
    if (chatMessages) {
        chatMessages.scrollTop = chatMessages.scrollHeight;
    }
}

function appendMessage(message, sender, temporary = false) {
    const chatMessages = document.getElementById('chat-messages');
    const messageDiv = document.createElement('div');
    messageDiv.classList.add('chat-message', sender === 'user' ? 'user-message' : 'bot-message');
    messageDiv.textContent = message;
    chatMessages.appendChild(messageDiv);

    scrollToBottom();

    return temporary ? messageDiv : null;
}


document.getElementById('user-input').addEventListener('keydown', function(event) {
    if (event.key === 'Enter') {
        event.preventDefault();
        window.sendMessage();
    }
});