/**
 * NutriScan AI - Smart Meal Planner & Optimization View
 * Features: "What Should I Eat Now?", Quick Modes (High Protein, Budget <₹50), Smart Swaps & 7-Day Planner.
 */

import { store } from '../state.js';
import { MealPlanner } from '../services/mealPlanner.js';
import { SMART_SWAP_RULES } from '../config.js';
import { Helpers } from '../utils/helpers.js';

export class MealPlannerView {
  static activeBudgetMode = 150;
  static activeGoalMode = "high-protein";
  static showWeeklyPlan = false;

  static render(container) {
    const state = store.getState();
    const currentDay = state.selectedHostelDay || "Monday";
    const currentMeal = MealPlanner.getCurrentMealType();

    const remainingCalories = Math.max(300, (state.profile.dailyCaloriesTarget || 2200) - (state.today.consumedCalories || 1380));
    const remainingBudget = Math.max(20, (state.profile.dailyBudget || 150) - (state.today.budgetSpent || 85));
    const consumedProtein = state.today.consumedProteinG || 52;
    const proteinTarget = state.profile.dailyProteinTarget || 75;

    // Generate combinations based on current state & filters
    const combos = MealPlanner.generateMealCombinations({
      hostelMenu: state.hostelMenu,
      day: currentDay,
      mealType: currentMeal,
      remainingCalories,
      remainingBudget: this.activeBudgetMode || remainingBudget,
      proteinTarget,
      currentProtein: consumedProtein,
      goal: this.activeGoalMode || state.profile.goal,
      diet: state.profile.diet
    });

    const whatToEatNow = MealPlanner.recommendWhatToEatNow(state);
    const weeklyData = this.showWeeklyPlan ? MealPlanner.generateWeeklyPlan(state) : null;

    container.innerHTML = `
      <div class="meal-planner-wrapper animate-fade-in">
        <!-- View Header -->
        <div class="view-header-card glassmorphism">
          <div>
            <span class="badge badge-accent">⚡ Smart Meal Planner</span>
            <h2 class="view-title">Personalized Hostel Meal Optimization</h2>
            <p class="view-subtitle">
              Calculates the best meal combinations based on your hostel mess schedule, remaining money, and protein targets.
            </p>
          </div>
          <div class="header-actions">
            <button id="btn-toggle-weekly-plan" class="btn btn-secondary glassmorphism">
              <span>${this.showWeeklyPlan ? "Hide Weekly Plan" : "📅 Generate 7-Day Weekly Plan"}</span>
            </button>
          </div>
        </div>

        <!-- HERO "WHAT SHOULD I EAT NOW?" Real-Time Decision Box -->
        <div class="what-to-eat-hero-box glassmorphism">
          <div class="hero-decision-header">
            <div class="decision-title-group">
              <span class="pulse-dot"></span>
              <h3 class="decision-heading">🍽️ "What Should I Eat Now?" Decision Engine</h3>
            </div>
            <span class="badge badge-time">⏰ Current Session: ${whatToEatNow.mealType} (${whatToEatNow.currentHour})</span>
          </div>

          <div class="decision-body-grid">
            <div class="decision-left">
              <p class="decision-reasoning">${whatToEatNow.insightsContext}</p>
              
              <div class="decision-plate-preview">
                <div class="decision-match-badge">
                  <span>Match Score: <strong>${whatToEatNow.recommendation.matchScore}%</strong></span>
                </div>
                <h4 class="decision-plate-title">${whatToEatNow.recommendation.title}</h4>
                <div class="decision-foods-row">
                  ${whatToEatNow.recommendation.foods.map(f => `
                    <span class="decision-food-pill">
                      ${f.name} <small>(${f.portion} ${f.unit})</small>
                    </span>
                  `).join('')}
                </div>
                <p class="decision-why-text">💡 <strong>Why:</strong> ${whatToEatNow.recommendation.whyStatement}</p>
              </div>
            </div>

            <div class="decision-right-metrics">
              <div class="decision-metric-box">
                <span class="d-metric-lbl">Estimated Cost</span>
                <span class="d-metric-val text-emerald">₹${whatToEatNow.recommendation.totals.estimated_cost}</span>
              </div>
              <div class="decision-metric-box">
                <span class="d-metric-lbl">Total Calories</span>
                <span class="d-metric-val text-amber">${whatToEatNow.recommendation.totals.calories} kcal</span>
              </div>
              <div class="decision-metric-box">
                <span class="d-metric-lbl">Total Protein</span>
                <span class="d-metric-val text-cyan">${whatToEatNow.recommendation.totals.protein_g}g</span>
              </div>
              <div class="decision-metric-box">
                <span class="d-metric-lbl">Health Score</span>
                <span class="d-metric-val text-emerald">${whatToEatNow.recommendation.healthScore}/100</span>
              </div>
              <button id="btn-log-decision-plate" class="btn btn-primary-glow btn-block">
                <span>✓ Eat & Log This Meal</span>
              </button>
            </div>
          </div>
        </div>

        <!-- Filter Modes Toolbar -->
        <div class="planner-toolbar glassmorphism">
          <div class="toolbar-group">
            <span class="toolbar-label">Quick Goal Modes:</span>
            <div class="pill-buttons-row">
              <button class="pill-btn ${this.activeGoalMode === 'high-protein' ? 'active' : ''}" data-goal="high-protein">💪 High Protein</button>
              <button class="pill-btn ${this.activeGoalMode === 'budget' ? 'active' : ''}" data-goal="budget">💰 Budget Saver</button>
              <button class="pill-btn ${this.activeGoalMode === 'calorie-cut' ? 'active' : ''}" data-goal="calorie-cut">🔥 Calorie Controlled</button>
              <button class="pill-btn ${this.activeGoalMode === 'balanced' ? 'active' : ''}" data-goal="balanced">🥗 Balanced Plate</button>
            </div>
          </div>

          <div class="toolbar-group">
            <span class="toolbar-label">Budget Limit:</span>
            <div class="pill-buttons-row">
              <button class="pill-btn ${this.activeBudgetMode === 50 ? 'active' : ''}" data-budget="50">₹50</button>
              <button class="pill-btn ${this.activeBudgetMode === 75 ? 'active' : ''}" data-budget="75">₹75</button>
              <button class="pill-btn ${this.activeBudgetMode === 100 ? 'active' : ''}" data-budget="100">₹100</button>
              <button class="pill-btn ${this.activeBudgetMode === 150 ? 'active' : ''}" data-budget="150">₹150</button>
            </div>
          </div>
        </div>

        <!-- 3-Column Meal Combinations Comparison -->
        <div class="combos-comparison-grid">
          <!-- Card 1: Best Match -->
          ${this.renderComboCard(combos.bestMatch, "border-cyan")}

          <!-- Card 2: Budget Saver -->
          ${this.renderComboCard(combos.budgetOption, "border-emerald")}

          <!-- Card 3: High Protein -->
          ${this.renderComboCard(combos.highProteinOption, "border-accent")}
        </div>

        <!-- Smart Food Swaps Section -->
        <div class="content-card glassmorphism swaps-card">
          <div class="card-section-header">
            <div>
              <h3 class="section-title">🔄 Smart Hostel Food Swaps</h3>
              <p class="section-sub">Simple ingredient substitutions that maximize protein and cut empty calories</p>
            </div>
          </div>

          <div class="swaps-grid">
            ${SMART_SWAP_RULES.map(rule => `
              <div class="swap-item-box">
                <div class="swap-from-to-row">
                  <div class="swap-side side-from">
                    <span class="swap-badge badge-from">Instead of</span>
                    <strong>${rule.original.join(', ').toUpperCase()}</strong>
                  </div>
                  <span class="swap-arrow">➔</span>
                  <div class="swap-side side-to">
                    <span class="swap-badge badge-to">Choose</span>
                    <strong class="text-emerald">${rule.replacement.name}</strong>
                  </div>
                </div>
                <div class="swap-impact-row">
                  <span class="impact-pill text-amber">🔥 ${rule.replacement.caloriesDiff} kcal</span>
                  <span class="impact-pill text-cyan">💪 +${rule.replacement.proteinDiff}g Protein</span>
                  <span class="impact-pill text-emerald">💰 ${rule.replacement.costDiff <= 0 ? '₹' + Math.abs(rule.replacement.costDiff) + ' Saved' : '+₹' + rule.replacement.costDiff}</span>
                </div>
                <p class="swap-reason">${rule.replacement.reason}</p>
              </div>
            `).join('')}
          </div>
        </div>

        <!-- 7-Day Weekly Meal Planner Table (If toggled) -->
        ${this.showWeeklyPlan && weeklyData ? `
          <div class="content-card glassmorphism weekly-plan-card animate-scale-in">
            <div class="card-section-header">
              <div>
                <h3 class="section-title">📅 7-Day Full Hostel Mess Meal Plan</h3>
                <p class="section-sub">Optimized breakfast, lunch and dinner from Monday through Sunday</p>
              </div>
              <div class="weekly-summary-pills">
                <span class="summary-pill">Avg: <strong>${weeklyData.summary.avgCalories} kcal/day</strong></span>
                <span class="summary-pill">Protein: <strong>${weeklyData.summary.avgProtein}g/day</strong></span>
                <span class="summary-pill">Total Cost: <strong class="text-emerald">₹${weeklyData.summary.totalCost}/week</strong></span>
              </div>
            </div>

            <div class="table-responsive">
              <table class="weekly-plan-table">
                <thead>
                  <tr>
                    <th>Day</th>
                    <th>Breakfast</th>
                    <th>Lunch</th>
                    <th>Dinner</th>
                    <th>Daily Total</th>
                  </tr>
                </thead>
                <tbody>
                  ${weeklyData.days.map(d => `
                    <tr>
                      <td><strong class="day-col-title">${d.day}</strong></td>
                      <td>
                        <div class="meal-plan-cell">
                          <span>${d.breakfast.foods.map(f => f.name).join(' + ')}</span>
                          <small class="cell-sub">${d.breakfast.totals.calories} kcal • ₹${d.breakfast.totals.estimated_cost}</small>
                        </div>
                      </td>
                      <td>
                        <div class="meal-plan-cell">
                          <span>${d.lunch.foods.map(f => f.name).join(' + ')}</span>
                          <small class="cell-sub">${d.lunch.totals.calories} kcal • ${d.lunch.totals.protein_g}g protein • ₹${d.lunch.totals.estimated_cost}</small>
                        </div>
                      </td>
                      <td>
                        <div class="meal-plan-cell">
                          <span>${d.dinner.foods.map(f => f.name).join(' + ')}</span>
                          <small class="cell-sub">${d.dinner.totals.calories} kcal • ${d.dinner.totals.protein_g}g protein • ₹${d.dinner.totals.estimated_cost}</small>
                        </div>
                      </td>
                      <td>
                        <div class="daily-total-badge">
                          <strong>${d.dayTotals.calories} kcal</strong>
                          <span class="text-cyan">${d.dayTotals.protein}g protein</span>
                          <span class="text-emerald">₹${d.dayTotals.cost}</span>
                        </div>
                      </td>
                    </tr>
                  `).join('')}
                </tbody>
              </table>
            </div>
          </div>
        ` : ''}
      </div>
    `;

    this.attachEvents(container, whatToEatNow);
  }

