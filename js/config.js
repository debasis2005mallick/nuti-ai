/**
 * NutriScan AI - Central Configuration & Knowledge Database
 * Comprehensive Indian & Hostel food database with deterministic nutrition and prices.
 */

export const APP_CONFIG = {
  appName: "NutriScan AI",
  tagline: "Scan your food. Understand your nutrition. Eat smarter.",
  version: "1.0.0",
  storageKey: "nutriscan_ai_state_v1",
  currency: "₹",
  disclaimer: "Nutrition values and costs are AI-assisted estimates for general student awareness and habit building. Not medical advice."
};

// Comprehensive Indian & Student/Hostel Nutrition Database (per 100g or standard unit)
export const NUTRITION_DATABASE = {
  "rice": {
    name: "Steamed Rice",
    category: "Grains",
    servingUnit: "g",
    defaultServing: 150,
    caloriesPer100g: 130,
    proteinPer100g: 2.7,
    carbsPer100g: 28.2,
    fatPer100g: 0.3,
    fiberPer100g: 0.4,
    costPerServing: 15,
    diet: "veg",
    glycemicIndex: "high"
  },
  "roti": {
    name: "Roti / Chapati",
    category: "Breads",
    servingUnit: "piece",
    defaultServing: 2, // 2 pieces (~70g)
    caloriesPerPiece: 104,
    proteinPerPiece: 3.5,
    carbsPerPiece: 18.0,
    fatPerPiece: 2.0,
    fiberPerPiece: 2.8,
    caloriesPer100g: 297,
    proteinPer100g: 10.0,
    carbsPer100g: 51.4,
    fatPer100g: 5.7,
    fiberPer100g: 8.0,
    costPerPiece: 5,
    diet: "veg",
    glycemicIndex: "medium"
  },
  "dal": {
    name: "Yellow Dal Tadka",
    category: "Lentils",
    servingUnit: "g",
    defaultServing: 150,
    caloriesPer100g: 110,
    proteinPer100g: 6.8,
    carbsPer100g: 15.2,
    fatPer100g: 3.1,
    fiberPer100g: 4.5,
    costPerServing: 20,
    diet: "veg",
    glycemicIndex: "low"
  },
  "paneer": {
    name: "Paneer Sabzi / Curry",
    category: "Dairy",
    servingUnit: "g",
    defaultServing: 120,
    caloriesPer100g: 220,
    proteinPer100g: 14.5,
    carbsPer100g: 6.0,
    fatPer100g: 16.0,
    fiberPer100g: 1.2,
    costPerServing: 40,
    diet: "veg",
    glycemicIndex: "low"
  },
  "rajma": {
    name: "Rajma Masala (Kidney Beans)",
    category: "Lentils",
    servingUnit: "g",
    defaultServing: 150,
    caloriesPer100g: 128,
    proteinPer100g: 7.8,
    carbsPer100g: 19.5,
    fatPer100g: 2.6,
    fiberPer100g: 5.8,
    costPerServing: 25,
    diet: "veg",
    glycemicIndex: "low"
  },
  "chole": {
    name: "Chole Masala (Chickpeas)",
    category: "Lentils",
    servingUnit: "g",
    defaultServing: 150,
    caloriesPer100g: 142,
    proteinPer100g: 7.2,
    carbsPer100g: 21.0,
    fatPer100g: 3.8,
    fiberPer100g: 5.2,
    costPerServing: 25,
    diet: "veg",
    glycemicIndex: "low"
  },
  "curd": {
    name: "Plain Curd / Dahi",
    category: "Dairy",
    servingUnit: "g",
    defaultServing: 100,
    caloriesPer100g: 98,
    proteinPer100g: 4.2,
    carbsPer100g: 4.5,
    fatPer100g: 4.0,
    fiberPer100g: 0.0,
    costPerServing: 15,
    diet: "veg",
    glycemicIndex: "low"
  },
  "salad": {
    name: "Fresh Green Salad (Cucumber, Tomato, Onion)",
    category: "Vegetables",
    servingUnit: "g",
    defaultServing: 80,
    caloriesPer100g: 25,
    proteinPer100g: 1.1,
    carbsPer100g: 4.8,
    fatPer100g: 0.2,
    fiberPer100g: 2.1,
    costPerServing: 10,
    diet: "veg",
    glycemicIndex: "low"
  },
  "aloo_sabzi": {
    name: "Aloo Sabzi / Potato Curry",
    category: "Vegetables",
    servingUnit: "g",
    defaultServing: 120,
    caloriesPer100g: 135,
    proteinPer100g: 2.2,
    carbsPer100g: 20.4,
    fatPer100g: 5.5,
    fiberPer100g: 2.0,
    costPerServing: 15,
    diet: "veg",
    glycemicIndex: "high"
  },
  "mixed_veg": {
    name: "Mixed Vegetable Sabzi",
    category: "Vegetables",
    servingUnit: "g",
    defaultServing: 120,
    caloriesPer100g: 95,
    proteinPer100g: 3.1,
    carbsPer100g: 11.2,
    fatPer100g: 4.5,
    fiberPer100g: 3.8,
    costPerServing: 20,
    diet: "veg",
    glycemicIndex: "low"
  },
  "palak_paneer": {
    name: "Palak Paneer",
    category: "Dairy/Vegetables",
    servingUnit: "g",
    defaultServing: 140,
    caloriesPer100g: 185,
    proteinPer100g: 11.5,
    carbsPer100g: 5.8,
    fatPer100g: 13.5,
    fiberPer100g: 3.2,
    costPerServing: 40,
    diet: "veg",
    glycemicIndex: "low"
  },
  "eggs_boiled": {
    name: "Boiled Eggs (2 pcs)",
    category: "Poultry",
    servingUnit: "piece",
    defaultServing: 2,
    caloriesPerPiece: 78,
    proteinPerPiece: 6.3,
    carbsPerPiece: 0.6,
    fatPerPiece: 5.3,
    fiberPerPiece: 0.0,
    caloriesPer100g: 155,
    proteinPer100g: 12.6,
    carbsPer100g: 1.1,
    fatPer100g: 10.6,
    fiberPer100g: 0.0,
    costPerPiece: 8,
    diet: "egg",
    glycemicIndex: "low"
  },
  "egg_bhurji": {
    name: "Egg Bhurji (2 Eggs)",
    category: "Poultry",
    servingUnit: "g",
    defaultServing: 120,
    caloriesPer100g: 190,
    proteinPer100g: 12.0,
    carbsPer100g: 3.5,
    fatPer100g: 14.5,
    fiberPer100g: 0.8,
    costPerServing: 25,
    diet: "egg",
    glycemicIndex: "low"
  },
  "chicken_curry": {
    name: "Hostel Chicken Curry",
    category: "Poultry",
    servingUnit: "g",
    defaultServing: 160,
    caloriesPer100g: 175,
    proteinPer100g: 16.5,
    carbsPer100g: 4.2,
    fatPer100g: 10.5,
    fiberPer100g: 1.0,
    costPerServing: 60,
    diet: "non-veg",
    glycemicIndex: "low"
  },
  "poha": {
    name: "Kanda Poha with Peanuts",
    category: "Breakfast",
    servingUnit: "g",
    defaultServing: 150,
    caloriesPer100g: 160,
    proteinPer100g: 3.8,
    carbsPer100g: 27.5,
    fatPer100g: 4.2,
    fiberPer100g: 2.4,
    costPerServing: 18,
    diet: "veg",
    glycemicIndex: "medium"
  },
  "upma": {
    name: "Rava Upma with Veggies",
    category: "Breakfast",
    servingUnit: "g",
    defaultServing: 150,
    caloriesPer100g: 140,
    proteinPer100g: 3.5,
    carbsPer100g: 22.0,
    fatPer100g: 4.5,
    fiberPer100g: 2.1,
    costPerServing: 18,
    diet: "veg",
    glycemicIndex: "medium"
  },
  "idli_sambar": {
    name: "Idli (2 pcs) with Sambar",
    category: "Breakfast",
    servingUnit: "portion",
    defaultServing: 1,
    caloriesPer100g: 115,
    proteinPer100g: 4.5,
    carbsPer100g: 21.0,
    fatPer100g: 1.5,
    fiberPer100g: 2.8,
    costPerServing: 25,
    diet: "veg",
    glycemicIndex: "low"
  },
  "dosa": {
    name: "Plain / Masala Dosa",
    category: "Breakfast",
    servingUnit: "piece",
    defaultServing: 1,
    caloriesPerPiece: 240,
    proteinPerPiece: 5.5,
    carbsPerPiece: 38.0,
    fatPerPiece: 7.5,
    fiberPerPiece: 2.2,
    caloriesPer100g: 195,
    proteinPer100g: 4.5,
    carbsPer100g: 30.0,
    fatPer100g: 6.5,
    fiberPer100g: 1.8,
    costPerPiece: 30,
    diet: "veg",
    glycemicIndex: "medium"
  },
  "milk": {
    name: "Hostel Milk (1 Glass)",
    category: "Beverages",
    servingUnit: "ml",
    defaultServing: 200,
    caloriesPer100g: 65,
    proteinPer100g: 3.4,
    carbsPer100g: 4.8,
    fatPer100g: 3.6,
    fiberPer100g: 0.0,
    costPerServing: 12,
    diet: "veg",
    glycemicIndex: "low"
  },
  "tea": {
    name: "Chai / Masala Tea",
    category: "Beverages",
    servingUnit: "cup",
    defaultServing: 1,
    caloriesPerPiece: 75,
    proteinPerPiece: 2.0,
    carbsPerPiece: 10.5,
    fatPerPiece: 2.8,
    fiberPerPiece: 0.0,
    costPerServing: 8,
    diet: "veg",
    glycemicIndex: "medium"
  },
  "banana": {
    name: "Banana (1 medium)",
    category: "Fruits",
    servingUnit: "piece",
    defaultServing: 1,
    caloriesPerPiece: 89,
    proteinPerPiece: 1.1,
    carbsPerPiece: 22.8,
    fatPerPiece: 0.3,
    fiberPerPiece: 2.6,
    costPerPiece: 6,
    diet: "veg",
    glycemicIndex: "medium"
  },
  "maggi": {
    name: "Instant Maggi Noodles",
    category: "Junk / Canteen",
    servingUnit: "pack",
    defaultServing: 1,
    caloriesPerPiece: 310,
    proteinPerPiece: 6.0,
    carbsPerPiece: 45.0,
    fatPerPiece: 12.0,
    fiberPerPiece: 1.5,
    costPerServing: 25,
    diet: "veg",
    glycemicIndex: "high"
  },
  "chips": {
    name: "Potato Chips Pack",
    category: "Junk / Canteen",
    servingUnit: "pack",
    defaultServing: 1,
    caloriesPerPiece: 160,
    proteinPerPiece: 1.5,
    carbsPerPiece: 15.0,
    fatPerPiece: 10.5,
    fiberPerPiece: 0.8,
    costPerServing: 20,
    diet: "veg",
    glycemicIndex: "high"
  },
  "soda": {
    name: "Carbonated Soft Drink (250ml)",
    category: "Junk / Canteen",
    servingUnit: "can",
    defaultServing: 1,
    caloriesPerPiece: 110,
    proteinPerPiece: 0.0,
    carbsPerPiece: 28.0,
    fatPerPiece: 0.0,
    fiberPerPiece: 0.0,
    costPerServing: 20,
    diet: "veg",
    glycemicIndex: "high"
  },
  "samosa": {
    name: "Samosa (1 piece)",
    category: "Junk / Canteen",
    servingUnit: "piece",
    defaultServing: 1,
    caloriesPerPiece: 220,
    proteinPerPiece: 3.5,
    carbsPerPiece: 24.0,
    fatPerPiece: 12.5,
    fiberPerPiece: 1.8,
    costPerPiece: 15,
    diet: "veg",
    glycemicIndex: "high"
  },
  "bread_butter": {
    name: "Bread with Butter/Jam (2 slices)",
    category: "Breakfast",
    servingUnit: "portion",
    defaultServing: 1,
    caloriesPerPiece: 190,
    proteinPerPiece: 4.2,
    carbsPerPiece: 26.0,
    fatPerPiece: 8.0,
    fiberPerPiece: 1.2,
    costPerServing: 15,
    diet: "veg",
    glycemicIndex: "high"
  },
  "soya_chunks": {
    name: "Soya Chunks Curry",
    category: "Legumes",
    servingUnit: "g",
    defaultServing: 120,
    caloriesPer100g: 175,
    proteinPer100g: 18.0,
    carbsPer100g: 12.0,
    fatPer100g: 4.5,
    fiberPer100g: 6.5,
    costPerServing: 20,
    diet: "veg",
    glycemicIndex: "low"
  },
  "khichdi": {
    name: "Moong Dal Khichdi",
    category: "Grains/Lentils",
    servingUnit: "g",
    defaultServing: 200,
    caloriesPer100g: 120,
    proteinPer100g: 4.8,
    carbsPer100g: 20.5,
    fatPer100g: 2.2,
    fiberPer100g: 2.8,
    costPerServing: 20,
    diet: "veg",
    glycemicIndex: "low"
  }
};

