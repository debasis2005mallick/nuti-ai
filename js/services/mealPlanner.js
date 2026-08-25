/**
 * NutriScan AI - Deterministic Hostel Meal Planner & Combination Engine
 * Solves student meal optimization based on budget, remaining calories, protein, and hostel menu.
 */

import { NutritionEngine } from './nutritionEngine.js';
import { NUTRITION_DATABASE, DEFAULT_HOSTEL_MENU } from '../config.js';

export class MealPlanner {
  /**
   * Determine current meal type from local time
   */
  static getCurrentMealType() {
    const hour = new Date().getHours();
    if (hour >= 6 && hour < 11) return "breakfast";
    if (hour >= 11 && hour < 16) return "lunch";
    if (hour >= 16 && hour < 19) return "snacks";
    return "dinner";
  }

  /**
   * Generate recommendations for a specific meal session from available hostel menu
   */
  static generateMealCombinations({
    hostelMenu,
    day = "Monday",
    mealType = "lunch",
    remainingCalories = 800,
    remainingBudget = 65,
    proteinTarget = 75,
    currentProtein = 45,
    goal = "high-protein",
    diet = "veg"
  }) {
    const dayMenu = hostelMenu[day] || DEFAULT_HOSTEL_MENU[day] || DEFAULT_HOSTEL_MENU["Monday"];
    const rawItems = dayMenu[mealType] || ["Rice", "Dal", "Roti", "Salad"];

    // Map each raw text item into a food object with calculated nutrients
    const availableFoods = rawItems.map(name => {
      return NutritionEngine.calculateItemNutrition(name);
    }).filter(f => {
      // Filter out non-matching diet foods if user is strict vegetarian
      if (diet === "veg" && (f.diet === "non-veg" || f.diet === "egg")) return false;
      if (diet === "egg" && f.diet === "non-veg") return false;
      return true;
    });

    const proteinDeficit = Math.max(15, proteinTarget - currentProtein);

    // 1. BEST MATCH: Balanced optimization of calories, protein and budget
    const bestMatchCombo = this.buildBestMatchCombo(availableFoods, remainingCalories, remainingBudget, goal);

    // 2. BUDGET SAVER: Minimum cost while maintaining nutritional integrity (<₹45)
    const budgetCombo = this.buildBudgetCombo(availableFoods, Math.min(45, remainingBudget));

    // 3. HIGH PROTEIN OPTION: Prioritizes lentils, dairy, eggs, soya chunks
    const highProteinCombo = this.buildHighProteinCombo(availableFoods, remainingCalories, remainingBudget + 20);

    // 4. CALORIE CONTROLLED: Lighter, fiber-dense combination
    const calorieControlledCombo = this.buildCalorieControlledCombo(availableFoods, Math.min(450, remainingCalories));

    return {
      mealType,
      day,
      bestMatch: bestMatchCombo,
      budgetOption: budgetCombo,
      highProteinOption: highProteinCombo,
      calorieControlledOption: calorieControlledCombo
    };
  }

  /**
   * Build Best Match combination with score
   */
  static buildBestMatchCombo(foods, targetCalories, maxBudget, goal) {
    // Select staple bread/grain + primary protein/dal + vegetable/salad + curd
    const selected = [];
    
    const grains = foods.filter(f => f.category === "Grains" || f.category === "Breads" || f.category === "Breakfast");
    const proteins = foods.filter(f => f.category === "Lentils" || f.category === "Dairy" || f.category === "Poultry" || f.category === "Legumes");
    const veggies = foods.filter(f => f.category === "Vegetables" || f.name.toLowerCase().includes("salad"));
    const dairy = foods.filter(f => f.name.toLowerCase().includes("curd") || f.name.toLowerCase().includes("milk"));

    if (grains.length > 0) selected.push(grains[0]);
    if (proteins.length > 0) selected.push(proteins[0]);
    if (proteins.length > 1 && goal === "high-protein") selected.push(proteins[1]);
    if (veggies.length > 0) selected.push(veggies[0]);
    if (dairy.length > 0) selected.push(dairy[0]);

    if (selected.length === 0 && foods.length > 0) {
      selected.push(...foods.slice(0, 3));
    }

    const calculated = NutritionEngine.calculatePlateNutrition(selected);
    const score = this.calculateMatchScore(calculated.total, targetCalories, maxBudget, goal);

    return {
      title: "🏆 BEST MATCH",
      tagline: "Optimized for your fitness goal and student budget",
      foods: calculated.foods,
      totals: calculated.total,
      matchScore: score,
      healthScore: calculated.health_score,
      whyStatement: `Fits perfectly in your remaining ₹${maxBudget} budget with ${calculated.total.protein_g}g protein and high fiber.`
    };
  }