  static renderComboCard(combo, borderClass = "") {
    return `
      <div class="combo-card glassmorphism ${borderClass}">
        <div class="combo-card-header">
          <div>
            <span class="badge badge-score">${combo.matchScore}% Match</span>
            <h4 class="combo-title">${combo.title}</h4>
            <p class="combo-tagline">${combo.tagline}</p>
          </div>
        </div>

        <div class="combo-foods-list">
          ${combo.foods.map(f => `
            <div class="combo-food-row">
              <span class="c-food-name">✓ ${f.name}</span>
              <span class="c-food-portion">${f.portion} ${f.unit}</span>
            </div>
          `).join('')}
        </div>

        <div class="combo-metrics-strip">
          <div class="combo-m-item">
            <span class="m-val text-amber">${combo.totals.calories}</span>
            <span class="m-lbl">kcal</span>
          </div>
          <div class="combo-m-item">
            <span class="m-val text-cyan">${combo.totals.protein_g}g</span>
            <span class="m-lbl">Protein</span>
          </div>
          <div class="combo-m-item">
            <span class="m-val text-emerald">₹${combo.totals.estimated_cost}</span>
            <span class="m-lbl">Cost</span>
          </div>
          <div class="combo-m-item">
            <span class="m-val text-accent">${combo.healthScore}</span>
            <span class="m-lbl">Health</span>
          </div>
        </div>

        <p class="combo-why-text">💡 ${combo.whyStatement}</p>

        <button class="btn btn-secondary btn-block btn-choose-combo" data-title="${combo.title}" data-cal="${combo.totals.calories}" data-protein="${combo.totals.protein_g}" data-cost="${combo.totals.estimated_cost}" data-health="${combo.healthScore}">
          Log This Combination
        </button>
      </div>
    `;
  }