// Default Weekly Hostel Mess Menu (Comprehensive Mon-Sun Indian hostel schedule)
export const DEFAULT_HOSTEL_MENU = {
  "Monday": {
    breakfast: ["Poha", "Bread Butter", "Milk", "Tea", "Banana"],
    lunch: ["Rice", "Yellow Dal", "Aloo Gobhi Sabzi", "2 Roti", "Curd", "Salad"],
    snacks: ["Chai", "Biscuits", "Samosa"],
    dinner: ["Rice", "Rajma Masala", "Mixed Veg Sabzi", "2 Roti", "Salad"]
  },
  "Tuesday": {
    breakfast: ["Rava Upma", "Boiled Eggs (2 pcs)", "Milk", "Tea"],
    lunch: ["Rice", "Dal Makhani", "Bhindi Masala", "2 Roti", "Curd", "Salad"],
    snacks: ["Chai", "Puffed Rice (Bhel)"],
    dinner: ["Rice", "Chole Masala", "Aloo Palak", "2 Roti", "Kheer"]
  },
  "Wednesday": {
    breakfast: ["Idli Sambar", "Coconut Chutney", "Milk", "Tea"],
    lunch: ["Rice", "Moong Dal Tadka", "Paneer Butter Masala", "2 Roti", "Curd", "Salad"],
    snacks: ["Tea", "Veg Cutlet"],
    dinner: ["Rice", "Egg Curry", "Dal Fry", "2 Roti", "Salad"]
  },
  "Thursday": {
    breakfast: ["Aloo Paratha", "Curd", "Tea", "Banana"],
    lunch: ["Rice", "Kadhi Pakora", "Aloo Baingan Sabzi", "2 Roti", "Papad", "Salad"],
    snacks: ["Chai", "Mathri"],
    dinner: ["Rice", "Soya Chunks Curry", "Dal Tadka", "2 Roti", "Salad"]
  },
  "Friday": {
    breakfast: ["Kanda Poha", "Boiled Eggs", "Milk", "Tea"],
    lunch: ["Rice", "Rajma Masala", "Jeera Aloo", "2 Roti", "Curd", "Salad"],
    snacks: ["Chai", "Pakora"],
    dinner: ["Veg Biryani", "Raita", "Yellow Dal", "Salad", "Gulab Jamun"]
  },
  "Saturday": {
    breakfast: ["Masala Dosa", "Sambar", "Milk", "Tea"],
    lunch: ["Rice", "Chana Dal", "Aloo Capsicum", "2 Roti", "Curd", "Salad"],
    snacks: ["Chai", "Bun Maska"],
    dinner: ["Rice", "Paneer Sabzi", "Dal Makhani", "2 Roti", "Salad"]
  },
  "Sunday": {
    breakfast: ["Chole Bhature", "Sweet Lassi", "Tea"],
    lunch: ["Special Thali (Rice, Dal, Paneer/Chicken Curry, 2 Roti, Curd, Ice Cream)"],
    snacks: ["Cold Coffee", "Sandwich"],
    dinner: ["Moong Dal Khichdi", "Papad", "Curd", "Mixed Pickle", "Salad"]
  }
};

