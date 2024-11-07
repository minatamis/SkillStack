function toggleChatbox() {
    const chatbox = document.getElementById('chatbox');
    chatbox.style.display = chatbox.style.display === 'none' || chatbox.style.display === '' ? 'block' : 'none';
}

class ChatHead extends HTMLElement {
    connectedCallback() {
        this.innerHTML = `
        <div class="chatbot-icon" onclick="toggleChatbox()">
            <img src="../assets/images/ava.gif" alt="Chatbot Icon"> 
        </div>

        <div class="chatbox" id="chatbox">
            <div class="chatbox-header">
                <h3>StackBot</h3>
                <button onclick="toggleChatbox()">
                    <img src="../assets/images/close.png" alt="Close">
                </button>
            </div>
            <div class="chatbox-body">
                <p>How may I help you today?</p>
            </div>
            <div class="chatbox-footer">
                <input type="text" placeholder="Type your message...">
                <button class="send-button">
                    <img src="../assets/images/send.png" alt="Send" />
                </button>
            </div>
            
        </div>
        `;
    }
}

customElements.define('chat-head', ChatHead)