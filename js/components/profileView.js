/**
 * NutriScan AI - Student Profile & Settings View
 */

import { store } from '../state.js';
import { Helpers } from '../utils/helpers.js';

export class ProfileView {
  static render(container) {
    const state = store.getState();
    const profile = state.profile || {};

    container.innerHTML = `
      <div class="profile-wrapper animate-fade-in">
        <!-- View Header -->
        <div class="view-header-card glassmorphism">
          <div>
            <span class="badge badge-accent">⚙️ Student Settings</span>
            <h2 class="view-title">Personal Nutrition & Budget Profile</h2>
            <p class="view-subtitle">
              Customize your daily targets, diet preferences, and API configuration.
            </p>
          </div>
        </div>

        <div class="profile-form-grid">
          <!-- Left: Targets & Goals Form -->
          <div class="content-card glassmorphism">
            <h3 class="card-title mb-4">🎯 Daily Nutrition & Budget Targets</h3>
            
            <div class="form-group mb-3">
              <label class="input-label">Student Name:</label>
              <input type="text" id="input-prof-name" class="form-input" value="${profile.name || ''}" />
            </div>

            <div class="form-group mb-3">
              <label class="input-label">Hostel / College Mess:</label>
              <input type="text" id="input-prof-college" class="form-input" value="${profile.college || ''}" />
            </div>

            <div class="form-row-dual mb-3">
              <div class="form-group">
                <label class="input-label">Daily Calorie Target (kcal):</label>
                <input type="number" id="input-prof-cal" class="form-input" value="${profile.dailyCaloriesTarget || 2200}" step="50" min="1200" max="4000" />
              </div>
              <div class="form-group">
                <label class="input-label">Daily Protein Target (grams):</label>
                <input type="number" id="input-prof-protein" class="form-input" value="${profile.dailyProteinTarget || 75}" step="5" min="30" max="200" />
              </div>
            </div>

            <div class="form-row-dual mb-3">
              <div class="form-group">
                <label class="input-label">Daily Food Budget (₹):</label>
                <input type="number" id="input-prof-budget" class="form-input" value="${profile.dailyBudget || 150}" step="10" min="40" max="1000" />
              </div>
              <div class="form-group">
                <label class="input-label">Daily Water Goal (ml):</label>
                <input type="number" id="input-prof-water" class="form-input" value="${state.today.waterTargetMl || 2500}" step="250" min="1000" max="6000" />
              </div>
            </div>

            <div class="form-group mb-3">
              <label class="input-label">Primary Fitness & Health Goal:</label>
              <select id="select-prof-goal" class="form-select">
                <option value="high-protein" ${profile.goal === 'high-protein' ? 'selected' : ''}>💪 High Protein / Muscle Gain</option>
                <option value="budget" ${profile.goal === 'budget' ? 'selected' : ''}>💰 Budget Optimization / Pocket Saver</option>
                <option value="calorie-cut" ${profile.goal === 'calorie-cut' ? 'selected' : ''}>🔥 Weight & Calorie Management</option>
                <option value="balanced" ${profile.goal === 'balanced' ? 'selected' : ''}>🥗 Balanced Student Eating</option>
              </select>
            </div>

            <div class="form-group mb-4">
              <label class="input-label">Dietary Preference:</label>
              <select id="select-prof-diet" class="form-select">
                <option value="veg" ${profile.diet === 'veg' ? 'selected' : ''}>🌱 Pure Vegetarian</option>
                <option value="egg" ${profile.diet === 'egg' ? 'selected' : ''}>🥚 Eggetarian (Vegetarian + Eggs)</option>
                <option value="non-veg" ${profile.diet === 'non-veg' ? 'selected' : ''}>🍗 Non-Vegetarian</option>
              </select>
            </div>

            <button id="btn-save-profile" class="btn btn-primary btn-block btn-lg">
              <span>💾 Save Profile Changes</span>
            </button>
          </div>

          <!-- Right: API Configuration & Demo Controls -->
          <div class="content-card glassmorphism">
            <h3 class="card-title mb-4">🔑 AI Engine & Judge Presets</h3>

            <div class="api-key-box glassmorphism mb-4">
              <div class="api-status-row">
                <span class="status-indicator-dot ${profile.geminiApiKey ? 'dot-active' : 'dot-offline'}"></span>
                <strong>${profile.geminiApiKey ? 'Live Google Gemini Vision Connected' : 'Offline Vision & Heuristic Mode Active'}</strong>
              </div>
              <p class="text-xs text-muted mt-2">
                NutriScan AI has a built-in deterministic Indian vision engine for zero-dependency hackathon testing. You can optionally paste your own Google Gemini API key below for live cloud vision.
              </p>
              <div class="form-group mt-3">
                <label class="input-label">Optional Gemini API Key:</label>
                <input type="password" id="input-prof-apikey" class="form-input" placeholder="AIzaSy..." value="${profile.geminiApiKey || ''}" />
              </div>
            </div>

            <div class="demo-reset-box glassmorphism mb-4">
              <h4 class="text-sm font-bold text-amber">🎯 Hackathon Demo Reset</h4>
              <p class="text-xs text-muted mt-1">
                Instantly reset state with preloaded demo thali scans, weekly hostel menu, 7-day streaks and hydration logs for judges.
              </p>
              <button id="btn-reset-demo-data" class="btn btn-secondary btn-block mt-3">
                <span>🔄 Reset to Preloaded Demo State</span>
              </button>
            </div>

            <div class="responsible-ai-box">
              <span class="shield-icon">🛡️</span>
              <p class="text-xs text-muted">
                <strong>Responsible AI Notice:</strong> Nutrition calculations and costs are AI-assisted estimates for general student awareness and habit building. Not medical advice.
              </p>
            </div>
          </div>
        </div>
      </div>
    `;

    this.attachEvents(container);
  }

  static attachEvents(container) {
    container.querySelector("#btn-save-profile")?.addEventListener("click", () => {
      const name = container.querySelector("#input-prof-name").value.trim();
      const college = container.querySelector("#input-prof-college").value.trim();
      const dailyCaloriesTarget = parseInt(container.querySelector("#input-prof-cal").value, 10) || 2200;
      const dailyProteinTarget = parseInt(container.querySelector("#input-prof-protein").value, 10) || 75;
      const dailyBudget = parseInt(container.querySelector("#input-prof-budget").value, 10) || 150;
      const waterTarget = parseInt(container.querySelector("#input-prof-water").value, 10) || 2500;
      const goal = container.querySelector("#select-prof-goal").value;
      const diet = container.querySelector("#select-prof-diet").value;
      const apiKey = container.querySelector("#input-prof-apikey").value.trim();

      store.updateProfile({
        name,
        college,
        dailyCaloriesTarget,
        dailyProteinTarget,
        dailyBudget,
        goal,
        diet,
        geminiApiKey: apiKey
      });

      const state = store.getState();
      state.today.waterTargetMl = waterTarget;
      store.saveState();

      Helpers.showToast("Profile & targets saved! ✨", "success");
      this.render(container);
    });

    container.querySelector("#btn-reset-demo-data")?.addEventListener("click", () => {
      if (confirm("Reset application to judge demo defaults?")) {
        store.resetDemoData();
        Helpers.showToast("State reset to demo mode! 🎯", "info");
        window.location.reload();
      }
    });
  }
}