// Demo Plates for 1-Click Judge & User Walkthroughs
export const DEMO_MEAL_PLATES = {
  "thali": {
    id: "demo-thali",
    title: "Classic Indian Hostel Thali",
    subtitle: "Rice + Yellow Dal + 2 Roti + Paneer Curry + Curd + Fresh Salad",
    image: "https://images.unsplash.com/photo-1546833998-877b37c2e5c6?w=600&q=80",
    category: "Balanced Plate",
    foods: [
      { id: "rice", name: "Steamed Rice", portion: 150, unit: "g", confidence: 0.94 },
      { id: "dal", name: "Yellow Dal Tadka", portion: 150, unit: "g", confidence: 0.92 },
      { id: "roti", name: "Roti / Chapati", portion: 2, unit: "piece", confidence: 0.96 },
      { id: "paneer", name: "Paneer Sabzi / Curry", portion: 120, unit: "g", confidence: 0.89 },
      { id: "curd", name: "Plain Curd / Dahi", portion: 100, unit: "g", confidence: 0.91 },
      { id: "salad", name: "Fresh Green Salad", portion: 80, unit: "g", confidence: 0.88 }
    ]
  },
  "junk": {
    id: "demo-junk",
    title: "Hostel Night Canteen Combo",
    subtitle: "Instant Maggi + Potato Chips + Cold Soft Drink",
    image: "https://images.unsplash.com/photo-1569718212165-3a8278d5f624?w=600&q=80",
    category: "High Calorie / Low Protein",
    foods: [
      { id: "maggi", name: "Instant Maggi Noodles", portion: 1, unit: "pack", confidence: 0.96 },
      { id: "chips", name: "Potato Chips Pack", portion: 1, unit: "pack", confidence: 0.92 },
      { id: "soda", name: "Carbonated Soft Drink", portion: 1, unit: "can", confidence: 0.95 }
    ]
  },
  "gym": {
    id: "demo-gym",
    title: "High Protein Mess Plate",
    subtitle: "2 Boiled Eggs + Soya Curry + 2 Roti + Curd + Salad",
    image: "https://images.unsplash.com/photo-1490645935967-10de6ba17061?w=600&q=80",
    category: "High Protein",
    foods: [
      { id: "eggs_boiled", name: "Boiled Eggs (2 pcs)", portion: 2, unit: "piece", confidence: 0.95 },
      { id: "soya_chunks", name: "Soya Chunks Curry", portion: 150, unit: "g", confidence: 0.91 },
      { id: "roti", name: "Roti / Chapati", portion: 2, unit: "piece", confidence: 0.94 },
      { id: "curd", name: "Plain Curd / Dahi", portion: 100, unit: "g", confidence: 0.89 },
      { id: "salad", name: "Fresh Green Salad", portion: 100, unit: "g", confidence: 0.92 }
    ]
  }
};

