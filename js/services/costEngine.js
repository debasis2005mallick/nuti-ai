/**
 * NutriScan AI - Cost Estimation & Value-For-Money Engine
 * Computes transparent estimated food costs and student budget ROI (Protein per ₹, Fiber per ₹).
 */

import { NUTRITION_DATABASE, APP_CONFIG } from '../config.js';

export class CostEngine {
  /**
   * Estimate total cost for an array of foods
   */
  static estimateMealCost(foods = []) {
    let totalCost = 0;
    foods.forEach(f => {
      totalCost += (f.cost || 0);
    });
    return Math.round(totalCost);
  }

  /**
   * Project daily, weekly, and monthly food expenditure based on recent history
   */
  static calculateProjections(todaySpent = 85, dailyBudget = 150, pastMeals = []) {
    // If we have history, calculate average daily spend
    let avgDaily = dailyBudget;
    if (pastMeals && pastMeals.length > 0) {
      const sum = pastMeals.reduce((acc, m) => acc + (m.cost || 40), 0);
      avgDaily = Math.round(sum / Math.max(1, Math.min(7, pastMeals.length)));
    } else {
      avgDaily = Math.round(todaySpent * 1.5) || dailyBudget;
    }

    const weeklyEstimate = avgDaily * 7;
    const monthlyEstimate = avgDaily * 30;

    return {
      dailyBudget,
      todaySpent,
      remainingToday: Math.max(0, dailyBudget - todaySpent),
      spentPercentage: Math.min(100, Math.round((todaySpent / dailyBudget) * 100)),
      weeklyEstimated: weeklyEstimate,
      monthlyEstimated: monthlyEstimate,
      savingsPotentialMonth: Math.max(0, (dailyBudget * 30) - monthlyEstimate)
    };
  }

  /**
   * Nutrition Value For Money Analyzer
   * Ranks Indian foods by Protein per Rupee (g/₹) and Fiber per Rupee (g/₹).
   */
  static getNutritionValueRanking() {
    const list = [];

    for (const [key, item] of Object.entries(NUTRITION_DATABASE)) {
      // Calculate single serving specs
      const serving = item.defaultServing || 100;
      let cost = item.costPerServing || 20;
      let protein = (item.proteinPer100g * serving) / 100;
      let fiber = (item.fiberPer100g * serving) / 100;
      let calories = (item.caloriesPer100g * serving) / 100;

      if (item.servingUnit === 'piece' || item.servingUnit === 'pack') {
        cost = (item.costPerPiece || item.costPerServing || 15) * serving;
        protein = (item.proteinPerPiece || 3.5) * serving;
        fiber = (item.fiberPerPiece || 1.0) * serving;
        calories = (item.caloriesPerPiece || 100) * serving;
      }

      if (cost > 0) {
        const proteinPerRupee = Math.round((protein / cost) * 100) / 100;
        const fiberPerRupee = Math.round((fiber / cost) * 100) / 100;
        const caloriesPerRupee = Math.round((calories / cost) * 10) / 10;

        list.push({
          key,
          name: item.name,
          category: item.category,
          diet: item.diet,
          servingDisplay: `${serving} ${item.servingUnit || 'g'}`,
          cost,
          protein: Math.round(protein * 10) / 10,
          fiber: Math.round(fiber * 10) / 10,
          calories: Math.round(calories),
          proteinPerRupee,
          fiberPerRupee,
          caloriesPerRupee
        });
      }
    }

    // Sort by Best Protein Value (g protein per ₹)
    const sortedByProteinValue = [...list].sort((a, b) => b.proteinPerRupee - a.proteinPerRupee);
    const sortedByFiberValue = [...list].sort((a, b) => b.fiberPerRupee - a.fiberPerRupee);

    return {
      bestProteinFoods: sortedByProteinValue.slice(0, 6),
      bestFiberFoods: sortedByFiberValue.slice(0, 6),
      allRankings: sortedByProteinValue
    };
  }
}
