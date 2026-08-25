/**
 * NutriScan AI - Main Application Coordinator & Router
 */

import { store } from './state.js';
import { DashboardView } from './components/dashboardView.js';
import { ScannerView } from './components/scannerView.js';
import { HostelModeView } from './components/hostelModeView.js';
import { MealPlannerView } from './components/mealPlannerView.js';
import { StreaksView } from './components/streaksView.js';
import { InsightsView } from './components/insightsView.js';
import { ChatBotView } from './components/chatBotView.js';
import { ProfileView } from './components/profileView.js';

class NutriScanApp {
  constructor() {
    this.mainContainer = document.getElementById("main-content-area");
    this.navLinks = document.querySelectorAll("[data-nav-tab]");
    this.init();
  }

  init() {
    // Subscribe to state changes
    store.subscribe((state, event, payload) => {
      this.handleStateChange(state, event, payload);
    });

    // Attach navigation listeners for Desktop sidebar & Mobile bottom bar
    this.navLinks.forEach(link => {
      link.addEventListener("click", (e) => {
        const tab = e.currentTarget.dataset.navTab;
        if (tab) {
          store.setTab(tab);
        }
      });
    });

    // Attach Floating NutriBot quick toggle
    const floatingBotBtn = document.getElementById("floating-nutribot-btn");
    floatingBotBtn?.addEventListener("click", () => {
      const state = store.getState();
      store.setTab(state.activeTab === "chat" ? "dashboard" : "chat");
    });

    // Initial View Render & Hash Router setup
    const hashTab = window.location.hash.replace(/^#\/?/, "");
    const validTabs = ["dashboard", "scanner", "hostel", "planner", "streaks", "insights", "chat", "profile"];
    const initialTab = validTabs.includes(hashTab) ? hashTab : (store.getState().activeTab || "dashboard");
    
    store.setTab(initialTab);
    this.renderActiveTab(initialTab);
    this.updateActiveNavIndicators(initialTab);

    // Listen to hash changes for browser back/forward & direct links
    window.addEventListener("hashchange", () => {
      const currentHash = window.location.hash.replace(/^#\/?/, "");
      if (validTabs.includes(currentHash) && currentHash !== store.getState().activeTab) {
        store.setTab(currentHash);
      }
    });

    // Global helper for demo presets
    window.nutriScanApp = this;
  }

  handleStateChange(state, event, payload) {
    if (event === "tab_changed") {
      // Sync URL hash seamlessly
      if (window.location.hash !== `#${payload}`) {
        history.replaceState(null, "", `#${payload}`);
      }
      this.renderActiveTab(payload);
      this.updateActiveNavIndicators(payload);
      window.scrollTo({ top: 0, behavior: "smooth" });
    } else if (event === "water_updated" || event === "meal_logged" || event === "profile_updated") {
      // Re-render current active view to reflect updated stats
      this.renderActiveTab(state.activeTab);
    }
  }

  updateActiveNavIndicators(activeTab) {
    this.navLinks.forEach(link => {
      const isMatch = link.dataset.navTab === activeTab;
      link.classList.toggle("nav-active", isMatch);
    });
  }

  renderActiveTab(tab) {
    if (!this.mainContainer) return;

    try {
      switch (tab) {
        case "dashboard":
          DashboardView.render(this.mainContainer);
          break;
        case "scanner":
          ScannerView.render(this.mainContainer);
          break;
        case "hostel":
          HostelModeView.render(this.mainContainer);
          break;
        case "planner":
          MealPlannerView.render(this.mainContainer);
          break;
        case "streaks":
          StreaksView.render(this.mainContainer);
          break;
        case "insights":
          InsightsView.render(this.mainContainer);
          break;
        case "chat":
          ChatBotView.render(this.mainContainer);
          break;
        case "profile":
          ProfileView.render(this.mainContainer);
          break;
        default:
          DashboardView.render(this.mainContainer);
      }
    } catch (renderError) {
      console.error(`Error rendering view '${tab}':`, renderError);
      this.mainContainer.innerHTML = `
        <div class="content-card glassmorphism p-4 text-center animate-fade-in" style="max-width: 600px; margin: 40px auto;">
          <span style="font-size: 3rem;">⚠️</span>
          <h3 class="mt-2">View Loading Recovered</h3>
          <p class="text-muted mt-1">There was a temporary glitch rendering this view. Your data is completely safe.</p>
          <button class="btn btn-primary mt-3" onclick="location.hash='#dashboard'; location.reload();">
            🏠 Return to Dashboard
          </button>
        </div>
      `;
    }
  }

  // 1-Click Judge Demo Helper
  loadDemoPlate(demoType) {
    store.setTab("scanner");
    setTimeout(() => {
      ScannerView.loadDemoPreset(demoType, this.mainContainer);
    }, 50);
  }
}

// Bootstrap application on DOM ready
document.addEventListener("DOMContentLoaded", () => {
  new NutriScanApp();
});

