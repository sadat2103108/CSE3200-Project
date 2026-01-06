// DOM Elements
const chatMessages = document.getElementById('chatMessages');
const userInput = document.getElementById('userInput');
const messageForm = document.getElementById('messageForm');
const sendBtn = document.getElementById('sendBtn');

// Auto-resize textarea
userInput.addEventListener('input', function() {
  this.style.height = 'auto';
  this.style.height = Math.min(this.scrollHeight, 120) + 'px';
});

// Handle Enter key (send message) and Shift+Enter (new line)
userInput.addEventListener('keydown', function(e) {
  if (e.key === 'Enter' && !e.shiftKey) {
    e.preventDefault();
    messageForm.dispatchEvent(new Event('submit'));
  }
});

// Handle form submission
messageForm.addEventListener('submit', async (e) => {
  e.preventDefault();
  
  const message = userInput.value.trim();
  
  if (!message) return;
  
  // Clear input
  userInput.value = '';
  userInput.style.height = 'auto';
  
  // Add user message to chat
  addMessageToChat(message, 'user');
  
  // Disable send button and show loading
  sendBtn.disabled = true;
  showLoadingIndicator();
  
  try {
    // Send to backend
    const response = await fetch('/api/bot/send-message', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ prompt: message })
    });
    
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    
    const data = await response.json();
    
    // Remove loading indicator
    removeLoadingIndicator();
    
    if (data.success && data.data.user_reply) {
      // Add bot response to chat
      addMessageToChat(data.data.user_reply, 'bot');
    } else {
      addMessageToChat('Error: No response from bot', 'bot');
    }
    
  } catch (error) {
    console.error('Error:', error);
    removeLoadingIndicator();
    addMessageToChat(`Error: ${error.message}`, 'bot');
  } finally {
    sendBtn.disabled = false;
    userInput.focus();
  }
});

// Add message to chat display
function addMessageToChat(message, sender) {
  const messageItem = document.createElement('div');
  messageItem.className = `message-item ${sender}`;
  
  const messageText = document.createElement('p');
  messageText.textContent = message;
  
  messageItem.appendChild(messageText);
  chatMessages.appendChild(messageItem);
  
  // Scroll to bottom
  scrollToBottom();
}

// Show loading indicator
function showLoadingIndicator() {
  const messageItem = document.createElement('div');
  messageItem.className = 'message-item loading';
  messageItem.id = 'loadingIndicator';
  
  const messageText = document.createElement('p');
  messageText.innerHTML = `
    Thinking
    <span class="typing-dots">
      <span class="typing-dot"></span>
      <span class="typing-dot"></span>
      <span class="typing-dot"></span>
    </span>
  `;
  
  messageItem.appendChild(messageText);
  chatMessages.appendChild(messageItem);
  
  scrollToBottom();
}

// Remove loading indicator
function removeLoadingIndicator() {
  const loader = document.getElementById('loadingIndicator');
  if (loader) {
    loader.remove();
  }
}

// Scroll to bottom of chat
function scrollToBottom() {
  chatMessages.scrollTop = chatMessages.scrollHeight;
}

// Focus input on page load
userInput.focus();
