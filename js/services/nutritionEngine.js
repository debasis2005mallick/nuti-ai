/**
 * NutriScan AI - Deterministic Nutrition Engine
 * High-accuracy deterministic calculations for multi-food plates, portions, macros and explainable health scores.
 */

import { NUTRITION_DATABASE } from '../config.js';

export class NutritionEngine {
  /**
   * Find nutrition specs from database by food key or closest name match
   */
  static findFoodDbEntry(foodNameOrKey) {
    if (!foodNameOrKey) return null;
    const lower = foodNameOrKey.toLowerCase().trim();

    // Direct key match
    if (NUTRITION_DATABASE[lower]) {
      return { key: lower, ...NUTRITION_DATABASE[lower] };
    }

    // Fuzzy or substring match
    for (const [key, item] of Object.entries(NUTRITION_DATABASE)) {
      if (
        key.includes(lower) || 
        lower.includes(key) || 
        item.name.toLowerCase().includes(lower) ||
        lower.includes(item.name.toLowerCase())
      ) {
        return { key, ...item };
      }
    }

    // Default fallback entry for unknown hostel items
    return {
      key: "generic_hostel_dish",
      name: foodNameOrKey,
      category: "General",
      servingUnit: "g",
      defaultServing: 120,
      caloriesPer100g: 140,
      proteinPer100g: 4.5,
      carbsPer100g: 22.0,
      fatPer100g: 4.0,
      fiberPer100g: 2.0,
      costPerServing: 20,
      diet: "veg",
      glycemicIndex: "medium"
    };
  }

  /**
   * Calculate single food item nutrients given a portion (grams or pieces)
   */
  static calculateItemNutrition(foodKeyOrName, portion, unit = 'g') {
    const dbItem = this.findFoodDbEntry(foodKeyOrName);
    const p = parseFloat(portion) || dbItem.defaultServing || 100;

    let calories = 0;
    let protein = 0;
    let carbs = 0;
    let fat = 0;
    let fiber = 0;
    let cost = 0;

    if (unit === 'piece' || dbItem.servingUnit === 'piece' || dbItem.servingUnit === 'pack' || dbItem.servingUnit === 'can') {
      const pieceCount = p;
      if (dbItem.caloriesPerPiece) {
        calories = dbItem.caloriesPerPiece * pieceCount;
        protein = (dbItem.proteinPerPiece || 0) * pieceCount;
        carbs = (dbItem.carbsPerPiece || 0) * pieceCount;
        fat = (dbItem.fatPerPiece || 0) * pieceCount;
        fiber = (dbItem.fiberPerPiece || 0) * pieceCount;
        cost = (dbItem.costPerPiece || dbItem.costPerServing || 15) * pieceCount;
      } else {
        // Assume ~50g per piece
        const grams = pieceCount * 50;
        const factor = grams / 100;
        calories = dbItem.caloriesPer100g * factor;
        protein = dbItem.proteinPer100g * factor;
        carbs = dbItem.carbsPer100g * factor;
        fat = dbItem.fatPer100g * factor;
        fiber = dbItem.fiberPer100g * factor;
        cost = (dbItem.costPerServing || 15) * (grams / (dbItem.defaultServing || 100));
      }
    } else {
      // Standard gram-based calculation
      const factor = p / 100;
      calories = dbItem.caloriesPer100g * factor;
      protein = dbItem.proteinPer100g * factor;
      carbs = dbItem.carbsPer100g * factor;
      fat = dbItem.fatPer100g * factor;
      fiber = dbItem.fiberPer100g * factor;
      
      const servingRatio = p / (dbItem.defaultServing || 100);
      cost = (dbItem.costPerServing || 20) * servingRatio;
    }

    return {
      key: dbItem.key,
      name: dbItem.name,
      category: dbItem.category,
      diet: dbItem.diet,
      portion: p,
      unit: unit || dbItem.servingUnit,
      calories: Math.round(calories),
      protein: Math.round(protein * 10) / 10,
      carbs: Math.round(carbs * 10) / 10,
      fat: Math.round(fat * 10) / 10,
      fiber: Math.round(fiber * 10) / 10,
      cost: Math.max(5, Math.round(cost))
    };
  }

