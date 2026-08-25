/**
 * NutriScan AI - Chart & Visualization Utility
 * High-performance SVG-based charts without bulky external charting dependencies.
 */

export class ChartUtils {
  /**
   * Render SVG Macronutrient Donut Chart
   * Protein (Cyan), Carbs (Amber), Fat (Coral), Fiber (Emerald)
   */
  static renderMacroDonut(proteinG = 20, carbsG = 80, fatG = 20, fiberG = 8, size = 160) {
    const pCal = (proteinG || 0) * 4;
    const cCal = (carbsG || 0) * 4;
    const fCal = (fatG || 0) * 9;
    const fibCal = (fiberG || 0) * 2;
    const total = pCal + cCal + fCal + fibCal || 100;

    const pPct = (pCal / total) * 100;
    const cPct = (cCal / total) * 100;
    const fPct = (fCal / total) * 100;
    const fibPct = (fibCal / total) * 100;

    const radius = 60;
    const circumference = 2 * Math.PI * radius; // ~377

    // Offset accumulations
    const pDash = (pPct / 100) * circumference;
    const cDash = (cPct / 100) * circumference;
    const fDash = (fPct / 100) * circumference;
    const fibDash = (fibPct / 100) * circumference;

    let offset = 0;
    const pOffset = offset;
    offset -= pDash;
    const cOffset = offset;
    offset -= cDash;
    const fOffset = offset;
    offset -= fDash;
    const fibOffset = offset;

    const totalKcal = Math.round(pCal + cCal + fCal + fibCal);

    return `
      <div class="macro-donut-container" style="width: ${size}px; height: ${size}px;">
        <svg viewBox="0 0 160 160" width="${size}" height="${size}" class="macro-donut-svg">
          <circle cx="80" cy="80" r="${radius}" fill="none" stroke="rgba(255,255,255,0.06)" stroke-width="18" />
          
          <!-- Protein Segment (Cyan) -->
          <circle cx="80" cy="80" r="${radius}" fill="none" stroke="#06B6D4" stroke-width="18"
            stroke-dasharray="${pDash} ${circumference}" stroke-dashoffset="${pOffset}"
            stroke-linecap="round" class="donut-segment" />

          <!-- Carbs Segment (Amber) -->
          <circle cx="80" cy="80" r="${radius}" fill="none" stroke="#F59E0B" stroke-width="18"
            stroke-dasharray="${cDash} ${circumference}" stroke-dashoffset="${cOffset}"
            stroke-linecap="round" class="donut-segment" />

          <!-- Fat Segment (Coral) -->
          <circle cx="80" cy="80" r="${radius}" fill="none" stroke="#F43F5E" stroke-width="18"
            stroke-dasharray="${fDash} ${circumference}" stroke-dashoffset="${fOffset}"
            stroke-linecap="round" class="donut-segment" />

          <!-- Fiber Segment (Emerald) -->
          <circle cx="80" cy="80" r="${radius}" fill="none" stroke="#10B981" stroke-width="18"
            stroke-dasharray="${fibDash} ${circumference}" stroke-dashoffset="${fibOffset}"
            stroke-linecap="round" class="donut-segment" />
        </svg>
        <div class="donut-center-text">
          <span class="donut-center-val">${totalKcal}</span>
          <span class="donut-center-unit">kcal</span>
        </div>
      </div>
    `;
  }

  /**
   * Render Radial Progress Ring
   */
  static renderRadialProgress(percent, label, value, color = "#10B981", size = 110) {
    const clamped = Math.max(0, Math.min(100, percent || 0));
    const radius = 42;
    const circumference = 2 * Math.PI * radius; // ~264
    const strokeDash = (clamped / 100) * circumference;

    return `
      <div class="radial-ring-container" style="width:${size}px; height:${size}px;">
        <svg viewBox="0 0 100 100" width="${size}" height="${size}">
          <circle cx="50" cy="50" r="${radius}" fill="none" stroke="rgba(255,255,255,0.08)" stroke-width="10" />
          <circle cx="50" cy="50" r="${radius}" fill="none" stroke="${color}" stroke-width="10"
            stroke-dasharray="${strokeDash} ${circumference}" stroke-dashoffset="0"
            stroke-linecap="round" transform="rotate(-90 50 50)" class="radial-progress-bar" />
        </svg>
        <div class="radial-center-text">
          <span class="radial-val">${value}</span>
          <span class="radial-lbl">${label}</span>
        </div>
      </div>
    `;
  }

  /**
   * Render 7-Day Calorie & Cost Bar Chart
   */
  static renderWeeklyBarChart(historyDays = []) {
    const days = historyDays.length > 0 ? historyDays : [
      { day: "Mon", cal: 2150, cost: 130, health: 80 },
      { day: "Tue", cal: 1980, cost: 110, health: 76 },
      { day: "Wed", cal: 2240, cost: 145, health: 85 },
      { day: "Thu", cal: 1850, cost: 95, health: 78 },
      { day: "Fri", cal: 2310, cost: 155, health: 88 },
      { day: "Sat", cal: 2050, cost: 120, health: 82 },
      { day: "Sun", cal: 2100, cost: 140, health: 84 }
    ];

    const maxCal = 2500;

    const barsHtml = days.map(d => {
      const heightPct = Math.round((d.cal / maxCal) * 100);
      const isToday = d.day === "Sun" || d.day === "Mon";
      return `
        <div class="chart-col ${isToday ? 'active-col' : ''}">
          <div class="bar-track">
            <div class="bar-fill" style="height: ${heightPct}%;" data-tooltip="${d.cal} kcal | ₹${d.cost}"></div>
          </div>
          <span class="col-day">${d.day}</span>
        </div>
      `;
    }).join("");

    return `
      <div class="weekly-bar-chart">
        <div class="chart-bars-row">
          ${barsHtml}
        </div>
      </div>
    `;
  }
}
