/**
 * NutriScan AI - Multi-Food AI Scanner View
 * Plate recognition, portion editing, multi-food table breakdown, donut chart & health score.
 */

import { store } from '../state.js';
import { AiVisionService } from '../services/aiVisionService.js';
import { NutritionEngine } from '../services/nutritionEngine.js';
import { ChartUtils } from '../utils/charts.js';
import { Helpers } from '../utils/helpers.js';
import { DEMO_MEAL_PLATES, NUTRITION_DATABASE } from '../config.js';

export class ScannerView {
  static currentScanResult = null;
  static currentImageSrc = "assets/demo/indian_thali.jpg";

  static render(container) {
    const state = store.getState();

    // Default to Indian Thali if no scan yet
    if (!this.currentScanResult) {
      this.currentScanResult = NutritionEngine.calculatePlateNutrition(DEMO_MEAL_PLATES.thali.foods);
      this.currentImageSrc = DEMO_MEAL_PLATES.thali.image;
    }

    container.innerHTML = `
      <div class="scanner-wrapper animate-fade-in">
        <!-- Scanner Header -->
        <div class="view-header-card glassmorphism">
          <div>
            <div class="d-flex align-center gap-2 mb-1">
              <span class="badge badge-accent">📸 AI Multi-Food Scanner</span>
              <span class="badge badge-score">🌐 Open Food Facts Live Dataset</span>
            </div>
            <h2 class="view-title">Scan & Analyze Your Plate</h2>
            <p class="view-subtitle">
              Identifies multiple foods on a single plate, calculates itemized macros from live open datasets & estimated costs.
            </p>
          </div>
          <div class="header-actions">
            <span class="text-muted text-sm">Presets:</span>
            <button class="btn btn-sm btn-demo" data-demo="thali">🍛 Thali</button>
            <button class="btn btn-sm btn-demo" data-demo="junk">🍜 Maggi</button>
            <button class="btn btn-sm btn-demo" data-demo="gym">💪 Gym</button>
          </div>
        </div>

        <!-- Scanner Main Split Grid -->
        <div class="scanner-split-grid">
          <!-- Left Column: Input, Camera & Image Preview -->
          <div class="scanner-left-pane">
            <div class="content-card glassmorphism upload-card">
              <div class="plate-preview-box">
                <img id="scanned-plate-img" src="${this.currentImageSrc}" alt="Scanned Food Plate" class="plate-img" />
                
                <!-- Floating Computer Vision Food Tags Overlay -->
                <div class="plate-vision-tags-overlay">
                  ${(this.currentScanResult.foods || []).slice(0, 4).map((f, i) => `
                    <div class="floating-vision-tag tag-pos-${i}" data-food-idx="${i}">
                      <span class="tag-pulse-dot"></span>
                      <span class="tag-title">${f.name}</span>
                      <span class="tag-cal">${f.calories} kcal</span>
                    </div>
                  `).join('')}
                </div>

                <div id="scanner-progress-overlay" class="scanner-overlay hidden">
                  <div class="spinner-ring"></div>
                  <h4 id="scanner-progress-title" class="progress-title">Analyzing Plate...</h4>
                  <p id="scanner-progress-sub" class="progress-sub">Detecting individual food items</p>
                </div>
              </div>

              <!-- Upload & Camera Trigger Bar -->
              <div class="scanner-controls-row">
                <label for="food-file-input" class="btn btn-primary btn-block">
                  <span class="btn-icon">📁</span> Upload Image
                </label>
                <input type="file" id="food-file-input" accept="image/*" class="hidden-input" />
                
                <button id="btn-open-camera" class="btn btn-secondary">
                  <span class="btn-icon">📷</span> Camera
                </button>
              </div>

              <div class="dropzone-hint">
                <span>💡 Supported formats: JPG, PNG, WebP • Large images compressed automatically</span>
              </div>
            </div>

            <!-- Live Health Score & Insights Card -->
            <div class="content-card glassmorphism score-card">
              <div class="score-header-row">
                <div>
                  <h3 class="card-title">Plate Health Score</h3>
                  <span class="badge badge-health-cat">${this.currentScanResult.health_category}</span>
                </div>
                <div class="score-number-bubble">
                  <span class="score-val">${this.currentScanResult.health_score}</span>
                  <span class="score-max">/100</span>
                </div>
              </div>

              <p class="score-summary-text">${this.currentScanResult.meal_summary}</p>

              <div class="insights-dual-col">
                <div class="insight-box box-good">
                  <h5 class="insight-heading text-emerald">✓ Doing Well</h5>
                  <ul class="insight-list">
                    ${this.currentScanResult.doing_well.map(item => `<li>${item}</li>`).join('')}
                  </ul>
                </div>
                <div class="insight-box box-improve">
                  <h5 class="insight-heading text-amber">⚠ To Improve</h5>
                  <ul class="insight-list">
                    ${this.currentScanResult.to_improve.map(item => `<li>${item}</li>`).join('')}
                  </ul>
                </div>
              </div>
            </div>
          </div>

          <!-- Right Column: Nutrition Breakdown & Live Plate Editor -->
          <div class="scanner-right-pane">
            <!-- Plate Macros Summary Banner -->
            <div class="content-card glassmorphism macros-banner-card">
              <div class="macro-donut-wrapper">
                ${ChartUtils.renderMacroDonut(
                  this.currentScanResult.total.protein_g,
                  this.currentScanResult.total.carbs_g,
                  this.currentScanResult.total.fat_g,
                  this.currentScanResult.total.fiber_g,
                  140
                )}
              </div>
              <div class="macro-stats-grid">
                <div class="macro-stat-box box-cal">
                  <span class="stat-lbl">Calories</span>
                  <span class="stat-val">${this.currentScanResult.total.calories} <small>kcal</small></span>
                </div>
                <div class="macro-stat-box box-protein">
                  <span class="stat-lbl">Protein</span>
                  <span class="stat-val">${this.currentScanResult.total.protein_g}g</span>
                </div>
                <div class="macro-stat-box box-carbs">
                  <span class="stat-lbl">Carbs</span>
                  <span class="stat-val">${this.currentScanResult.total.carbs_g}g</span>
                </div>
                <div class="macro-stat-box box-fat">
                  <span class="stat-lbl">Fat</span>
                  <span class="stat-val">${this.currentScanResult.total.fat_g}g</span>
                </div>
                <div class="macro-stat-box box-fiber">
                  <span class="stat-lbl">Fiber</span>
                  <span class="stat-val">${this.currentScanResult.total.fiber_g}g</span>
                </div>
                <div class="macro-stat-box box-cost">
                  <span class="stat-lbl">Est. Cost</span>
                  <span class="stat-val">₹${this.currentScanResult.total.estimated_cost}</span>
                </div>
              </div>
            </div>

            <!-- Multi-Food Item Breakdown & Live Editor -->
            <div class="content-card glassmorphism plate-editor-card">
              <div class="card-section-header">
                <div>
                  <h3 class="section-title">Detected Food Items (${this.currentScanResult.foods.length})</h3>
                  <p class="section-sub">Edit portions or add foods to recalculate in real-time</p>
                </div>
                <button id="btn-add-food-item" class="btn btn-sm btn-secondary">
                  <span>➕ Add Food</span>
                </button>
              </div>

              <!-- Table of Detected Foods -->
              <div class="table-responsive">
                <table class="food-items-table">
                  <thead>
                    <tr>
                      <th>Food Item</th>
                      <th>Portion</th>
                      <th>Calories</th>
                      <th>Protein</th>
                      <th>Cost</th>
                      <th>Action</th>
                    </tr>
                  </thead>
                  <tbody id="detected-foods-tbody">
                    ${this.renderFoodRows(this.currentScanResult.foods)}
                  </tbody>
                </table>
              </div>

              <!-- Log Meal & Next Meal Planning Actions -->
              <div class="plate-action-footer">
                <button id="btn-log-scanned-meal" class="btn btn-primary-glow btn-block btn-lg mb-2">
                  <span class="btn-icon">💾</span> Log This Meal to My Daily Tracker
                </button>
                <button id="btn-plan-next-meal" class="btn btn-secondary btn-block">
                  <span class="btn-icon">🏠</span> Plan Next Meal from Hostel Menu (Within Budget) ➔
                </button>
              </div>
            </div>
          </div>
        </div>

        <!-- Add Food Modal (Hidden by default) -->
        <div id="add-food-modal" class="modal-backdrop hidden">
          <div class="modal-card glassmorphism animate-scale-in">
            <div class="modal-header">
              <h3>Add Food from Indian Database</h3>
              <button id="btn-close-modal" class="btn-close">✕</button>
            </div>
            <div class="modal-body">
              <label class="input-label">Select Dish:</label>
              <select id="select-food-db" class="form-select">
                ${Object.entries(NUTRITION_DATABASE).map(([key, item]) => `
                  <option value="${key}">${item.name} (${item.category} • ${item.defaultServing} ${item.servingUnit})</option>
                `).join('')}
              </select>

              <label class="input-label mt-3">Portion Size:</label>
              <div class="input-group">
                <input type="number" id="input-new-portion" class="form-input" value="150" min="1" max="1000" />
                <span class="input-suffix">grams/pcs</span>
              </div>
            </div>
            <div class="modal-footer">
              <button id="btn-confirm-add-food" class="btn btn-primary">Add to Plate</button>
            </div>
          </div>
        </div>

        <!-- Live Camera Stream Modal (Full Screen / Interactive) -->
        <div id="live-camera-modal" class="modal-backdrop hidden">
          <div class="modal-card live-camera-card glassmorphism animate-scale-in">
            <div class="modal-header">
              <div class="camera-title-group">
                <span class="pulse-dot"></span>
                <h3>Live Plate Scanner</h3>
              </div>
              <button id="btn-close-camera" class="btn-close">✕</button>
            </div>
            
            <div class="camera-viewport-box">
              <video id="live-camera-video" autoplay playsinline muted class="camera-video-element"></video>
              
              <!-- Viewfinder Reticle & Laser Scan Line -->
              <div class="camera-viewfinder-overlay">
                <div class="viewfinder-corner corner-tl"></div>
                <div class="viewfinder-corner corner-tr"></div>
                <div class="viewfinder-corner corner-bl"></div>
                <div class="viewfinder-corner corner-br"></div>
                <div class="laser-scanner-line"></div>
                <span class="viewfinder-hint">Position food plate inside frame</span>
              </div>
            </div>

            <div class="camera-controls-footer">
              <button id="btn-switch-camera" class="btn btn-secondary btn-sm" title="Switch Camera">
                <span>🔄 Switch Camera</span>
              </button>
              <button id="btn-snap-photo" class="btn btn-primary-glow btn-lg btn-snap">
                <span>📸 Capture & Analyze Plate</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    `;

    this.attachEvents(container);
  }

