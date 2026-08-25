/**
 * NutriScan AI - NutriBot AI Conversational Chat View & Floating Widget
 */

import { store } from '../state.js';
import { ChatBotService } from '../services/chatBotService.js';

export class ChatBotView {
  static render(container) {
    const state = store.getState();
    const messages = state.chatMessages || [];

    container.innerHTML = `
      <div class="chatbot-view-wrapper animate-fade-in">
        <!-- View Header -->
        <div class="view-header-card glassmorphism">
          <div>
            <span class="badge badge-accent">🤖 NutriBot AI Assistant</span>
            <h2 class="view-title">Chat with Your Hostel Food Companion</h2>
            <p class="view-subtitle">
              Ask about late-night snacks, budget hacks, hostel mess swaps, or personalized nutrition advice.
            </p>
          </div>
        </div>

        <!-- Chat Container Card -->
        <div class="content-card glassmorphism chat-main-card">
          <!-- Quick Query Prompt Chips -->
          <div class="chat-quick-chips-row">
            <button class="chip-prompt-btn" data-q="Can I eat Maggi tonight within my budget and calories?">
              🍜 Can I eat Maggi tonight?
            </button>
            <button class="chip-prompt-btn" data-q="How do I hit 80g protein using only hostel food?">
              💪 Hit 80g protein from mess food?
            </button>
            <button class="chip-prompt-btn" data-q="Suggest a healthy late-night hostel snack under ₹30">
              🥗 Late-night snack under ₹30
            </button>
            <button class="chip-prompt-btn" data-q="Give me a ₹100 full day mess meal plan">
              💰 ₹100 Full Day Plan
            </button>
          </div>

          <!-- Chat Messages Scroll Container -->
          <div class="chat-messages-container" id="chat-messages-box">
            ${messages.map(m => this.renderMessage(m)).join('')}
          </div>

          <!-- Input Bar -->
          <div class="chat-input-bar">
            <input type="text" id="chat-input-field" class="chat-text-input" placeholder="Ask NutriBot about your meals, budget, or calories..." />
            <button id="btn-send-chat" class="btn btn-primary btn-send">
              <span>Send ➔</span>
            </button>
          </div>
        </div>
      </div>
    `;

    this.attachEvents(container);
    this.scrollToBottom(container);
  }

    const hasMealMention = isBot && (m.text.includes("Recommended") || m.text.includes("Protein") || m.text.includes("Snack") || m.text.includes("Plan"));

    return `
      <div class="chat-message-bubble ${isBot ? 'bot-bubble' : 'user-bubble'} animate-slide-up">
        <div class="bubble-avatar">${isBot ? '🤖' : '👤'}</div>
        <div class="bubble-content">
          <div class="bubble-meta">
            <span class="bubble-sender">${isBot ? 'NutriBot AI' : 'You'}</span>
            <span class="bubble-time">${m.time}</span>
          </div>
          <div class="bubble-text">${formattedText}</div>
          ${hasMealMention ? `
            <div class="chat-bubble-actions mt-2">
              <button class="btn btn-xs btn-primary btn-chat-action-plan" data-tab="planner">🍽️ View Optimized Combos</button>
              <button class="btn btn-xs btn-secondary btn-chat-action-streak" data-tab="streaks">💧 Log Water (+250ml)</button>
            </div>
          ` : ''}
        </div>
      </div>
    `;
  }

  static attachEvents(container) {
    const input = container.querySelector("#chat-input-field");
    const sendBtn = container.querySelector("#btn-send-chat");

    const doSend = async (questionText) => {
      const q = questionText || input.value.trim();
      if (!q) return;

      input.value = "";
      store.addChatMessage("user", q);
      this.refreshMessages(container);

      // Show typing indicator
      const messagesBox = container.querySelector("#chat-messages-box");
      const typingEl = document.createElement("div");
      typingEl.className = "chat-message-bubble bot-bubble typing-indicator-bubble";
      typingEl.innerHTML = `<div class="bubble-avatar">🤖</div><div class="bubble-content"><div class="typing-dots"><span></span><span></span><span></span></div></div>`;
      messagesBox.appendChild(typingEl);
      this.scrollToBottom(container);

      const state = store.getState();
      const botResponse = await ChatBotService.askNutriBot(q, state);

      typingEl.remove();
      store.addChatMessage("bot", botResponse);
      this.refreshMessages(container);
    };

    sendBtn?.addEventListener("click", () => doSend());
    input?.addEventListener("keydown", (e) => {
      if (e.key === "Enter") doSend();
    });

    container.querySelectorAll(".chip-prompt-btn").forEach(chip => {
      chip.addEventListener("click", (e) => {
        const q = e.currentTarget.dataset.q;
        doSend(q);
      });
    });

    this.attachBubbleActions(container);
  }

  static attachBubbleActions(container) {
    container.querySelectorAll(".btn-chat-action-plan").forEach(btn => {
      btn.addEventListener("click", () => {
        store.setTab("planner");
      });
    });

    container.querySelectorAll(".btn-chat-action-streak").forEach(btn => {
      btn.addEventListener("click", () => {
        store.addWater(250);
        store.setTab("streaks");
      });
    });
  }

  static refreshMessages(container) {
    const messagesBox = container.querySelector("#chat-messages-box");
    if (!messagesBox) return;
    const state = store.getState();
    messagesBox.innerHTML = (state.chatMessages || []).map(m => this.renderMessage(m)).join('');
    this.attachBubbleActions(container);
    this.scrollToBottom(container);
  }

  static scrollToBottom(container) {
    const box = container.querySelector("#chat-messages-box");
    if (box) {
      box.scrollTop = box.scrollHeight;
    }
  }
}
