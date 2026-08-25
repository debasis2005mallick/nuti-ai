# NutriScan AI — Student Food Intelligence & Hostel Meal Planner

> **“Scan your food. Understand your nutrition. Eat smarter.”**  
> *“Most nutrition apps tell you what you ate. NutriScan AI helps you decide what to eat next — based on your food, budget, calories, hostel menu and goals.”*

---

## 🏆 Project Overview

NutriScan AI is an AI-powered student food intelligence and meal planning platform tailored specifically for college and hostel students. It solves the student nutrition gap: students eat whatever is available in the mess or canteen without knowing its nutritional impact or cost efficiency.

### Core Product Journey
$$\text{SCAN} \longrightarrow \text{UNDERSTAND} \longrightarrow \text{PLAN} \longrightarrow \text{OPTIMIZE} \longrightarrow \text{BUILD HABITS}$$

---

## ✨ Key Features & Modules

1. **📸 Module A — AI Multi-Food Plate Scanner**:
   - Accurately detects composite meals with multiple dishes (e.g. Rice, Dal, 2 Roti, Paneer Curry, Salad, Curd).
   - Itemized macronutrient breakdown (Calories, Protein, Carbs, Fat, Fiber) & estimated costs in ₹.
   - Transparent, explainable Health Score (0–100) with *Doing Well* vs *To Improve* actionable advice.
   - **Live Plate Editor**: Adjust portion sliders, delete items, or add foods from the built-in Indian food database with instant real-time recalculations.

2. **🏠 Module B — Hostel Mode (Mess Menu OCR & Parser)**:
   - Scan weekly mess notice board photos or paste mess text schedules.
   - Categorizes dishes by Day (Monday–Sunday) and Meal (Breakfast, Lunch, Snacks, Dinner).
   - Preloaded with a realistic Indian hostel mess schedule.
   - Interactive item tags with add/remove/edit capabilities.

3. **🍽️ Module C & E — Smart Meal Planner & "What Should I Eat Now?"**:
   - Deterministic multi-criteria optimization engine combining:
     - Today's available mess menu
     - Remaining calories & protein
     - Remaining student pocket budget
     - Fitness goal (💪 High Protein, 💰 Budget Saver, 🔥 Calorie Controlled, 🥗 Balanced Eating)
   - Outputs:
     - 🏆 **BEST MATCH**
     - 💰 **BUDGET SAVER (<₹50)**
     - 💪 **HIGH PROTEIN OPTION**
     - ⚡ **CALORIE CONTROLLED**
   - **"🍽️ What Should I Eat Now?"**: Time-aware decision engine recommending the exact plate for the current hour with clear reasoning.
   - **🔄 Smart Food Swaps**: Practical hostel substitutions that maximize protein and cut empty calories.
   - **📅 7-Day Full Hostel Meal Plan**: Complete weekly planner with average daily calories, protein, and costs.

4. **💰 Module D — Cost & Value-For-Money Optimization**:
   - Transparent estimated price tracking per food, per meal, daily, weekly, and monthly.
   - **Nutrition Value-For-Money Analyzer**: Ranks Indian student foods by Protein per Rupee (g/₹) and Fiber per Rupee.

5. **🔥 Module F — Gamified Streaks & Habit Tracker**:
   - 🔥 **7-Day Nutrition Streak** visual calendar.
   - 💧 **Interactive Water Tracker** with quick `+250 ml` and `+500 ml` one-tap logging.
   - 📸 **Meal Logging Streak** & 💪 **Protein Goal Streak**.
   - 🏅 **Milestone Badges**: *Getting Started (3d)*, *Healthy Week (7d)*, *Consistency Champion (14d)*, *Nutrition Master (30d)*, *Hydration Hero*, *Mess Protein Hacker*.

6. **📊 Module G — Weekly Insights & Meal History**:
   - 7-day calorie and spending trend charts.
   - AI Weekly Report summarizing eating patterns and suggestions.
   - Chronological Logged Meal History timeline.

7. **🤖 Module H — NutriBot AI Chat Assistant**:
   - Context-aware conversational food companion.
   - Aware of live student profile, consumed macros, remaining budget, and today's mess menu.
   - Preloaded student prompt chips (*"Can I eat Maggi tonight?"*, *"How to hit 80g protein with mess food?"*, *"Late-night snack under ₹30"*).

