/**
 * NutriScan AI - Gamified Streaks & Habit Tracker View
 * Features: 🔥 Nutrition Streak, 💧 Hydration Logger, Milestone Badges & Daily Habit Checklist.
 */

import { store } from '../state.js';
import { StreakService } from '../services/streakService.js';
import { ChartUtils } from '../utils/charts.js';
import { Helpers } from '../utils/helpers.js';

export class StreaksView {
  static render(container) {
    const state = store.getState();
    const streakInfo = StreakService.getStreakOverview(state);

    const waterCurrentL = (streakInfo.waterCurrent / 1000).toFixed(2);
    const waterTargetL = (streakInfo.waterTarget / 1000).toFixed(1);

    container.innerHTML = `
      <div class="streaks-wrapper animate-fade-in">
        <!-- View Header -->
        <div class="view-header-card glassmorphism">
          <div>
            <span class="badge badge-accent">🔥 Habit Consistency</span>
            <h2 class="view-title">Streaks & Gamified Milestones</h2>
            <p class="view-subtitle">
              Build effortless, lifelong healthy food habits through daily streaks, hydration tracking, and badge unlocks.
            </p>
          </div>
        </div>

        <!-- 4 Key Streaks Counter Grid -->
        <div class="streaks-counter-grid">
          <!-- Nutrition Streak -->
          <div class="streak-counter-card glassmorphism card-glow-amber">
            <span class="streak-emoji">🔥</span>
            <span class="streak-count-number">${streakInfo.nutritionStreak}</span>
            <span class="streak-count-label">Day Nutrition Streak</span>
            <span class="streak-sub-pill">Active & Healthy</span>
          </div>

          <!-- Hydration Streak -->
          <div class="streak-counter-card glassmorphism card-glow-blue">
            <span class="streak-emoji">💧</span>
            <span class="streak-count-number">${streakInfo.hydrationStreak}</span>
            <span class="streak-count-label">Day Hydration Streak</span>
            <span class="streak-sub-pill">Target: ${waterTargetL}L / day</span>
          </div>

          <!-- Meal Logging Streak -->
          <div class="streak-counter-card glassmorphism card-glow-emerald">
            <span class="streak-emoji">📸</span>
            <span class="streak-count-number">${streakInfo.mealLoggingStreak}</span>
            <span class="streak-count-label">Day Logging Streak</span>
            <span class="streak-sub-pill">Consistent Logger</span>
          </div>

          <!-- Protein Streak -->
          <div class="streak-counter-card glassmorphism card-glow-cyan">
            <span class="streak-emoji">💪</span>
            <span class="streak-count-number">${streakInfo.proteinStreak}</span>
            <span class="streak-count-label">Protein Target Streak</span>
            <span class="streak-sub-pill">>70% Protein Hit</span>
          </div>
        </div>

        <!-- 2-Column Section: 7-Day Visual Calendar & Interactive Hydration Circle -->
        <div class="streaks-split-grid">
          <!-- 7-Day History Calendar -->
          <div class="content-card glassmorphism calendar-card">
            <div class="card-section-header">
              <div>
                <h3 class="section-title">📅 7-Day Habit Consistency Calendar</h3>
                <p class="section-sub">Completed days with balanced meals logged within budget</p>
              </div>
            </div>

            <div class="days-calendar-row">
              ${streakInfo.historyDays.map(d => `
                <div class="calendar-day-box ${d.status === 'completed' ? 'day-completed' : ''}">
                  <span class="cal-day-abbr">${d.day}</span>
                  <span class="cal-check-badge">${d.status === 'completed' ? '✓' : '—'}</span>
                  <span class="cal-date-sub">${d.date}</span>
                </div>
              `).join('')}
            </div>

            <p class="streak-encouragement-note">
              🎉 <strong>You're on fire!</strong> You've logged balanced hostel meals 7 days in a row.
            </p>
          </div>

          <!-- Interactive Hydration Logger -->
          <div class="content-card glassmorphism hydration-card">
            <div class="card-section-header">
              <div>
                <h3 class="section-title">💧 Smart Water Tracker</h3>
                <p class="section-sub">Stay hydrated throughout intense study sessions & exams</p>
              </div>
            </div>

            <div class="hydration-body-row">
              <div class="hydration-ring-wrap">
                ${ChartUtils.renderRadialProgress(
                  streakInfo.hydrationPct,
                  "Hydration",
                  `${streakInfo.hydrationPct}%`,
                  "#06B6D4",
                  130
                )}
              </div>
              <div class="hydration-stats-col">
                <div class="h-stat-row">
                  <span class="h-stat-lbl">Today's Intake:</span>
                  <span class="h-stat-val text-cyan">${waterCurrentL} Liters</span>
                </div>
                <div class="h-stat-row">
                  <span class="h-stat-lbl">Daily Target:</span>
                  <span class="h-stat-val">${waterTargetL} Liters</span>
                </div>
                <div class="h-buttons-group">
                  <button class="btn btn-sm btn-primary btn-add-water" data-amount="250">💧 +250 ml</button>
                  <button class="btn btn-sm btn-primary btn-add-water" data-amount="500">💧 +500 ml</button>
                  <button class="btn btn-sm btn-ghost" id="btn-reset-water">Reset</button>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- Badges Milestone Showcase -->
        <div class="content-card glassmorphism badges-showcase-card">
          <div class="card-section-header">
            <div>
              <h3 class="section-title">🏅 Student Milestone Badges</h3>
              <p class="section-sub">Unlock badges as you master student budgeting, hydration & nutrition</p>
            </div>
            <span class="badge badge-accent">${streakInfo.badges.filter(b => b.isUnlocked).length} / ${streakInfo.badges.length} Unlocked</span>
          </div>

          <div class="badges-grid">
            ${streakInfo.badges.map(b => `
              <div class="badge-item-card ${b.isUnlocked ? 'badge-unlocked' : 'badge-locked'}">
                <div class="badge-icon-bubble">
                  <span>${b.icon}</span>
                </div>
                <h4 class="badge-card-title">${b.title}</h4>
                <p class="badge-card-desc">${b.description}</p>
                <div class="badge-status-pill">
                  ${b.isUnlocked ? '✓ ' + b.unlockedText : '🔒 Locked (' + b.daysRequired + ' days required)'}
                </div>
              </div>
            `).join('')}
          </div>
        </div>
      </div>
    `;

    this.attachEvents(container);
  }

  static attachEvents(container) {
    container.querySelectorAll(".btn-add-water").forEach(btn => {
      btn.addEventListener("click", (e) => {
        const amount = parseInt(e.currentTarget.dataset.amount, 10);
        store.addWater(amount);
        const state = store.getState();
        if (state.today.waterIntakeMl >= state.today.waterTargetMl) {
          Helpers.triggerConfetti();
          Helpers.showToast("🎉 Daily Hydration Goal Achieved! Peak Focus!", "water");
        } else {
          Helpers.showToast(`Added ${amount}ml water! 💧`, "water");
        }
        this.render(container);
      });
    });

    container.querySelector("#btn-reset-water")?.addEventListener("click", () => {
      store.resetWater();
      Helpers.showToast("Water intake reset for today", "info");
      this.render(container);
    });
  }
}