  static renderFoodRows(foods) {
    return foods.map((food, idx) => `
      <tr class="food-row" data-idx="${idx}">
        <td>
          <div class="food-name-cell">
            <span class="food-name">${food.name}</span>
            <span class="food-confidence">${Math.round((food.confidence || 0.90) * 100)}% confidence</span>
          </div>
        </td>
        <td>
          <div class="portion-edit-wrap">
            <input type="number" class="input-portion" value="${food.portion}" data-idx="${idx}" min="1" max="1000" />
            <span class="portion-unit">${food.unit}</span>
          </div>
        </td>
        <td><strong>${food.calories}</strong> kcal</td>
        <td><strong class="text-cyan">${food.protein}g</strong></td>
        <td><strong class="text-emerald">₹${food.cost}</strong></td>
        <td>
          <button class="btn-delete-row" data-idx="${idx}" title="Remove Item">🗑️</button>
        </td>
      </tr>
    `).join('');
  }

  static activeCameraStream = null;
  static currentFacingMode = "environment";

  static attachEvents(container) {
    // 1-Click Demo Buttons
    container.querySelectorAll(".btn-demo").forEach(btn => {
      btn.addEventListener("click", (e) => {
        const demoType = e.currentTarget.dataset.demo;
        this.loadDemoPreset(demoType, container);
      });
    });

    // File Input Upload
    const fileInput = container.querySelector("#food-file-input");
    fileInput?.addEventListener("change", async (e) => {
      if (e.target.files && e.target.files[0]) {
        const file = e.target.files[0];
        const compressed = await Helpers.compressImage(file);
        this.currentImageSrc = compressed;
        container.querySelector("#scanned-plate-img").src = compressed;

        await this.runAiScan(compressed, container);
      }
    });

    // Live Camera Stream Modal Trigger
    const cameraBtn = container.querySelector("#btn-open-camera");
    const cameraModal = container.querySelector("#live-camera-modal");
    const videoEl = container.querySelector("#live-camera-video");
    const closeCameraBtn = container.querySelector("#btn-close-camera");
    const snapBtn = container.querySelector("#btn-snap-photo");
    const switchCamBtn = container.querySelector("#btn-switch-camera");

    cameraBtn?.addEventListener("click", async () => {
      try {
        cameraModal.classList.remove("hidden");
        this.activeCameraStream = await Helpers.startCameraStream(videoEl, this.currentFacingMode);
        Helpers.showToast("Live camera active! Position plate in viewfinder 📸", "info");
      } catch (err) {
        console.warn("Live camera access failed or denied, opening file selector fallback:", err);
        cameraModal.classList.add("hidden");
        Helpers.showToast("Camera permission denied or unavailable. Please upload a photo.", "error");
        fileInput.click();
      }
    });

    const stopAndCloseCamera = () => {
      if (this.activeCameraStream) {
        Helpers.stopCameraStream(this.activeCameraStream);
        this.activeCameraStream = null;
      }
      cameraModal.classList.add("hidden");
    };

    closeCameraBtn?.addEventListener("click", stopAndCloseCamera);

    // Switch Front/Back Camera
    switchCamBtn?.addEventListener("click", async () => {
      if (this.activeCameraStream) {
        Helpers.stopCameraStream(this.activeCameraStream);
      }
      this.currentFacingMode = this.currentFacingMode === "environment" ? "user" : "environment";
      try {
        this.activeCameraStream = await Helpers.startCameraStream(videoEl, this.currentFacingMode);
      } catch (e) {
        console.warn("Switch camera failed:", e);
      }
    });

    // Snap & Analyze Plate from Live Stream
    snapBtn?.addEventListener("click", async () => {
      if (videoEl && videoEl.videoWidth) {
        const capturedFrame = Helpers.captureVideoFrame(videoEl);
        stopAndCloseCamera();

        this.currentImageSrc = capturedFrame;
        container.querySelector("#scanned-plate-img").src = capturedFrame;
        Helpers.showToast("Plate captured! Running AI Vision...", "info");

        await this.runAiScan(capturedFrame, container);
      } else {
        stopAndCloseCamera();
        fileInput.click();
      }
    });

    // Portion inputs change
    container.querySelectorAll(".input-portion").forEach(input => {
      input.addEventListener("change", (e) => {
        const idx = parseInt(e.target.dataset.idx, 10);
        const newPortion = parseFloat(e.target.value) || 100;
        this.currentScanResult.foods[idx].portion = newPortion;
        this.recalculateAndRefresh(container);
      });
    });

    // Delete Row
    container.querySelectorAll(".btn-delete-row").forEach(btn => {
      btn.addEventListener("click", (e) => {
        const idx = parseInt(e.currentTarget.dataset.idx, 10);
        this.currentScanResult.foods.splice(idx, 1);
        this.recalculateAndRefresh(container);
        Helpers.showToast("Item removed from plate", "info");
      });
    });

    // Add Food Modal Open
    const addBtn = container.querySelector("#btn-add-food-item");
    const modal = container.querySelector("#add-food-modal");
    addBtn?.addEventListener("click", () => {
      modal.classList.remove("hidden");
    });

    container.querySelector("#btn-close-modal")?.addEventListener("click", () => {
      modal.classList.add("hidden");
    });

    container.querySelector("#btn-confirm-add-food")?.addEventListener("click", () => {
      const selectedKey = container.querySelector("#select-food-db").value;
      const portionVal = parseFloat(container.querySelector("#input-new-portion").value) || 100;
      const dbEntry = NUTRITION_DATABASE[selectedKey];
      
      this.currentScanResult.foods.push({
        id: selectedKey,
        name: dbEntry.name,
        portion: portionVal,
        unit: dbEntry.servingUnit || "g",
        confidence: 0.95
      });

      modal.classList.add("hidden");
      this.recalculateAndRefresh(container);
      Helpers.showToast(`Added ${dbEntry.name} to plate`, "success");
    });

    // Log Plate to Daily Tracker
    container.querySelector("#btn-log-scanned-meal")?.addEventListener("click", () => {
      store.logMeal({
        name: "Scanned Multi-Food Plate",
        calories: this.currentScanResult.total.calories,
        protein: this.currentScanResult.total.protein_g,
        carbs: this.currentScanResult.total.carbs_g,
        fat: this.currentScanResult.total.fat_g,
        fiber: this.currentScanResult.total.fiber_g,
        cost: this.currentScanResult.total.estimated_cost,
        healthScore: this.currentScanResult.health_score,
        category: this.currentScanResult.health_category,
        foods: this.currentScanResult.foods
      });

      Helpers.showToast("Logged to daily tracker & streaks! 🔥", "fire");
      store.setTab("dashboard");
    });

    // Plan Next Meal from Hostel Menu
    container.querySelector("#btn-plan-next-meal")?.addEventListener("click", () => {
      store.setTab("planner");
    });
  }

  static async runAiScan(imageSrc, container) {
    const overlay = container.querySelector("#scanner-progress-overlay");
    const titleEl = container.querySelector("#scanner-progress-title");
    const subEl = container.querySelector("#scanner-progress-sub");

    overlay.classList.remove("hidden");

    const state = store.getState();
    const result = await AiVisionService.analyzeFoodImage(
      imageSrc,
      state.profile.geminiApiKey,
      (status, pct) => {
        if (titleEl) titleEl.innerText = `${status} (${pct}%)`;
      }
    );

    overlay.classList.add("hidden");
    this.currentScanResult = result;
    this.render(container);
    Helpers.showToast("Plate analyzed successfully!", "success");
  }

  static loadDemoPreset(demoKey, container) {
    const demo = DEMO_MEAL_PLATES[demoKey] || DEMO_MEAL_PLATES.thali;
    this.currentImageSrc = demo.image;
    this.currentScanResult = NutritionEngine.calculatePlateNutrition(demo.foods);
    this.render(container);
    Helpers.showToast(`Loaded ${demo.title} demo`, "info");
  }

  static recalculateAndRefresh(container) {
    this.currentScanResult = NutritionEngine.calculatePlateNutrition(this.currentScanResult.foods);
    this.render(container);
  }
}
