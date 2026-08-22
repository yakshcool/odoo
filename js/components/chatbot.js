/* ==========================================================================
   GlobeTrotter AI Assistant & Customer Support Chatbot Widget
   ========================================================================== */

import { db } from '../db.js';

export function renderChatbotWidget() {
  const container = document.createElement('div');
  container.id = 'ai-chatbot-widget';

  container.innerHTML = `
    <!-- Floating Chat Toggle Button -->
    <button id="chatbot-toggle-btn" class="chatbot-trigger-btn" title="AI Support & Assistant">
      <i class="fa-solid fa-robot"></i>
      <span>AI Assistant</span>
    </button>

    <!-- Slide-Out Right Chat Panel -->
    <div id="chatbot-panel" class="chatbot-panel">
      <!-- Chat Header -->
      <div class="chatbot-header">
        <div style="display: flex; align-items: center; gap: 0.75rem;">
          <div class="chatbot-avatar">
            <i class="fa-solid fa-wand-magic-sparkles"></i>
          </div>
          <div>
            <h4 style="color: white; font-size: 1rem; margin: 0;">GlobeTrotter AI Support</h4>
            <span style="font-size: 0.75rem; color: #10b981; display: flex; align-items: center; gap: 0.35rem;">
              <span style="width: 8px; height: 8px; border-radius: 50%; background: #10b981; display: inline-block;"></span> Online 24/7
            </span>
          </div>
        </div>
        <button id="chatbot-close-btn" class="btn btn-ghost btn-icon" style="color: #94a3b8;"><i class="fa-solid fa-xmark"></i></button>
      </div>

      <!-- Quick Prompt Suggestion Chips -->
      <div class="chatbot-chips-bar">
        <button class="chat-chip" onclick="window.sendQuickChatPrompt('Recommend top activities in Paris')">💡 Paris Activities</button>
        <button class="chat-chip" onclick="window.sendQuickChatPrompt('Check my remaining budget')">💰 Check Budget</button>
        <button class="chat-chip" onclick="window.sendQuickChatPrompt('How do I add a destination city?')">📍 How to add city</button>
        <button class="chat-chip" onclick="window.sendQuickChatPrompt('Suggest a Japan travel plan')">🌸 Japan Itinerary</button>
      </div>

      <!-- Messages Body -->
      <div id="chatbot-messages" class="chatbot-messages">
        <div class="chat-message bot-msg">
          <div class="chat-bubble">
            👋 Hello! I am your <strong>GlobeTrotter AI Support & Travel Assistant</strong>. How can I help you plan your journey today?
          </div>
          <span class="chat-time">Just now</span>
        </div>
      </div>

      <!-- Typing Indicator -->
      <div id="chatbot-typing" class="typing-indicator" style="display: none;">
        <span></span><span></span><span></span> AI is thinking...
      </div>

      <!-- Input Bar -->
      <div class="chatbot-input-bar">
        <input type="text" id="chatbot-input" placeholder="Ask AI about trips, cities, budget..." autocomplete="off">
        <button id="chatbot-send-btn" class="btn btn-primary btn-icon"><i class="fa-solid fa-paper-plane"></i></button>
      </div>
    </div>
  `;

  setTimeout(() => {
    attachChatEvents(container);
  }, 0);

  return container;
}