8. **📱 Dual Interface for Desktop & Mobile**:
   - **Desktop**: Glassmorphic sidebar navigation, multi-column analytics grids, split-screen live plate editor.
   - **Mobile**: Fixed bottom navigation bar, touch-friendly action buttons, responsive cards.

9. **🎯 1-Click Judge Demo Mode & Fallback System**:
   - Instant 1-click presets (*Indian Thali*, *Late-Night Maggi*, *High-Protein Gym Plate*, *Hostel Menu*).
   - Built-in deterministic Indian nutrition engine ensures **100% offline uptime** with zero external API dependencies required, plus optional Google Gemini Vision API key support.

---

## 🚀 How to Run & Deploy

### Option 1: Direct GitHub Pages Deployment (Zero Server Setup)
1. Push this repository to GitHub:
   ```bash
   git init
   git add .
   git commit -m "Initial commit of NutriScan AI"
   git branch -M main
   git remote add origin https://github.com/YOUR_USERNAME/nutriscan-ai.git
   git push -u origin main
   ```
2. Go to **Repository Settings** > **Pages** > Select `main` branch / `root` folder > **Save**.
3. Your web app is immediately live at `https://YOUR_USERNAME.github.io/nutriscan-ai/`!

### Option 2: Run with Dedicated Backend Server

#### A. Node.js / Express Backend (Port 5000):
```bash
cd server
npm install
npm start
```
The REST API will be live at `http://localhost:5000/api/health`.

#### B. Python FastAPI Backend (Port 5000):
```bash
cd server
pip install -r requirements.txt
python main.py
```
Interactive Swagger API docs will be live at `http://localhost:5000/docs`.

---

## 🏗️ Architecture

```
NutriScan AI
├── index.html                   # Core semantic HTML5 application
├── server/                      # Dedicated Backend REST API Server
│   ├── server.js                # Node.js Express REST API
│   ├── package.json             # Node.js dependencies
│   ├── main.py                  # Python FastAPI alternate backend
│   ├── requirements.txt         # Python dependencies
│   └── data/                    # JSON database storage (Menu & Meal history)
├── styles/
│   ├── main.css                 # Design tokens, dark mode, glassmorphism
│   ├── components.css           # Buttons, badges, tables, charts, modals, toasts
│   ├── desktop.css              # Desktop sidebar & multi-column layouts
│   └── mobile.css               # Mobile bottom bar & touch drawer layouts
├── js/
│   ├── app.js                   # Application coordinator & router
│   ├── config.js                # Indian food nutrition & price database, mess schedules
│   ├── state.js                 # Reactive state store with LocalStorage persistence
│   ├── services/
│   │   ├── apiService.js        # Full-stack API bridge (Auto-detects server)
│   │   ├── onlineNutritionService.js # Open Food Facts live global dataset
│   │   ├── aiVisionService.js   # Multi-food detection (Gemini + offline heuristic engine)
│   │   ├── ocrMenuService.js    # Hostel menu OCR & text parser
│   │   ├── nutritionEngine.js   # Deterministic nutrition, portion & health score calculator
│   │   ├── costEngine.js        # Cost estimator & Value-for-Money analyzer
│   │   ├── mealPlanner.js       # Hostel meal optimizer & "What Should I Eat Now?"
│   │   ├── streakService.js     # Streaks, hydration & badges engine
│   │   └── chatBotService.js    # NutriBot conversational AI assistant
│   ├── components/
│   │   ├── dashboardView.js     # Master Dashboard & Budget Wizard
│   │   ├── scannerView.js       # Food Scanner & Live Plate Editor
│   │   ├── hostelModeView.js    # Hostel Mode & Menu Scanner
│   │   ├── mealPlannerView.js   # Meal Planner & Swaps
│   │   ├── streaksView.js       # Streaks & Hydration
│   │   ├── insightsView.js      # Weekly Analytics & History
│   │   ├── chatBotView.js       # NutriBot AI Chat View
│   │   └── profileView.js       # Profile & Settings
│   └── utils/
│       ├── charts.js            # SVG Donut, Radial Rings & Bar Charts
│       └── helpers.js           # Toast notifications & image compression
└── assets/
    └── demo/                    # Preloaded high-res demo meal assets
```

---

## 🛡️ Responsible AI & Disclaimer
Nutrition calculations and costs are AI-assisted estimates for general student awareness and habit building. This tool is designed for educational and lifestyle guidance and does not provide medical advice or diagnosis.
