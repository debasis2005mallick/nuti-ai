/**
 * NutriScan AI - Central Reactive State Store
 * Manages reactive data, LocalStorage sync, user profile, logged meals, hydration & streaks.
 */

import { APP_CONFIG, DEFAULT_HOSTEL_MENU } from './config.js';

const DEFAULT_STATE = {
  // User Profile
  profile: {
    name: "Alex",
    college: "Engineering Hostel A",
    dailyCaloriesTarget: 2200,
    dailyProteinTarget: 75,
    dailyBudget: 150,
    goal: "high-protein", // 'balanced', 'high-protein', 'budget', 'calorie-cut'
    diet: "veg", // 'veg', 'egg', 'non-veg'
    allergies: "None",
    spicePreference: "medium",
    geminiApiKey: ""
  },

  // Active Screen & View State
  activeTab: "dashboard", // 'dashboard', 'scanner', 'hostel', 'planner', 'streaks', 'insights', 'chat', 'profile'
  
  // Today's Real-Time Tracking
  today: {
    date: new Date().toISOString().split('T')[0],
    waterIntakeMl: 1750,
    waterTargetMl: 2500,
    consumedCalories: 1380,
    consumedProteinG: 52,
    consumedCarbsG: 185,
    consumedFatG: 48,
    consumedFiberG: 18,
    budgetSpent: 85,
    mealsLogged: [
      {
        id: "meal_init_1",
        mealType: "Breakfast",
        time: "08:30 AM",
        name: "Poha & Milk",
        healthScore: 82,
        calories: 340,
        protein: 11,
        carbs: 55,
        fat: 8,
        fiber: 5,
        cost: 30,
        foods: [
          { name: "Kanda Poha", portion: "150g", calories: 240, protein: 5.7, cost: 18 },
          { name: "Hostel Milk", portion: "1 Glass", calories: 100, protein: 5.3, cost: 12 }
        ]
      },
      {
        id: "meal_init_2",
        mealType: "Lunch",
        time: "01:15 PM",
        name: "Hostel Dal, 2 Roti & Salad",
        healthScore: 78,
        calories: 510,
        protein: 21,
        carbs: 78,
        fat: 13,
        fiber: 9,
        cost: 40,
        foods: [
          { name: "Yellow Dal Tadka", portion: "150g", calories: 165, protein: 10.2, cost: 20 },
          { name: "Roti / Chapati (2 pcs)", portion: "2 pcs", calories: 208, protein: 7.0, cost: 10 },
          { name: "Fresh Green Salad", portion: "80g", calories: 20, protein: 0.9, cost: 10 }
        ]
      }
    ]
  },

  // Streaks & Habit State
  streaks: {
    nutritionStreakDays: 7,
    hydrationStreakDays: 5,
    balancedMealStreakDays: 4,
    mealLoggingStreakDays: 9,
    proteinGoalStreakDays: 6,
    historyDays: [
      { day: "Mon", status: "completed", date: "Aug 19" },
      { day: "Tue", status: "completed", date: "Aug 20" },
      { day: "Wed", status: "completed", date: "Aug 21" },
      { day: "Thu", status: "completed", date: "Aug 22" },
      { day: "Fri", status: "completed", date: "Aug 23" },
      { day: "Sat", status: "completed", date: "Aug 24" },
      { day: "Sun", status: "completed", date: "Aug 25" }
    ],
    unlockedBadges: ["streak_3", "streak_7", "hydration_pro"]
  },

  // Hostel Menu Schedule (Can be edited by OCR or User)
  hostelMenu: DEFAULT_HOSTEL_MENU,
  selectedHostelDay: "Monday",

  // Recent History of Scans (Persisted for judge inspection)
  mealHistory: [
    {
      id: "hist_1",
      date: "2026-08-25",
      time: "01:15 PM",
      mealType: "Lunch",
      title: "Hostel Dal & 2 Roti",
      calories: 510,
      protein: 21,
      cost: 40,
      healthScore: 78,
      category: "Balanced"
    },
    {
      id: "hist_2",
      date: "2026-08-24",
      time: "08:30 PM",
      mealType: "Dinner",
      title: "Rajma, Rice & Curd",
      calories: 620,
      protein: 24,
      cost: 55,
      healthScore: 84,
      category: "High Fiber & Protein"
    },
    {
      id: "hist_3",
      date: "2026-08-24",
      time: "01:30 PM",
      mealType: "Lunch",
      title: "Special Sunday Thali",
      calories: 780,
      protein: 32,
      cost: 75,
      healthScore: 74,
      category: "Balanced"
    }
  ],

  // Chat Messages for NutriBot
  chatMessages: [
    {
      sender: "bot",
      time: "Just now",
      text: "Hey Alex! 👋 I'm **NutriBot**, your AI hostel food and budget companion. Ask me anything about today's mess menu, budget hacks, or what to eat next!"
    }
  ]
};

class StateStore {
  constructor() {
    this.listeners = new Set();
    this.state = this.loadState();
  }

