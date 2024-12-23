class ChatHead extends HTMLElement {
    connectedCallback() {
        this.innerHTML = `
        <div class="chat-container">
            <div class="chat-head" id="chat-head" onclick="toggleChatbox()">
                <img src="../assets/images/ava.gif" alt="Chatbot Icon">
            </div>
            <div class="chatbox" id="chatbox">
                <!-- Chatbox Header -->
                <div class="chatbox-header">
                    <span class="bot-name">AVA</span>
                    <button class="close-btn" onclick="closeChat()">
                        <img src="../assets/images/close.png" alt="Close" class="close-icon">
                    </button>
                </div>
                <div class="chat-messages" id="chat-messages"></div>
                <div class="chat-input">
                    <input type="text" id="user-input" placeholder="Type a message...">
                    <button id="send-btn" onclick="sendMessage()">
                        <!-- SVG Icon for send button (can be changed) -->
                        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <path fill="currentColor" d="M4 4v16l16-8z"/>
                        </svg>
                    </button>
                </div>
            </div>
        </div>
        `;
    }
}

customElements.define('chat-head', ChatHead);

// Toggle chatbox visibility when chat head is clicked
function toggleChatbox() {
    const chatbox = document.getElementById('chatbox');
    chatbox.classList.toggle('active');
}

// Close the chatbox when "X" button is clicked
function closeChat() {
    const chatbox = document.getElementById('chatbox');
    chatbox.classList.remove('active');
}

// Function to send message
function sendMessage() {
    const userInput = document.getElementById('user-input');
    const userMessage = userInput.value.trim();

    if (userMessage !== "") {
        // Append the user's message
        appendMessage(userMessage, 'user');

        // Clear the input field
        userInput.value = "";

        // Simulate a bot response after a short delay
        setTimeout(() => {
            const botResponse = "Bot: " + getBotResponse();
            appendMessage(botResponse, 'bot');
        }, 1000);
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
