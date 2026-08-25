/**
 * NutriScan AI - Hostel Mode View
 * Ingests hostel notice board menus (OCR or Text), structures weekly schedule, and triggers meal plans.
 */

import { store } from '../state.js';
import { OcrMenuService } from '../services/ocrMenuService.js';
import { Helpers } from '../utils/helpers.js';

export class HostelModeView {
  static render(container) {
    const state = store.getState();
    const days = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"];
    const currentDay = state.selectedHostelDay || "Monday";
    const dayMenu = state.hostelMenu[currentDay] || {
      breakfast: ["Poha", "Milk", "Tea"],
      lunch: ["Rice", "Dal", "2 Roti", "Curd"],
      snacks: ["Chai", "Biscuits"],
      dinner: ["Rice", "Rajma", "2 Roti", "Salad"]
    };

    container.innerHTML = `
      <div class="hostel-mode-wrapper animate-fade-in">
        <!-- Header Banner -->
        <div class="view-header-card glassmorphism">
          <div>
            <span class="badge badge-accent">🏠 Hostel Mode</span>
            <h2 class="view-title">Weekly Mess Menu Intelligence</h2>
            <p class="view-subtitle">
              Turn your hostel notice board menu into personalized, budget-friendly and high-protein meal plans.
            </p>
          </div>
          <div class="header-actions">
            <button id="btn-open-menu-ocr" class="btn btn-primary">
              <span class="btn-icon">📸</span> Scan Menu Photo
            </button>
            <button id="btn-open-text-modal" class="btn btn-secondary glassmorphism">
              <span class="btn-icon">📝</span> Paste Menu Text
            </button>
          </div>
        </div>

        <!-- Hidden File Input for Menu Image -->
        <input type="file" id="hostel-menu-file-input" accept="image/*" class="hidden-input" />

        <!-- 7-Day Interactive Day Switcher Tabs -->
        <div class="day-tabs-scroll-row">
          ${days.map(day => `
            <button class="day-tab-btn ${day === currentDay ? 'active' : ''}" data-day="${day}">
              <span class="day-abbr">${day.slice(0, 3)}</span>
              <span class="day-name">${day}</span>
            </button>
          `).join('')}
        </div>

        <!-- Mess Schedule Card for Selected Day -->
        <div class="content-card glassmorphism mess-schedule-card">
          <div class="card-section-header">
            <div>
              <h3 class="section-title">📅 ${currentDay}'s Mess Schedule</h3>
              <p class="section-sub">Tap any item to edit, or add dishes served in your mess</p>
            </div>
            <button id="btn-generate-plan-from-menu" class="btn btn-primary-glow">
              <span>✨ Generate Meal Plan for ${currentDay}</span>
            </button>
          </div>

          <!-- Meal Categories Grid -->
          <div class="mess-meals-grid">
            <!-- Breakfast -->
            <div class="mess-meal-col" data-meal="breakfast">
              <div class="meal-col-header">
                <span class="meal-col-icon">🥣</span>
                <h4>Breakfast</h4>
                <span class="meal-time-hint">07:30 - 09:30 AM</span>
              </div>
              <div class="meal-items-chips-box" id="chips-breakfast">
                ${(dayMenu.breakfast || []).map(item => `
                  <span class="food-tag-chip" data-meal="breakfast" data-item="${item}">
                    ${item} <button class="btn-remove-tag" data-meal="breakfast" data-item="${item}">✕</button>
                  </span>
                `).join('')}
              </div>
              <div class="add-dish-input-row">
                <input type="text" class="input-dish" placeholder="Add dish (e.g. Boiled Eggs)" data-meal="breakfast" />
                <button class="btn-add-dish" data-meal="breakfast">➕</button>
              </div>
            </div>

            <!-- Lunch -->
            <div class="mess-meal-col" data-meal="lunch">
              <div class="meal-col-header">
                <span class="meal-col-icon">🍛</span>
                <h4>Lunch</h4>
                <span class="meal-time-hint">12:30 - 02:30 PM</span>
              </div>
              <div class="meal-items-chips-box" id="chips-lunch">
                ${(dayMenu.lunch || []).map(item => `
                  <span class="food-tag-chip" data-meal="lunch" data-item="${item}">
                    ${item} <button class="btn-remove-tag" data-meal="lunch" data-item="${item}">✕</button>
                  </span>
                `).join('')}
              </div>
              <div class="add-dish-input-row">
                <input type="text" class="input-dish" placeholder="Add dish (e.g. Paneer Butter Masala)" data-meal="lunch" />
                <button class="btn-add-dish" data-meal="lunch">➕</button>
              </div>
            </div>

            <!-- Snacks -->
            <div class="mess-meal-col" data-meal="snacks">
              <div class="meal-col-header">
                <span class="meal-col-icon">☕</span>
                <h4>Evening Snacks</h4>
                <span class="meal-time-hint">05:00 - 06:30 PM</span>
              </div>
              <div class="meal-items-chips-box" id="chips-snacks">
                ${(dayMenu.snacks || []).map(item => `
                  <span class="food-tag-chip" data-meal="snacks" data-item="${item}">
                    ${item} <button class="btn-remove-tag" data-meal="snacks" data-item="${item}">✕</button>
                  </span>
                `).join('')}
              </div>
              <div class="add-dish-input-row">
                <input type="text" class="input-dish" placeholder="Add snack (e.g. Samosa, Chai)" data-meal="snacks" />
                <button class="btn-add-dish" data-meal="snacks">➕</button>
              </div>
            </div>

            <!-- Dinner -->
            <div class="mess-meal-col" data-meal="dinner">
              <div class="meal-col-header">
                <span class="meal-col-icon">🌙</span>
                <h4>Dinner</h4>
                <span class="meal-time-hint">08:00 - 10:00 PM</span>
              </div>
              <div class="meal-items-chips-box" id="chips-dinner">
                ${(dayMenu.dinner || []).map(item => `
                  <span class="food-tag-chip" data-meal="dinner" data-item="${item}">
                    ${item} <button class="btn-remove-tag" data-meal="dinner" data-item="${item}">✕</button>
                  </span>
                `).join('')}
              </div>
              <div class="add-dish-input-row">
                <input type="text" class="input-dish" placeholder="Add dish (e.g. Rajma, Roti)" data-meal="dinner" />
                <button class="btn-add-dish" data-meal="dinner">➕</button>
              </div>
            </div>
          </div>
        </div>

        <!-- Text Paste Modal -->
        <div id="paste-menu-modal" class="modal-backdrop hidden">
          <div class="modal-card glassmorphism animate-scale-in">
            <div class="modal-header">
              <h3>Paste Hostel Menu Schedule</h3>
              <button id="btn-close-paste-modal" class="btn-close">✕</button>
            </div>
            <div class="modal-body">
              <p class="text-sm text-muted mb-2">
                Paste WhatsApp message or mess circular. The AI parser will automatically extract Days and Meal Categories.
              </p>
              <textarea id="textarea-menu-paste" class="form-textarea" rows="8" placeholder="MONDAY&#10;Breakfast: Poha, Milk, Tea&#10;Lunch: Rice, Dal, Aloo Sabzi, 2 Roti, Curd&#10;Dinner: Rice, Rajma, Mixed Veg, 2 Roti, Salad"></textarea>
            </div>
            <div class="modal-footer">
              <button id="btn-parse-pasted-menu" class="btn btn-primary">Parse & Update Menu</button>
            </div>
          </div>
        </div>
      </div>
    `;

    this.attachEvents(container);
  }

