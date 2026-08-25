/**
 * NutriScan AI - Main Dashboard View
 */

import { store } from '../state.js';
import { ChartUtils } from '../utils/charts.js';
import { MealPlanner } from '../services/mealPlanner.js';
import { StreakService } from '../services/streakService.js';
import { Helpers } from '../utils/helpers.js';

export class DashboardView {
  static render(container) {
    const state = store.getState() || {};
    const profile = state.profile || {};
    const today = state.today || {};
    const streakInfo = StreakService.getStreakOverview(state);

    const goalStr = (profile.goal || "balanced").replace('-', ' ').toUpperCase();
    const collegeStr = profile.college || "Engineering Hostel A";
    const selectedDay = state.selectedHostelDay || "Monday";
    const menuLunch = (state.hostelMenu && state.hostelMenu[selectedDay]?.lunch) || ["Rice", "Dal", "2 Roti", "Curd", "Salad"];

    const calTarget = profile.dailyCaloriesTarget || 2200;
    const calCurrent = today.consumedCalories || 1380;
    const calRemaining = Math.max(0, calTarget - calCurrent);
    const calPct = Math.min(100, Math.round((calCurrent / calTarget) * 100));

    const proteinTarget = profile.dailyProteinTarget || 75;
    const proteinCurrent = today.consumedProteinG || 52;
    const proteinPct = Math.min(100, Math.round((proteinCurrent / proteinTarget) * 100));

    const budgetTotal = profile.dailyBudget || 150;
    const budgetSpent = today.budgetSpent || 85;
    const budgetRemaining = Math.max(0, budgetTotal - budgetSpent);
    const budgetPct = Math.min(100, Math.round((budgetSpent / budgetTotal) * 100));

    const waterTargetL = ((today.waterTargetMl || 2500) / 1000).toFixed(1);
    const waterCurrentL = ((today.waterIntakeMl || 1750) / 1000).toFixed(1);

    container.innerHTML = `
      <div class="dashboard-wrapper animate-fade-in">
        <!-- Hero Header -->
        <div class="dashboard-hero-card glassmorphism">
          <div class="hero-left">
            <div class="user-greeting-badge">
              <span class="pulse-dot"></span> Hostel Nutrition Intelligence
            </div>
            <h1 class="hero-title">Good Day, ${profile.name || "Student"}! 👋</h1>
            <p class="hero-subtitle">
              Goal: <strong class="text-accent">${goalStr}</strong> • 
              Mess: <strong>${collegeStr}</strong>
            </p>
          </div>
          <div class="hero-right">
            <button id="btn-hero-what-to-eat" class="btn btn-primary-glow btn-lg">
              <span class="btn-icon">🍽️</span> What Should I Eat Now?
            </button>
            <button id="btn-hero-scan" class="btn btn-secondary glassmorphism">
              <span class="btn-icon">📸</span> Scan Plate
            </button>
          </div>
        </div>

        <!-- Interactive Hostel Mess & Daily Budget Wizard Card -->
        <div class="hostel-budget-wizard-card glassmorphism">
          <div class="wizard-header">
            <div class="wizard-title-group">
              <span class="badge badge-accent">🏠 Step 1: Mess Menu & Budget Setup</span>
              <h3 class="wizard-heading">Plan Your Meals from Today's Hostel Menu</h3>
              <p class="wizard-sub">Tell NutriScan what your mess is serving and your daily budget to get an optimized meal plan.</p>
            </div>
            <div class="wizard-actions-top">
              <button id="btn-wizard-scan-menu" class="btn btn-secondary btn-sm">
                <span>📸 Scan Menu Board</span>
              </button>
            </div>
          </div>

          <div class="wizard-inputs-grid">
            <!-- Step A: Daily Budget Selector -->
            <div class="wizard-input-col">
              <label class="wizard-lbl">1. Select Your Food Budget for Today:</label>
              <div class="budget-pills-row">
                <button class="budget-pill-btn ${profile.dailyBudget === 50 ? 'active' : ''}" data-budget="50">₹50 (Tight)</button>
                <button class="budget-pill-btn ${profile.dailyBudget === 75 ? 'active' : ''}" data-budget="75">₹75</button>
                <button class="budget-pill-btn ${profile.dailyBudget === 100 ? 'active' : ''}" data-budget="100">₹100</button>
                <button class="budget-pill-btn ${profile.dailyBudget === 150 ? 'active' : ''}" data-budget="150">₹150 (Standard)</button>
              </div>
            </div>

            <!-- Step B: Today's Available Mess Dishes -->
            <div class="wizard-input-col">
              <label class="wizard-lbl">2. Today's Hostel Mess Dishes (${selectedDay}):</label>
              <div class="wizard-dishes-chips" id="wizard-today-dishes-box">
                ${menuLunch.map(d => `
                  <span class="wizard-dish-chip">${d}</span>
                `).join('')}
              </div>
              <div class="wizard-add-dish-row">
                <input type="text" id="input-quick-add-mess-dish" placeholder="Add today's dish (e.g. Rajma, Paneer)..." class="form-input wizard-input-sm" />
                <button id="btn-quick-add-mess-dish" class="btn btn-secondary btn-sm">Add</button>
              </div>
            </div>
          </div>

          <div class="wizard-footer-action">
            <button id="btn-wizard-optimize-meals" class="btn btn-primary-glow btn-lg btn-block">
              <span>✨ Calculate Best Meal Combinations from Mess Menu (Within Budget) ➔</span>
            </button>
          </div>
        </div>

        <!-- Quick Judge Demo Presets Bar -->
        <div class="demo-quick-bar glassmorphism">
          <div class="demo-bar-label">
            <span class="badge badge-accent">🎯 Try 1-Click Demo</span>
            <span class="demo-hint">Instant judge walkthrough:</span>
          </div>
          <div class="demo-buttons-group">
            <button class="btn btn-sm btn-demo" data-demo="thali">🍛 Indian Thali</button>
            <button class="btn btn-sm btn-demo" data-demo="junk">🍜 Late-Night Maggi</button>
            <button class="btn btn-sm btn-demo" data-demo="gym">💪 High Protein Plate</button>
            <button class="btn btn-sm btn-demo-menu" id="btn-quick-hostel-demo">🏠 Hostel Menu Plan</button>
          </div>
        </div>

        <!-- Key Real-Time Metrics Grid -->
        <div class="metrics-grid">
          <!-- Calories Card -->
          <div class="metric-card glassmorphism card-cal">
            <div class="metric-header">
              <span class="metric-icon-wrap bg-amber">🔥</span>
              <div>
                <h4 class="metric-label">Daily Calories</h4>
                <p class="metric-sub">${calRemaining} kcal remaining</p>
              </div>
            </div>
            <div class="metric-body">
              <div class="metric-value-row">
                <span class="metric-val-current">${calCurrent}</span>
                <span class="metric-val-target">/ ${calTarget} kcal</span>
              </div>
              <div class="progress-bar-track">
                <div class="progress-bar-fill fill-amber" style="width: ${calPct}%;"></div>
              </div>
            </div>
          </div>

          <!-- Protein Card -->
          <div class="metric-card glassmorphism card-protein">
            <div class="metric-header">
              <span class="metric-icon-wrap bg-cyan">💪</span>
              <div>
                <h4 class="metric-label">Protein Target</h4>
                <p class="metric-sub">${Math.max(0, proteinTarget - proteinCurrent)}g to goal</p>
              </div>
            </div>
            <div class="metric-body">
              <div class="metric-value-row">
                <span class="metric-val-current">${proteinCurrent}g</span>
                <span class="metric-val-target">/ ${proteinTarget}g</span>
              </div>
              <div class="progress-bar-track">
                <div class="progress-bar-fill fill-cyan" style="width: ${proteinPct}%;"></div>
              </div>
            </div>
          </div>

          <!-- Daily Budget Card -->
          <div class="metric-card glassmorphism card-budget">
            <div class="metric-header">
              <span class="metric-icon-wrap bg-emerald">💰</span>
              <div>
                <h4 class="metric-label">Daily Food Budget</h4>
                <p class="metric-sub">₹${budgetRemaining} remaining</p>
              </div>
            </div>
            <div class="metric-body">
              <div class="metric-value-row">
                <span class="metric-val-current">₹${budgetSpent}</span>
                <span class="metric-val-target">/ ₹${budgetTotal}</span>
              </div>
              <div class="progress-bar-track">
                <div class="progress-bar-fill fill-emerald" style="width: ${budgetPct}%;"></div>
              </div>
            </div>
          </div>

          <!-- Hydration Card -->
          <div class="metric-card glassmorphism card-water">
            <div class="metric-header">
              <span class="metric-icon-wrap bg-blue">💧</span>
              <div>
                <h4 class="metric-label">Hydration</h4>
                <p class="metric-sub">${streakInfo.hydrationStreak} day streak</p>
              </div>
            </div>
            <div class="metric-body">
              <div class="metric-value-row">
                <span class="metric-val-current">${waterCurrentL}L</span>
                <span class="metric-val-target">/ ${waterTargetL}L</span>
              </div>
              <div class="quick-water-actions">
                <button class="btn btn-xs btn-water-add" data-add="250">+250 ml</button>
                <button class="btn btn-xs btn-water-add" data-add="500">+500 ml</button>
              </div>
            </div>
          </div>
        </div>

        <!-- 2-Column Section: What Should I Eat Preview & Daily Habits -->
        <div class="dashboard-split-grid">
          <!-- Next Meal Recommendation Teaser -->
          <div class="content-card glassmorphism">
            <div class="card-section-header">
              <div>
                <h3 class="section-title">🍽️ Recommended Next Meal</h3>
                <p class="section-sub">Personalized based on today's hostel menu & remaining budget</p>
              </div>
              <button class="btn btn-sm btn-ghost" id="btn-view-all-plans">View All Options →</button>
            </div>
            <div id="dashboard-next-meal-card">
              <!-- Rendered dynamically -->
            </div>
          </div>

          <!-- Habit Checklist & Active Streaks -->
          <div class="content-card glassmorphism">
            <div class="card-section-header">
              <div>
                <h3 class="section-title">🔥 Daily Habit Consistency</h3>
                <p class="section-sub">${streakInfo.nutritionStreak} Day Nutrition Streak Active</p>
              </div>
              <button class="btn btn-sm btn-ghost" id="btn-view-streaks">View Streaks →</button>
            </div>
            <div class="habit-checklist-container">
              ${streakInfo.checklist.map(item => `
                <div class="habit-check-row ${item.completed ? 'completed' : ''}">
                  <span class="check-box-icon">${item.completed ? '✅' : '⚪'}</span>
                  <div class="habit-check-text">
                    <span class="habit-check-title">${item.title}</span>
                    <span class="habit-check-sub">${item.progressText}</span>
                  </div>
                </div>
              `).join('')}
            </div>
          </div>
        </div>

        <!-- Value Proposition Strip -->
        <div class="val-prop-strip glassmorphism">
          <div class="val-prop-item">
            <span class="val-icon">🤖</span>
            <div>
              <strong>Multi-Food AI Scanner</strong>
              <p>Understands composite plates (Dal, Roti, Rice, Paneer, Curd).</p>
            </div>
          </div>
          <div class="val-prop-item">
            <span class="val-icon">🏠</span>
            <div>
              <strong>Hostel Mess Optimizer</strong>
              <p>Turns your weekly mess board photo into healthy choices.</p>
            </div>
          </div>
          <div class="val-prop-item">
            <span class="val-icon">💰</span>
            <div>
              <strong>Pocket-Friendly Nutrition</strong>
              <p>Maximizes protein per rupee spent for college budgets.</p>
            </div>
          </div>
        </div>
      </div>
    `;

    // Render Next Meal recommendation card
    const nextMealContainer = container.querySelector("#dashboard-next-meal-card");
    if (nextMealContainer) {
      const rec = MealPlanner.recommendWhatToEatNow(state);
      nextMealContainer.innerHTML = `
        <div class="next-meal-preview-box">
          <div class="rec-badge-row">
            <span class="badge badge-accent">${rec.mealType} Recommendation</span>
            <span class="badge badge-score">${rec.recommendation.matchScore}% Match</span>
          </div>
          <h4 class="rec-title">${rec.recommendation.title}</h4>
          <p class="rec-items-list">
            ${rec.recommendation.foods.map(f => `<strong>${f.name}</strong>`).join(" + ")}
          </p>
          <div class="rec-metrics-chips">
            <span class="chip chip-cal">🔥 ${rec.recommendation.totals.calories} kcal</span>
            <span class="chip chip-protein">💪 ${rec.recommendation.totals.protein_g}g Protein</span>
            <span class="chip chip-cost">💰 ₹${rec.recommendation.totals.estimated_cost}</span>
          </div>
          <p class="rec-why-note">💡 ${rec.recommendation.whyStatement}</p>
        </div>
      `;
    }

    // Attach Dashboard Event Listeners
    this.attachEvents(container);
  }