function attachChatEvents(container) {
  const toggleBtn = container.querySelector('#chatbot-toggle-btn');
  const panel = container.querySelector('#chatbot-panel');
  const closeBtn = container.querySelector('#chatbot-close-btn');
  const sendBtn = container.querySelector('#chatbot-send-btn');
  const input = container.querySelector('#chatbot-input');
  const messagesContainer = container.querySelector('#chatbot-messages');
  const typingIndicator = container.querySelector('#chatbot-typing');

  const togglePanel = () => panel.classList.toggle('active');
  if (toggleBtn) toggleBtn.onclick = togglePanel;
  if (closeBtn) closeBtn.onclick = () => panel.classList.remove('active');

  const handleSend = () => {
    const text = input.value.trim();
    if (!text) return;

    appendMessage(messagesContainer, text, 'user');
    input.value = '';

    // Show typing animation
    typingIndicator.style.display = 'flex';
    messagesContainer.scrollTop = messagesContainer.scrollHeight;

    setTimeout(() => {
      typingIndicator.style.display = 'none';
      const botResponse = generateAIResponse(text);
      appendMessage(messagesContainer, botResponse, 'bot');
    }, 1000);
  };

  if (sendBtn) sendBtn.onclick = handleSend;
  if (input) {
    input.onkeypress = (e) => {
      if (e.key === 'Enter') handleSend();
    };
  }

  window.sendQuickChatPrompt = (promptText) => {
    if (!panel.classList.contains('active')) panel.classList.add('active');
    input.value = promptText;
    handleSend();
  };
}

function appendMessage(container, text, sender) {
  const msgDiv = document.createElement('div');
  msgDiv.className = `chat-message ${sender === 'user' ? 'user-msg' : 'bot-msg'}`;
  
  const timeStr = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

  msgDiv.innerHTML = `
    <div class="chat-bubble">${text}</div>
    <span class="chat-time">${timeStr}</span>
  `;

  container.appendChild(msgDiv);
  container.scrollTop = container.scrollHeight;
}

function generateAIResponse(query) {
  const q = query.toLowerCase();
  const trips = db.getTrips();
  const user = db.getCurrentUser();

  if (q.includes('budget') || q.includes('cost') || q.includes('money')) {
    const activeTrip = trips[0];
    if (activeTrip) {
      const rem = activeTrip.budget - (activeTrip.estimated_cost || 0);
      return `📊 <strong>Budget Status for "${activeTrip.name}":</strong><br>Target Budget: $${activeTrip.budget.toLocaleString()}<br>Est. Cost: $${(activeTrip.estimated_cost || 0).toLocaleString()}<br>Remaining: <strong>$${rem.toLocaleString()}</strong> (${rem >= 0 ? 'Within budget ✅' : 'Over budget ⚠️'})`;
    }
    return `Your total budget across all ${trips.length} planned trips is <strong>$${trips.reduce((a, b) => a + b.budget, 0).toLocaleString()}</strong>.`;
  }

  if (q.includes('paris')) {
    return `🥐 <strong>Top Recommended Paris Experiences:</strong><br>1. <strong>Eiffel Tower Sunset Summit</strong> ($45)<br>2. <strong>Louvre Museum Guided Tour</strong> ($65)<br>3. <strong>Montmartre Pastry & Bakery Walk</strong> ($55)<br><br>You can click <em>"Discover Activities"</em> to add these to your itinerary!`;
  }

  if (q.includes('japan') || q.includes('tokyo') || q.includes('kyoto')) {
    return `🌸 <strong>Japan Explorer Recommendation:</strong><br>We recommend an 8-day route: <strong>Tokyo → Kyoto → Osaka</strong>.<br>Highlights: Shibuya Scramble, TeamLab Planets digital art, and Fushimi Inari shrine!`;
  }

  if (q.includes('add city') || q.includes('destination') || q.includes('how to add')) {
    return `📍 <strong>How to add a destination city:</strong><br>1. Open any trip from <strong>My Trips</strong>.<br>2. Click <strong>"+ Add Destination"</strong> on the left panel.<br>3. Search & select Paris, Rome, Tokyo, or Bali to auto-generate day slots!`;
  }

  if (q.includes('support') || q.includes('help') || q.includes('contact')) {
    return `🤝 Our GlobeTrotter support team is here to assist! You can edit trip dates, add custom expense lines in the <strong>Budget</strong> view, or generate a public share link anytime.`;
  }

  return `✨ I'm here to help you plan your multi-city trip, ${user.name}! You can ask me about destination recommendations in Paris or Tokyo, check your remaining trip budget, or get assistance navigating GlobeTrotter.`;
}