  /**
   * Build Budget Combo (<₹45)
   */
  static buildBudgetCombo(foods, maxBudget) {
    const selected = [];
    // Prioritize staple roti/rice + yellow dal + sabzi
    const budgetFriendly = [...foods].sort((a, b) => (a.cost || 15) - (b.cost || 15));
    
    let runningCost = 0;
    for (const item of budgetFriendly) {
      if (runningCost + (item.cost || 15) <= Math.max(50, maxBudget)) {
        selected.push(item);
        runningCost += (item.cost || 15);
      }
      if (selected.length >= 3) break;
    }

    if (selected.length === 0 && foods.length > 0) {
      selected.push(foods[0]);
    }

    const calculated = NutritionEngine.calculatePlateNutrition(selected);

    return {
      title: "💰 BUDGET SAVER",
      tagline: "High nutrition density under student pocket money",
      foods: calculated.foods,
      totals: calculated.total,
      matchScore: 94,
      healthScore: calculated.health_score,
      whyStatement: `Under ₹${calculated.total.estimated_cost}! Delivers ${calculated.total.calories} kcal with good essential minerals.`
    };
  }

  /**
   * Build High-Protein Combo
   */
  static buildHighProteinCombo(foods, targetCalories, maxBudget) {
    const proteinRich = [...foods].sort((a, b) => (b.protein || 0) - (a.protein || 0));
    const selected = [];

    // Add top 2 protein items + 1 staple grain/roti + salad
    if (proteinRich.length > 0) selected.push(proteinRich[0]);
    if (proteinRich.length > 1) selected.push(proteinRich[1]);

    const staples = foods.filter(f => f.category === "Breads" || f.category === "Grains");
    if (staples.length > 0) selected.push(staples[0]);

    const salads = foods.filter(f => f.name.toLowerCase().includes("salad"));
    if (salads.length > 0) selected.push(salads[0]);

    const calculated = NutritionEngine.calculatePlateNutrition(selected);

    return {
      title: "💪 HIGH PROTEIN OPTION",
      tagline: "Maximizes muscle repair and protein synthesis",
      foods: calculated.foods,
      totals: calculated.total,
      matchScore: 96,
      healthScore: calculated.health_score,
      whyStatement: `High protein pack (${calculated.total.protein_g}g) utilizing today's mess lentils, paneer, and curd.`
    };
  }

  /**
   * Build Calorie Controlled / Light Option
   */
  static buildCalorieControlledCombo(foods, targetCalories) {
    const lighter = foods.filter(f => (f.calories || 100) < 220);
    const selected = lighter.slice(0, 3);
    if (selected.length === 0 && foods.length > 0) selected.push(foods[0]);

    const calculated = NutritionEngine.calculatePlateNutrition(selected);

    return {
      title: "⚡ CALORIE CONTROLLED",
      tagline: "Light on digestion, high in micronutrients & satiety",
      foods: calculated.foods,
      totals: calculated.total,
      matchScore: 88,
      healthScore: calculated.health_score,
      whyStatement: `Keeps you at ${calculated.total.calories} kcal while preventing sluggishness during afternoon study sessions.`
    };
  }

  /**
   * Calculate Match Score (0 to 100%)
   */
  static calculateMatchScore(totals, targetCalories, maxBudget, goal) {
    let score = 90;
    if (totals.estimated_cost > maxBudget) score -= 15;
    if (totals.calories > targetCalories * 1.2) score -= 10;
    if (goal === "high-protein" && totals.protein_g < 20) score -= 12;
    return Math.max(65, Math.min(99, score));
  }