// Gamification Badges Milestone Definitions
export const BADGE_DEFINITIONS = [
  {
    id: "streak_3",
    title: "Getting Started",
    description: "Maintained a 3-day nutrition streak",
    daysRequired: 3,
    type: "streak",
    icon: "🌱",
    unlockedText: "Unlocked! Great start on mindful eating."
  },
  {
    id: "streak_7",
    title: "Healthy Week",
    description: "Maintained a 7-day nutrition streak",
    daysRequired: 7,
    type: "streak",
    icon: "🔥",
    unlockedText: "Unlocked! One full week of healthy consistency."
  },
  {
    id: "streak_14",
    title: "Consistency Champion",
    description: "Maintained a 14-day nutrition streak",
    daysRequired: 14,
    type: "streak",
    icon: "🏆",
    unlockedText: "Unlocked! You're in the top 5% of disciplined hostel eaters."
  },
  {
    id: "streak_30",
    title: "Nutrition Master",
    description: "Maintained a 30-day nutrition streak",
    daysRequired: 30,
    type: "streak",
    icon: "👑",
    unlockedText: "Unlocked! Mastered student budget & nutrition balance."
  },
  {
    id: "hydration_pro",
    title: "Hydration Hero",
    description: "Hit 2.5L daily water goal for 5 days",
    daysRequired: 5,
    type: "hydration",
    icon: "💧",
    unlockedText: "Unlocked! Peak hydration achieved."
  },
  {
    id: "protein_hacker",
    title: "Mess Protein Hacker",
    description: "Hit >70g protein within ₹100 budget 3 times",
    daysRequired: 3,
    type: "protein",
    icon: "💪",
    unlockedText: "Unlocked! Master of budget protein hacking."
  }
];

// Smart Food Swap Rules & Alternatives
export const SMART_SWAP_RULES = [
  {
    original: ["maggi", "samosa", "chips"],
    replacement: {
      foodKey: "poha",
      name: "Poha + Banana",
      caloriesDiff: -160,
      proteinDiff: +3,
      costDiff: -5,
      reason: "Less saturated fat, sustained energy from complex carbs, available in mess."
    }
  },
  {
    original: ["aloo_sabzi"],
    replacement: {
      foodKey: "dal",
      name: "Extra Dal Tadka + Salad",
      caloriesDiff: -30,
      proteinDiff: +5,
      costDiff: +5,
      reason: "Swaps simple starch for lean vegetarian protein and fiber."
    }
  },
  {
    original: ["soda"],
    replacement: {
      foodKey: "curd",
      name: "Plain Curd / Chaas",
      caloriesDiff: -12,
      proteinDiff: +4.2,
      costDiff: -5,
      reason: "Zero refined white sugar, provides gut-friendly probiotics and calcium."
    }
  }
];