  static attachEvents(container) {
    // Header & Quick Navigation Buttons
    container.querySelector("#btn-hero-what-to-eat")?.addEventListener("click", () => {
      store.setTab("planner");
    });

    container.querySelector("#btn-hero-scan")?.addEventListener("click", () => {
      store.setTab("scanner");
    });

    container.querySelector("#btn-view-all-plans")?.addEventListener("click", () => {
      store.setTab("planner");
    });

    container.querySelector("#btn-view-streaks")?.addEventListener("click", () => {
      store.setTab("streaks");
    });

    container.querySelectorAll(".btn-water-add").forEach(btn => {
      btn.addEventListener("click", (e) => {
        const amount = parseInt(e.currentTarget.dataset.add, 10);
        store.addWater(amount);
      });
    });

    // 1-Click Demo Buttons
    container.querySelectorAll(".btn-demo").forEach(btn => {
      btn.addEventListener("click", (e) => {
        const demoType = e.currentTarget.dataset.demo;
        window.nutriScanApp?.loadDemoPlate(demoType);
      });
    });

    container.querySelector("#btn-quick-hostel-demo")?.addEventListener("click", () => {
      store.setTab("hostel");
    });

    // Hostel Budget Wizard Listeners
    container.querySelectorAll(".budget-pill-btn").forEach(btn => {
      btn.addEventListener("click", (e) => {
        const b = parseInt(e.currentTarget.dataset.budget, 10);
        store.updateProfile({ dailyBudget: b });
        Helpers.showToast(`Daily budget set to ₹${b}! 💰`, "success");
        this.render(container);
      });
    });

    container.querySelector("#btn-wizard-scan-menu")?.addEventListener("click", () => {
      store.setTab("hostel");
    });

    container.querySelector("#btn-quick-add-mess-dish")?.addEventListener("click", () => {
      const input = container.querySelector("#input-quick-add-mess-dish");
      const dish = (input?.value || "").trim();
      if (dish) {
        const state = store.getState();
        const currentDay = state.selectedHostelDay || "Monday";
        const currentList = state.hostelMenu[currentDay]?.lunch || [];
        if (!currentList.includes(dish)) {
          currentList.push(dish);
          store.updateHostelMenu(currentDay, "lunch", currentList);
          input.value = "";
          Helpers.showToast(`Added ${dish} to today's mess menu! 🍛`, "success");
          this.render(container);
        }
      }
    });

    container.querySelector("#btn-wizard-optimize-meals")?.addEventListener("click", () => {
      Helpers.showToast("Optimizing hostel mess meals for your budget... ✨", "info");
      store.setTab("planner");
    });
  }
}
