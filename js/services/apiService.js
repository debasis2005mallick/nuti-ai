/**
 * NutriScan AI - Full-Stack API Service Bridge
 * Connects frontend to the Node.js/Python backend server when running, with automatic graceful client-side fallback.
 */

export class ApiService {
  static BACKEND_URL = "http://localhost:5000/api";
  static isBackendAvailable = null;

  /**
   * Check if backend server is online
   */
  static async checkBackendHealth() {
    try {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 1200);

      const res = await fetch(`${this.BACKEND_URL}/health`, { signal: controller.signal });
      clearTimeout(timeoutId);
      this.isBackendAvailable = res.ok;
      return res.ok;
    } catch {
      this.isBackendAvailable = false;
      return false;
    }
  }

  /**
   * Scan plate through Backend API (if available)
   */
  static async scanPlate(imageBase64, apiKey = "") {
    if (this.isBackendAvailable === null) {
      await this.checkBackendHealth();
    }

    if (this.isBackendAvailable) {
      try {
        const response = await fetch(`${this.BACKEND_URL}/scan-plate`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ imageBase64, apiKey })
        });
        if (response.ok) {
          return await response.json();
        }
      } catch (err) {
        console.warn("Backend API request failed, fallback to client-side engine:", err);
      }
    }

    return null; // Fallback to client-side AiVisionService
  }

  /**
   * Search Online Open Food Facts Dataset through Backend API
   */
  static async searchNutritionOnline(query) {
    if (this.isBackendAvailable === null) {
      await this.checkBackendHealth();
    }

    if (this.isBackendAvailable) {
      try {
        const res = await fetch(`${this.BACKEND_URL}/nutrition/search?q=${encodeURIComponent(query)}`);
        if (res.ok) {
          return await res.json();
        }
      } catch (err) {
        console.warn("Backend dataset search failed, falling back to direct API:", err);
      }
    }

    return null;
  }
}
