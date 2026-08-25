/**
 * NutriScan AI - Gamification & Streak Service
 * Tracks Nutrition Streak, Hydration Streak, Protein Goal Streak, and Badges.
 */

import { BADGE_DEFINITIONS } from '../config.js';

export class StreakService {
  /**
   * Evaluate all streak statuses and badge achievements from current state
   */
  static getStreakOverview(state) {
    const streaks = state.streaks || {};
    const today = state.today || {};
    const profile = state.profile || {};

    const waterTarget = today.waterTargetMl || 2500;
    const waterCurrent = today.waterIntakeMl || 0;
    const hydrationPct = Math.min(100, Math.round((waterCurrent / waterTarget) * 100));

    const calorieTarget = profile.dailyCaloriesTarget || 2200;
    const calorieCurrent = today.consumedCalories || 0;
    const caloriePct = Math.min(100, Math.round((calorieCurrent / calorieTarget) * 100));

    const proteinTarget = profile.dailyProteinTarget || 75;
    const proteinCurrent = today.consumedProteinG || 0;
    const proteinPct = Math.min(100, Math.round((proteinCurrent / proteinTarget) * 100));

    // Daily Habit Checklist items
    const checklist = [
      {
        id: "log_meal",
        title: "Log at least 2 meals today",
        completed: (today.mealsLogged || []).length >= 2,
        progressText: `${(today.mealsLogged || []).length} / 2 logged`
      },
      {
        id: "hydration_target",
        title: "Hit daily water target (2.5L)",
        completed: waterCurrent >= waterTarget,
        progressText: `${(waterCurrent / 1000).toFixed(1)} / ${(waterTarget / 1000).toFixed(1)} L`
      },
      {
        id: "protein_check",
        title: "Reach 70% of daily protein target",
        completed: proteinCurrent >= (proteinTarget * 0.7),
        progressText: `${proteinCurrent}g / ${proteinTarget}g`
      },
      {
        id: "budget_check",
        title: "Stay within daily food budget",
        completed: today.budgetSpent <= profile.dailyBudget,
        progressText: `₹${today.budgetSpent} spent of ₹${profile.dailyBudget}`
      }
    ];

    // Compute badges with locked/unlocked state
    const badges = BADGE_DEFINITIONS.map(badge => {
      const isUnlocked = (streaks.unlockedBadges || []).includes(badge.id);
      return {
        ...badge,
        isUnlocked
      };
    });

    return {
      nutritionStreak: streaks.nutritionStreakDays || 7,
      hydrationStreak: streaks.hydrationStreakDays || 5,
      proteinStreak: streaks.proteinGoalStreakDays || 6,
      mealLoggingStreak: streaks.mealLoggingStreakDays || 9,
      historyDays: streaks.historyDays || [],
      waterCurrent,
      waterTarget,
      hydrationPct,
      caloriePct,
      proteinPct,
      checklist,
      badges,
      activeStreakCount: 4
    };
  }
}
