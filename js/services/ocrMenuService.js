/**
 * NutriScan AI - Hostel Menu OCR & Natural Language Parser
 * Extracts structured mess schedules (Mon-Sun, Breakfast/Lunch/Snacks/Dinner) from image/text inputs.
 */

import { DEFAULT_HOSTEL_MENU } from '../config.js';

export class OcrMenuService {
  /**
   * Parse raw text (from OCR or manual paste) into structured hostel menu JSON
   */
  static parseMenuText(rawText) {
    if (!rawText || rawText.trim().length === 0) {
      return JSON.parse(JSON.stringify(DEFAULT_HOSTEL_MENU));
    }

    const days = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"];
    const mealKeys = ["breakfast", "lunch", "snacks", "dinner"];
    const resultMenu = {};

    // Check if text has specific day headers
    const lines = rawText.split('\n').map(l => l.trim()).filter(l => l.length > 0);
    
    let currentDay = "Monday";
    let currentMeal = "lunch";

    // Initialize days
    days.forEach(d => {
      resultMenu[d] = { breakfast: [], lunch: [], snacks: [], dinner: [] };
    });

    lines.forEach(line => {
      const lower = line.toLowerCase();

      // Check if line is a Day header
      const matchedDay = days.find(d => lower.includes(d.toLowerCase()));
      if (matchedDay) {
        currentDay = matchedDay;
        return;
      }

      // Check if line is a Meal header
      if (lower.startsWith("breakfast") || lower.includes("breakfast:")) {
        currentMeal = "breakfast";
        const content = line.replace(/breakfast:?/i, '').trim();
        if (content) this.addItemsToMeal(resultMenu[currentDay][currentMeal], content);
        return;
      } else if (lower.startsWith("lunch") || lower.includes("lunch:")) {
        currentMeal = "lunch";
        const content = line.replace(/lunch:?/i, '').trim();
        if (content) this.addItemsToMeal(resultMenu[currentDay][currentMeal], content);
        return;
      } else if (lower.startsWith("snack") || lower.includes("snacks:") || lower.includes("tea:")) {
        currentMeal = "snacks";
        const content = line.replace(/snacks?:?|tea:?/i, '').trim();
        if (content) this.addItemsToMeal(resultMenu[currentDay][currentMeal], content);
        return;
      } else if (lower.startsWith("dinner") || lower.includes("dinner:")) {
        currentMeal = "dinner";
        const content = line.replace(/dinner:?/i, '').trim();
        if (content) this.addItemsToMeal(resultMenu[currentDay][currentMeal], content);
        return;
      }

      // Otherwise, treated as food item under current meal
      this.addItemsToMeal(resultMenu[currentDay][currentMeal], line);
    });

    // Clean up empty days with defaults
    days.forEach(d => {
      mealKeys.forEach(m => {
        if (!resultMenu[d][m] || resultMenu[d][m].length === 0) {
          resultMenu[d][m] = DEFAULT_HOSTEL_MENU[d] ? DEFAULT_HOSTEL_MENU[d][m] || [] : ["Rice", "Dal", "Roti"];
        }
      });
    });

    return resultMenu;
  }

  /**
   * Helper to split comma, slash, or plus separated foods
   */
  static addItemsToMeal(targetArray, text) {
    if (!text) return;
    const parts = text.split(/[,+/\n\t•\-]/).map(p => p.trim()).filter(p => p.length > 1);
    parts.forEach(p => {
      // Avoid duplicate insertion
      if (!targetArray.includes(p)) {
        targetArray.push(p);
      }
    });
  }

  /**
   * Simulate AI Vision OCR for Hostel Menu Image (Realistic simulation with delay & progress)
   */
  static async extractMenuFromImage(imageFileOrUrl, onProgress = () => {}) {
    onProgress("Scanning hostel notice board image...", 20);
    await new Promise(r => setTimeout(r, 400));
    
    onProgress("Detecting text regions and layout...", 50);
    await new Promise(r => setTimeout(r, 400));

    onProgress("Segmenting days and meal categories...", 80);
    await new Promise(r => setTimeout(r, 300));

    onProgress("Extracting items into nutrition database...", 100);

    // Return the realistic weekly menu structure
    return JSON.parse(JSON.stringify(DEFAULT_HOSTEL_MENU));
  }
}