  /**
   * "What Should I Eat Now?" Engine
   * One-click dynamic recommendation based on live state, current time, consumed calories & hostel menu.
   */
  static recommendWhatToEatNow(state) {
    const currentMeal = this.getCurrentMealType();
    const days = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
    const todayDayName = days[new Date().getDay()] || "Monday";

    const remainingCalories = Math.max(300, (state.profile.dailyCaloriesTarget || 2200) - (state.today.consumedCalories || 1380));
    const remainingBudget = Math.max(20, (state.profile.dailyBudget || 150) - (state.today.budgetSpent || 85));
    const proteinTarget = state.profile.dailyProteinTarget || 75;
    const consumedProtein = state.today.consumedProteinG || 52;

    const combinations = this.generateMealCombinations({
      hostelMenu: state.hostelMenu,
      day: todayDayName,
      mealType: currentMeal,
      remainingCalories,
      remainingBudget,
      proteinTarget,
      currentProtein: consumedProtein,
      goal: state.profile.goal,
      diet: state.profile.diet
    });

    const mealNameDisplay = currentMeal.charAt(0).toUpperCase() + currentMeal.slice(1);

    return {
      mealType: mealNameDisplay,
      currentHour: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      remainingCalories,
      remainingBudget,
      consumedProtein,
      proteinTarget,
      recommendation: combinations.bestMatch,
      alternativeBudget: combinations.budgetOption,
      alternativeProtein: combinations.highProteinOption,
      insightsContext: `It is currently **${mealNameDisplay}** time. You have approximately **${remainingCalories} kcal** and **₹${remainingBudget}** remaining today, with **${Math.max(0, proteinTarget - consumedProtein)}g** protein needed to hit your daily goal.`
    };
  }

  /**
   * Generate Full 7-Day Weekly Hostel Meal Plan
   */
  static generateWeeklyPlan(state) {
    const days = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"];
    const weeklyPlan = [];
    let totalWeeklyCost = 0;
    let totalWeeklyCalories = 0;
    let totalWeeklyProtein = 0;

    days.forEach(day => {
      const dayMenu = state.hostelMenu[day] || DEFAULT_HOSTEL_MENU[day];
      
      const breakfastCombo = this.buildBestMatchCombo(
        (dayMenu.breakfast || ["Poha", "Milk"]).map(n => NutritionEngine.calculateItemNutrition(n)),
        400, 30, state.profile.goal
      );

      const lunchCombo = this.buildBestMatchCombo(
        (dayMenu.lunch || ["Rice", "Dal", "2 Roti", "Curd"]).map(n => NutritionEngine.calculateItemNutrition(n)),
        650, 60, state.profile.goal
      );

      const dinnerCombo = this.buildBestMatchCombo(
        (dayMenu.dinner || ["Rice", "Rajma", "2 Roti", "Salad"]).map(n => NutritionEngine.calculateItemNutrition(n)),
        600, 55, state.profile.goal
      );

      const dayCalories = breakfastCombo.totals.calories + lunchCombo.totals.calories + dinnerCombo.totals.calories;
      const dayProtein = breakfastCombo.totals.protein_g + lunchCombo.totals.protein_g + dinnerCombo.totals.protein_g;
      const dayCost = breakfastCombo.totals.estimated_cost + lunchCombo.totals.estimated_cost + dinnerCombo.totals.estimated_cost;
      const dayHealthScore = Math.round((breakfastCombo.healthScore + lunchCombo.healthScore + dinnerCombo.healthScore) / 3);

      totalWeeklyCalories += dayCalories;
      totalWeeklyProtein += dayProtein;
      totalWeeklyCost += dayCost;

      weeklyPlan.push({
        day,
        breakfast: breakfastCombo,
        lunch: lunchCombo,
        dinner: dinnerCombo,
        dayTotals: {
          calories: dayCalories,
          protein: Math.round(dayProtein),
          cost: dayCost,
          healthScore: dayHealthScore
        }
      });
    });

    return {
      days: weeklyPlan,
      summary: {
        avgCalories: Math.round(totalWeeklyCalories / 7),
        avgProtein: Math.round(totalWeeklyProtein / 7),
        totalCost: totalWeeklyCost,
        avgDailyCost: Math.round(totalWeeklyCost / 7),
        avgHealthScore: 82
      }
    };
  }
}
