// script.js - Frontend JavaScript for the chat interface

// Generate a unique session ID for this user session
const sessionId = 'session_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9);

// DOM elements
const messageInput = document.getElementById('messageInput');
const sendButton = document.getElementById('sendButton');
const voiceButton = document.getElementById('voiceButton');
const chatMessages = document.getElementById('chatMessages');
const loading = document.getElementById('loading');

// Worker endpoint (update this to your deployed Worker URL)
const WORKER_URL = 'https://your-worker-url.workers.dev/chat'; // Replace with actual URL

// Event listeners
sendButton.addEventListener('click', sendMessage);
messageInput.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') {
        sendMessage();
    }
});
voiceButton.addEventListener('click', startVoiceInput);

// Send message to AI
async function sendMessage() {
    const message = messageInput.value.trim();
    if (!message) return;

    // Clear input
    messageInput.value = '';

    // Add user message to chat
    addMessage('user', message);

    // Show loading
    loading.style.display = 'block';

    try {
        // Send to Worker
        const response = await fetch(WORKER_URL, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                message: message,
                sessionId: sessionId
            }),
        });

        const data = await response.json();

        if (data.error) {
            addMessage('ai', 'Error: ' + data.error);
        } else {
            addMessage('ai', data.response);
        }
    } catch (error) {
        console.error('Error sending message:', error);
        addMessage('ai', 'Sorry, there was an error processing your message.');
    } finally {
        // Hide loading
        loading.style.display = 'none';
    }
}

// Add message to chat display
function addMessage(sender, content) {
    const messageDiv = document.createElement('div');
    messageDiv.className = `message ${sender}-message`;
    messageDiv.textContent = content;
    chatMessages.appendChild(messageDiv);

    // Scroll to bottom
    chatMessages.scrollTop = chatMessages.scrollHeight;
}

// Voice input using Web Speech API
function startVoiceInput() {
    if (!('webkitSpeechRecognition' in window) && !('SpeechRecognition' in window)) {
        alert('Voice input is not supported in this browser.');
        return;
    }

    const recognition = new (window.SpeechRecognition || window.webkitSpeechRecognition)();
    recognition.lang = 'en-US';
    recognition.interimResults = false;
    recognition.maxAlternatives = 1;

    recognition.onstart = () => {
        voiceButton.textContent = '🎤 Listening...';
        voiceButton.disabled = true;
    };

    recognition.onresult = (event) => {
        const transcript = event.results[0][0].transcript;
        messageInput.value = transcript;
        sendMessage();
    };

    recognition.onerror = (event) => {
        console.error('Speech recognition error:', event.error);
        alert('Voice input failed. Please try again.');
    };

    recognition.onend = () => {
        voiceButton.textContent = '🎤 Voice';
        voiceButton.disabled = false;
    };

    recognition.start();
}

// Initialize chat with welcome message
addMessage('ai', 'Hello! I\'m your AI assistant. How can I help you today?');