  static attachEvents(container) {
    // Day Tabs Switcher
    container.querySelectorAll(".day-tab-btn").forEach(btn => {
      btn.addEventListener("click", (e) => {
        const day = e.currentTarget.dataset.day;
        store.setSelectedHostelDay(day);
        this.render(container);
      });
    });

    // Scan Menu Photo OCR
    const fileInput = container.querySelector("#hostel-menu-file-input");
    container.querySelector("#btn-open-menu-ocr")?.addEventListener("click", () => {
      fileInput.click();
    });

    fileInput?.addEventListener("change", async (e) => {
      if (e.target.files && e.target.files[0]) {
        Helpers.showToast("Scanning hostel menu with AI OCR...", "info");
        await OcrMenuService.extractMenuFromImage(e.target.files[0]);
        Helpers.showToast("Hostel menu extracted & saved! ✨", "success");
        this.render(container);
      }
    });

    // Text Paste Modal Trigger
    const pasteModal = container.querySelector("#paste-menu-modal");
    container.querySelector("#btn-open-text-modal")?.addEventListener("click", () => {
      pasteModal.classList.remove("hidden");
    });

    container.querySelector("#btn-close-paste-modal")?.addEventListener("click", () => {
      pasteModal.classList.add("hidden");
    });

    container.querySelector("#btn-parse-pasted-menu")?.addEventListener("click", () => {
      const rawText = container.querySelector("#textarea-menu-paste").value;
      const parsed = OcrMenuService.parseMenuText(rawText);
      
      // Update store for all days
      Object.entries(parsed).forEach(([day, dayMenu]) => {
        store.setHostelMenuForDay(day, dayMenu);
      });

      pasteModal.classList.add("hidden");
      Helpers.showToast("Menu parsed & updated across all 7 days! 📅", "success");
      this.render(container);
    });

    // Remove Tag Item
    container.querySelectorAll(".btn-remove-tag").forEach(btn => {
      btn.addEventListener("click", (e) => {
        const meal = e.currentTarget.dataset.meal;
        const itemToRemove = e.currentTarget.dataset.item;
        const state = store.getState();
        const currentDay = state.selectedHostelDay || "Monday";
        const currentList = state.hostelMenu[currentDay][meal] || [];
        const updatedList = currentList.filter(i => i !== itemToRemove);
        
        store.updateHostelMenu(currentDay, meal, updatedList);
        this.render(container);
      });
    });

    // Add Dish Item
    container.querySelectorAll(".btn-add-dish").forEach(btn => {
      btn.addEventListener("click", (e) => {
        const meal = e.currentTarget.dataset.meal;
        const input = container.querySelector(`.input-dish[data-meal="${meal}"]`);
        const val = (input?.value || "").trim();
        if (val) {
          const state = store.getState();
          const currentDay = state.selectedHostelDay || "Monday";
          const currentList = state.hostelMenu[currentDay][meal] || [];
          if (!currentList.includes(val)) {
            currentList.push(val);
            store.updateHostelMenu(currentDay, meal, currentList);
            this.render(container);
            Helpers.showToast(`Added ${val} to ${meal}`, "success");
          }
        }
      });
    });

    // Generate Plan from Menu
    container.querySelector("#btn-generate-plan-from-menu")?.addEventListener("click", () => {
      store.setTab("planner");
    });
  }
}