  static attachEvents(container, whatToEatNow) {
    // Goal Filter Buttons
    container.querySelectorAll(".pill-btn[data-goal]").forEach(btn => {
      btn.addEventListener("click", (e) => {
        this.activeGoalMode = e.currentTarget.dataset.goal;
        this.render(container);
      });
    });

    // Budget Filter Buttons
    container.querySelectorAll(".pill-btn[data-budget]").forEach(btn => {
      btn.addEventListener("click", (e) => {
        this.activeBudgetMode = parseInt(e.currentTarget.dataset.budget, 10);
        this.render(container);
      });
    });

    // Toggle Weekly Plan
    container.querySelector("#btn-toggle-weekly-plan")?.addEventListener("click", () => {
      this.showWeeklyPlan = !this.showWeeklyPlan;
      this.render(container);
    });

    // Log Decision Plate
    container.querySelector("#btn-log-decision-plate")?.addEventListener("click", () => {
      const rec = whatToEatNow.recommendation;
      store.logMeal({
        name: rec.title,
        calories: rec.totals.calories,
        protein: rec.totals.protein_g,
        carbs: rec.totals.carbs_g,
        fat: rec.totals.fat_g,
        fiber: rec.totals.fiber_g,
        cost: rec.totals.estimated_cost,
        healthScore: rec.healthScore,
        category: "Hostel Optimized",
        foods: rec.foods
      });
      Helpers.showToast("Logged to today's nutrition! 🔥", "fire");
      store.setTab("dashboard");
    });

    // Log Combo Button
    container.querySelectorAll(".btn-choose-combo").forEach(btn => {
      btn.addEventListener("click", (e) => {
        const title = e.currentTarget.dataset.title;
        const cal = parseInt(e.currentTarget.dataset.cal, 10);
        const protein = parseFloat(e.currentTarget.dataset.protein);
        const cost = parseInt(e.currentTarget.dataset.cost, 10);
        const health = parseInt(e.currentTarget.dataset.health, 10);

        store.logMeal({
          name: title,
          calories: cal,
          protein: protein,
          carbs: Math.round(cal * 0.55 / 4),
          fat: Math.round(cal * 0.25 / 9),
          fiber: 7,
          cost: cost,
          healthScore: health,
          category: "Mess Combo"
        });
        Helpers.showToast(`Logged ${title}! 🔥`, "fire");
        store.setTab("dashboard");
      });
    });
  }
}