  loadState() {
    try {
      const saved = localStorage.getItem(APP_CONFIG.storageKey);
      if (saved) {
        const parsed = JSON.parse(saved);
        // Merge with default state in case new fields were added
        return {
          ...DEFAULT_STATE,
          ...parsed,
          profile: { ...DEFAULT_STATE.profile, ...(parsed.profile || {}) },
          today: { ...DEFAULT_STATE.today, ...(parsed.today || {}) },
          streaks: { ...DEFAULT_STATE.streaks, ...(parsed.streaks || {}) },
          hostelMenu: { ...DEFAULT_STATE.hostelMenu, ...(parsed.hostelMenu || {}) }
        };
      }
    } catch (e) {
      console.warn("Could not load stored state, using defaults:", e);
    }
    return JSON.parse(JSON.stringify(DEFAULT_STATE));
  }

  saveState() {
    try {
      localStorage.setItem(APP_CONFIG.storageKey, JSON.stringify(this.state));
    } catch (e) {
      console.warn("Could not persist state to localStorage:", e);
    }
  }

  getState() {
    return this.state;
  }

  subscribe(listener) {
    this.listeners.add(listener);
    return () => this.listeners.delete(listener);
  }

  notify(event, payload) {
    this.saveState();
    this.listeners.forEach(fn => {
      try {
        fn(this.state, event, payload);
      } catch (err) {
        console.error("State listener error:", err);
      }
    });
  }

  // Profile Actions
  updateProfile(newProfile) {
    this.state.profile = { ...this.state.profile, ...newProfile };
    this.notify('profile_updated', this.state.profile);
  }

  setTab(tabName) {
    this.state.activeTab = tabName;
    this.notify('tab_changed', tabName);
  }

  // Hydration Actions
  addWater(amountMl) {
    this.state.today.waterIntakeMl = Math.min(
      6000,
      (this.state.today.waterIntakeMl || 0) + amountMl
    );
    // Check if daily water goal reached
    if (this.state.today.waterIntakeMl >= this.state.today.waterTargetMl) {
      if (!this.state.streaks.unlockedBadges.includes("hydration_pro")) {
        this.state.streaks.unlockedBadges.push("hydration_pro");
      }
    }
    this.notify('water_updated', this.state.today.waterIntakeMl);
  }

  resetWater() {
    this.state.today.waterIntakeMl = 0;
    this.notify('water_updated', 0);
  }

  // Meal Logging Actions
  logMeal(mealData) {
    const meal = {
      id: "meal_" + Date.now(),
      date: new Date().toISOString().split('T')[0],
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      ...mealData
    };

    // Update today's consumed macros
    this.state.today.consumedCalories += meal.calories || 0;
    this.state.today.consumedProteinG += meal.protein || 0;
    this.state.today.consumedCarbsG += meal.carbs || 0;
    this.state.today.consumedFatG += meal.fat || 0;
    this.state.today.consumedFiberG += meal.fiber || 0;
    this.state.today.budgetSpent += meal.cost || 0;

    // Add to today's logged meals list
    this.state.today.mealsLogged.unshift(meal);

    // Add to historical scans list
    this.state.mealHistory.unshift({
      id: meal.id,
      date: meal.date,
      time: meal.time,
      mealType: meal.mealType || "Plate Scan",
      title: meal.name || "Logged Meal",
      calories: meal.calories,
      protein: meal.protein,
      cost: meal.cost,
      healthScore: meal.healthScore,
      category: meal.category || "Balanced"
    });

    // Check streak advancement
    this.state.streaks.mealLoggingStreakDays += 1;
    if (this.state.streaks.mealLoggingStreakDays >= 3 && !this.state.streaks.unlockedBadges.includes("streak_3")) {
      this.state.streaks.unlockedBadges.push("streak_3");
    }
    if (this.state.streaks.mealLoggingStreakDays >= 7 && !this.state.streaks.unlockedBadges.includes("streak_7")) {
      this.state.streaks.unlockedBadges.push("streak_7");
    }

    this.notify('meal_logged', meal);
    return meal;
  }

  // Hostel Menu Actions
  updateHostelMenu(day, mealType, items) {
    if (!this.state.hostelMenu[day]) {
      this.state.hostelMenu[day] = {};
    }
    this.state.hostelMenu[day][mealType] = items;
    this.notify('hostel_menu_updated', { day, mealType, items });
  }

  setHostelMenuForDay(day, dayMenu) {
    this.state.hostelMenu[day] = dayMenu;
    this.notify('hostel_menu_updated', { day, dayMenu });
  }

  setSelectedHostelDay(day) {
    this.state.selectedHostelDay = day;
    this.notify('hostel_day_selected', day);
  }

  // Chat Actions
  addChatMessage(sender, text) {
    const msg = {
      sender,
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      text
    };
    this.state.chatMessages.push(msg);
    this.notify('chat_message_added', msg);
    return msg;
  }

  // Reset/Seed Data (Useful for judges)
  resetDemoData() {
    this.state = JSON.parse(JSON.stringify(DEFAULT_STATE));
    this.saveState();
    this.notify('state_reset', this.state);
  }
}

export const store = new StateStore();
