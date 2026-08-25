/**
 * NutriScan AI - Weekly Insights & Meal History View
 * Features: Weekly averages, 7-day trend chart, AI summary, Value-For-Money ranking & Scan history.
 */

import { store } from '../state.js';
import { CostEngine } from '../services/costEngine.js';
import { ChartUtils } from '../utils/charts.js';

export class InsightsView {
  static render(container) {
    const state = store.getState();
    const valueRankings = CostEngine.getNutritionValueRanking();
    const pastMeals = state.mealHistory || [];
    const projections = CostEngine.calculateProjections(state.today.budgetSpent, state.profile.dailyBudget, pastMeals);

    container.innerHTML = `
      <div class="insights-wrapper animate-fade-in">
        <!-- View Header -->
        <div class="view-header-card glassmorphism">
          <div>
            <span class="badge badge-accent">📊 Nutrition Intelligence</span>
            <h2 class="view-title">Weekly Insights & Analytics</h2>
            <p class="view-subtitle">
              Deep dive into your 7-day nutrition trends, cost efficiency, and protein ROI from hostel foods.
            </p>
          </div>
        </div>

        <!-- 4-Card Weekly Averages Summary -->
        <div class="metrics-grid">
          <div class="metric-card glassmorphism card-cal">
            <span class="metric-icon-wrap bg-amber">🔥</span>
            <div>
              <h4 class="metric-label">Avg Daily Calories</h4>
              <div class="metric-value-row">
                <span class="metric-val-current">2,080</span>
                <span class="metric-val-target">kcal/day</span>
              </div>
              <p class="text-xs text-emerald mt-1">✓ On target (2,200 goal)</p>
            </div>
          </div>

          <div class="metric-card glassmorphism card-protein">
            <span class="metric-icon-wrap bg-cyan">💪</span>
            <div>
              <h4 class="metric-label">Avg Daily Protein</h4>
              <div class="metric-value-row">
                <span class="metric-val-current">71.5g</span>
                <span class="metric-val-target">/ 75g target</span>
              </div>
              <p class="text-xs text-cyan mt-1">✓ 95% goal adherence</p>
            </div>
          </div>

          <div class="metric-card glassmorphism card-budget">
            <span class="metric-icon-wrap bg-emerald">💰</span>
            <div>
              <h4 class="metric-label">Avg Daily Spend</h4>
              <div class="metric-value-row">
                <span class="metric-val-current">₹118</span>
                <span class="metric-val-target">/ ₹150 budget</span>
              </div>
              <p class="text-xs text-emerald mt-1">✓ ₹32/day saved</p>
            </div>
          </div>

          <div class="metric-card glassmorphism card-water">
            <span class="metric-icon-wrap bg-accent">⭐</span>
            <div>
              <h4 class="metric-label">Avg Health Score</h4>
              <div class="metric-value-row">
                <span class="metric-val-current">81</span>
                <span class="metric-val-target">/ 100</span>
              </div>
              <p class="text-xs text-accent mt-1">✓ Good/Balanced rating</p>
            </div>
          </div>
        </div>

        <!-- Weekly Chart & AI Report Split -->
        <div class="dashboard-split-grid">
          <!-- 7-Day Calorie & Spend Chart -->
          <div class="content-card glassmorphism">
            <div class="card-section-header">
              <div>
                <h3 class="section-title">📈 7-Day Calorie & Spending Trend</h3>
                <p class="section-sub">Hover bars to see daily intake and cost</p>
              </div>
            </div>
            ${ChartUtils.renderWeeklyBarChart()}
            <div class="chart-legend-row">
              <span class="legend-item"><span class="legend-dot dot-cal"></span> Calories (kcal)</span>
              <span class="legend-item"><span class="legend-dot dot-active"></span> High Compliance Day</span>
            </div>
          </div>

          <!-- AI Weekly Assessment Commentary -->
          <div class="content-card glassmorphism ai-report-card">
            <div class="card-section-header">
              <div>
                <h3 class="section-title">🤖 AI Weekly Food Report</h3>
                <p class="section-sub">Generated from your logged plates & mess choices</p>
              </div>
            </div>
            <div class="ai-report-body">
              <div class="report-point">
                <span class="report-icon">🎯</span>
                <p><strong>Protein Consistency:</strong> You maintained an average of 71.5g protein/day, heavily supported by Monday's Rajma and Wednesday's Paneer Sabzi.</p>
              </div>
              <div class="report-point">
                <span class="report-icon">💰</span>
                <p><strong>Budget Efficiency:</strong> Total estimated weekly spend was <strong>₹826</strong> (well within your ₹1,050 weekly cap). Monthly savings projected at <strong>₹${projections.savingsPotentialMonth}</strong>.</p>
              </div>
              <div class="report-point">
                <span class="report-icon">💡</span>
                <p><strong>Actionable Suggestion:</strong> Add 1 bowl of curd or green cucumber salad to Thursday lunches to boost gut microbiome and digestive fiber.</p>
              </div>
            </div>
          </div>
        </div>

        <!-- Student Nutrition Value-For-Money Table -->
        <div class="content-card glassmorphism value-ranking-card">
          <div class="card-section-header">
            <div>
              <h3 class="section-title">💰 Nutrition Value-For-Money Ranking</h3>
              <p class="section-sub">Top student food hacks ranked by Protein per Rupee (g/₹) and Fiber per Rupee</p>
            </div>
            <span class="badge badge-accent">Hostel Budget Hacks</span>
          </div>

          <div class="table-responsive">
            <table class="value-table">
              <thead>
                <tr>
                  <th>Rank</th>
                  <th>Food Item</th>
                  <th>Category</th>
                  <th>Serving</th>
                  <th>Est. Cost</th>
                  <th>Protein / ₹</th>
                  <th>Fiber / ₹</th>
                </tr>
              </thead>
              <tbody>
                ${valueRankings.bestProteinFoods.map((f, i) => `
                  <tr>
                    <td><span class="rank-badge">${i === 0 ? '🏆 1' : i + 1}</span></td>
                    <td><strong>${f.name}</strong></td>
                    <td><span class="category-pill">${f.category}</span></td>
                    <td>${f.servingDisplay}</td>
                    <td><strong class="text-emerald">₹${f.cost}</strong></td>
                    <td><strong class="text-cyan">${f.proteinPerRupee}g / ₹</strong></td>
                    <td><span class="text-emerald">${f.fiberPerRupee}g / ₹</span></td>
                  </tr>
                `).join('')}
              </tbody>
            </table>
          </div>
        </div>

        <!-- Logged Meal History Timeline -->
        <div class="content-card glassmorphism meal-history-card">
          <div class="card-section-header">
            <div>
              <h3 class="section-title">📜 Logged Meal History</h3>
              <p class="section-sub">Chronological timeline of your past scans and logged meals</p>
            </div>
          </div>

          <div class="history-timeline-list">
            ${pastMeals.map(m => `
              <div class="history-timeline-item">
                <div class="timeline-dot"></div>
                <div class="timeline-content-card">
                  <div class="timeline-header">
                    <div>
                      <span class="timeline-meal-type">${m.mealType || 'Meal'}</span>
                      <h4 class="timeline-title">${m.title || 'Logged Meal'}</h4>
                    </div>
                    <div class="timeline-meta">
                      <span class="timeline-time">${m.time} • ${m.date}</span>
                      <span class="badge badge-health-cat">${m.healthScore}/100</span>
                    </div>
                  </div>
                  <div class="timeline-metrics-strip">
                    <span>🔥 ${m.calories} kcal</span>
                    <span>💪 ${m.protein}g Protein</span>
                    <span>💰 ₹${m.cost}</span>
                    <span>🏷️ ${m.category || 'Balanced'}</span>
                  </div>
                </div>
              </div>
            `).join('')}
          </div>
        </div>
      </div>
    `;
  }
}
