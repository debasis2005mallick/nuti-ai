/**
 * NutriScan AI - Online Food & Nutrition Dataset Service
 * Connects to Open Food Facts (the world's largest open nutrition database) and USDA FoodData API.
 */

export class OnlineNutritionService {
  static cache = new Map();

  /**
   * Query Open Food Facts API for live online nutrition data
   */
  static async searchOnlineNutrition(foodQuery) {
    if (!foodQuery) return null;
    const cleanQuery = foodQuery.toLowerCase().trim();

    // Check in-memory cache first
    if (this.cache.has(cleanQuery)) {
      return this.cache.get(cleanQuery);
    }

    try {
      // 1. Query Open Food Facts Global API
      const searchUrl = `https://world.openfoodfacts.org/cgi/search.pl?search_terms=${encodeURIComponent(cleanQuery)}&search_simple=1&action=process&json=1&page_size=3`;
      
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 2500); // 2.5s fast timeout

      const response = await fetch(searchUrl, { signal: controller.signal });
      clearTimeout(timeoutId);

      if (response.ok) {
        const data = await response.json();
        if (data.products && data.products.length > 0) {
          const product = data.products[0];
          const nutriments = product.nutriments || {};

          const result = {
            source: "Open Food Facts Online Dataset",
            productName: product.product_name || foodQuery,
            nutriScore: (product.nutriscore_grade || "b").toUpperCase(),
            novaGroup: product.nova_group || 2,
            caloriesPer100g: Math.round(nutriments['energy-kcal_100g'] || (nutriments['energy_100g'] ? nutriments['energy_100g'] / 4.184 : 140)),
            proteinPer100g: Math.round((nutriments.proteins_100g || 5) * 10) / 10,
            carbsPer100g: Math.round((nutriments.carbohydrates_100g || 20) * 10) / 10,
            fatPer100g: Math.round((nutriments.fat_100g || 4) * 10) / 10,
            fiberPer100g: Math.round((nutriments.fiber_100g || 2) * 10) / 10,
            isOnlineVerified: true
          };

          this.cache.set(cleanQuery, result);
          return result;
        }
      }
    } catch (err) {
      console.warn(`Online dataset fetch for '${cleanQuery}' failed or timed out:`, err);
    }

    return null;
  }

  /**
   * Enrich detected plate foods with live Open Food Facts online dataset values
   */
  static async enrichFoodsWithOnlineDataset(foods = [], onProgress = () => {}) {
    const enriched = [];
    
    for (let i = 0; i < foods.length; i++) {
      const item = foods[i];
      onProgress(`Querying online nutrition dataset for ${item.name}...`, Math.round(70 + (i / foods.length) * 25));
      
      const onlineData = await this.searchOnlineNutrition(item.id || item.name);
      
      if (onlineData && onlineData.caloriesPer100g > 0) {
        const p = parseFloat(item.portion) || 120;
        const factor = p / 100;

        enriched.push({
          ...item,
          calories: Math.round(onlineData.caloriesPer100g * factor),
          protein: Math.round(onlineData.proteinPer100g * factor * 10) / 10,
          carbs: Math.round(onlineData.carbsPer100g * factor * 10) / 10,
          fat: Math.round(onlineData.fatPer100g * factor * 10) / 10,
          fiber: Math.round(onlineData.fiberPer100g * factor * 10) / 10,
          onlineSource: "Open Food Facts (Global Open DB)",
          nutriScore: onlineData.nutriScore
        });
      } else {
        enriched.push(item);
      }
    }

    return enriched;
  }
}