  /**
   * Calculate multi-food plate aggregate totals and health score
   */
  static calculatePlateNutrition(items = []) {
    let totalCalories = 0;
    let totalProtein = 0;
    let totalCarbs = 0;
    let totalFat = 0;
    let totalFiber = 0;
    let totalCost = 0;

    const detailedFoods = items.map(item => {
      const calculated = this.calculateItemNutrition(
        item.id || item.key || item.name,
        item.portion,
        item.unit
      );
      
      totalCalories += calculated.calories;
      totalProtein += calculated.protein;
      totalCarbs += calculated.carbs;
      totalFat += calculated.fat;
      totalFiber += calculated.fiber;
      totalCost += calculated.cost;

      return {
        ...calculated,
        confidence: item.confidence || 0.90
      };
    });

    // Compute Explainable Health Score (0-100)
    const healthAnalysis = this.computeHealthScore({
      calories: totalCalories,
      protein: totalProtein,
      carbs: totalCarbs,
      fat: totalFat,
      fiber: totalFiber,
      foods: detailedFoods
    });

    return {
      foods: detailedFoods,
      total: {
        calories: Math.round(totalCalories),
        protein_g: Math.round(totalProtein * 10) / 10,
        carbs_g: Math.round(totalCarbs * 10) / 10,
        fat_g: Math.round(totalFat * 10) / 10,
        fiber_g: Math.round(totalFiber * 10) / 10,
        estimated_cost: Math.round(totalCost)
      },
      health_score: healthAnalysis.score,
      health_category: healthAnalysis.category,
      doing_well: healthAnalysis.doingWell,
      to_improve: healthAnalysis.toImprove,
      meal_summary: healthAnalysis.summary
    };
  }

  /**
   * Explainable Health Score Algorithm (0 to 100)
   * Evaluates macro ratios, protein density, fiber, vegetable presence, and junk/deep-fried penalty.
   */
  static computeHealthScore({ calories, protein, carbs, fat, fiber, foods }) {
    if (!calories || calories <= 0) {
      return {
        score: 0,
        category: "Needs Improvement",
        doingWell: [],
        toImprove: ["No food detected on plate"],
        summary: "Please add foods to calculate your health score."
      };
    }

    let score = 70; // Base score
    const doingWell = [];
    const toImprove = [];

    // 1. Protein Check (Ideal: >15% of total calories or >20g for a main meal)
    const proteinCalories = protein * 4;
    const proteinRatio = proteinCalories / calories;

    if (proteinRatio >= 0.20 || protein >= 25) {
      score += 12;
      doingWell.push("High protein density for muscle repair and satiety");
    } else if (proteinRatio >= 0.14 || protein >= 15) {
      score += 6;
      doingWell.push("Good balanced protein foundation");
    } else {
      score -= 10;
      toImprove.push("Low protein content — add dal, eggs, paneer, curd, or soya");
    }

    // 2. Fiber & Vegetable Check (Ideal: >6g fiber per main meal)
    if (fiber >= 8) {
      score += 10;
      doingWell.push("Rich in dietary fiber for optimal digestion and gut health");
    } else if (fiber >= 4) {
      score += 5;
      doingWell.push("Contains dietary fiber and essential micronutrients");
    } else {
      score -= 8;
      toImprove.push("Low in dietary fiber — include salad, green vegetables, or lentils");
    }

    // 3. Healthy vs Junk items check
    let hasJunk = false;
    let hasFreshSalad = false;
    let hasCurdOrDal = false;

    foods.forEach(f => {
      const name = (f.name || "").toLowerCase();
      const cat = (f.category || "").toLowerCase();

      if (cat.includes("junk") || name.includes("maggi") || name.includes("chips") || name.includes("soda") || name.includes("samosa")) {
        hasJunk = true;
      }
      if (name.includes("salad") || name.includes("cucumber") || name.includes("mixed veg")) {
        hasFreshSalad = true;
      }
      if (name.includes("dal") || name.includes("curd") || name.includes("dahi")) {
        hasCurdOrDal = true;
      }
    });

    if (hasJunk) {
      score -= 22;
      toImprove.push("Contains ultra-processed foods, high sodium, and refined oils");
    }

    if (hasFreshSalad) {
      score += 6;
      doingWell.push("Includes fresh raw salad or vegetables");
    }

    if (hasCurdOrDal) {
      score += 4;
      doingWell.push("Good natural digestive and micronutrient source");
    }

    // 4. Excessive Saturated Fat / Sugar Check
    const fatCalories = fat * 9;
    const fatRatio = fatCalories / calories;
    if (fatRatio > 0.40) {
      score -= 8;
      toImprove.push("Slightly high fat-to-calorie ratio — reduce fried items or butter");
    }

    // Clamp score between 10 and 98 (no food is 100% perfect or 0)
    const finalScore = Math.max(15, Math.min(96, Math.round(score)));

    // Categorization
    let category = "Balanced";
    if (finalScore >= 80) category = "Excellent";
    else if (finalScore >= 65) category = "Good";
    else if (finalScore >= 50) category = "Moderate";
    else category = "Needs Improvement";

    // Summary statement
    let summary = `Your plate is categorized as **${category}** (${finalScore}/100). `;
    if (finalScore >= 80) {
      summary += "It offers strong protein, healthy carbs, and valuable student nutrition.";
    } else if (finalScore >= 65) {
      summary += "Good everyday meal balance. A quick vegetable or protein addition will make it top tier.";
    } else {
      summary += "Higher in refined carbohydrates and fats. Consider swapping an item for lentils or curd.";
    }

    return {
      score: finalScore,
      category,
      doingWell: doingWell.length > 0 ? doingWell : ["Provides quick calorie energy for student work"],
      toImprove: toImprove.length > 0 ? toImprove : ["Keep maintaining this healthy balance"],
      summary
    };
  }
}
