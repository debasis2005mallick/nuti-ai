/**
 * NutriScan AI - NutriBot Conversational Intelligence Service
 * Provides context-aware nutrition coaching, hostel food hacks, budget advice, and plate analysis.
 */

export class ChatBotService {
  /**
   * Process a user query given live application state and return a helpful markdown response
   */
  static async askNutriBot(userQuestion, state, onTyping = () => {}) {
    const q = (userQuestion || "").toLowerCase().trim();
    const profile = state.profile || {};
    const today = state.today || {};
    const remainingCalories = Math.max(0, (profile.dailyCaloriesTarget || 2200) - (today.consumedCalories || 1380));
    const remainingBudget = Math.max(0, (profile.dailyBudget || 150) - (today.budgetSpent || 85));
    const proteinTarget = profile.dailyProteinTarget || 75;
    const consumedProtein = today.consumedProteinG || 52;
    const proteinDeficit = Math.max(0, proteinTarget - consumedProtein);

    // If live Gemini key is present, attempt live query with system context
    if (profile.geminiApiKey && profile.geminiApiKey.trim().length > 10) {
      try {
        return await this.callGeminiChat(userQuestion, state, profile.geminiApiKey);
      } catch (err) {
        console.warn("Live Gemini Chat API failed, using intelligent offline response:", err);
      }
    }

    // High-fidelity offline conversational responses
    await new Promise(r => setTimeout(r, 600));

    if (q.includes("maggi") || q.includes("instant noodle") || q.includes("late night")) {
      if (remainingCalories >= 350 && remainingBudget >= 25) {
        return `🍜 **Can you have Maggi tonight?**\n\nYes, technically you have **${remainingCalories} kcal** and **₹${remainingBudget}** left today! However, a single pack of Maggi has ~310 kcal, 12g fat, and only 6g protein with high sodium.\n\n💡 **Hostel Pro Tip:** Crack **1 boiled egg** or stir in **50g paneer/curd** to add 6-8g of protein and keep your blood sugar stable!`;
      } else {
        return `⚠️ **Maggi Alert:** You only have **${remainingCalories} kcal** and **₹${remainingBudget}** left for today. Maggi (~310 kcal, ₹25) would max out your remaining budget. Consider having **1 cup of warm milk + banana** (~150 kcal, ₹18) instead for better sleep and recovery!`;
      }
    }

    if (q.includes("protein") || q.includes("80g") || q.includes("muscle") || q.includes("gym")) {
      return `💪 **Hitting ${proteinTarget}g Protein on a Student Budget (₹100-₹150/day):**\n\n1. **Hostel Mess Dal (2 bowls):** ~14g protein (~₹30)\n2. **2 Boiled Eggs or 100g Curd/Dahi:** ~12g protein (~₹16)\n3. **1 Glass Hostel Milk:** ~7g protein (~₹12)\n4. **100g Soya Chunks or Paneer:** ~18g protein (~₹25-₹40)\n5. **4 Rotis:** ~14g protein (~₹20)\n\n📊 **Total:** ~65g - 75g protein for under **₹110/day**! You currently need **${proteinDeficit}g** more today to hit your goal.`;
    }

    if (q.includes("snack") || q.includes("under 30") || q.includes("₹30") || q.includes("canteen")) {
      return `🥗 **Top 4 Hostel Snacks Under ₹30:**\n\n1. **Kanda Poha + Chai:** ~₹25 | 240 kcal | 5g protein\n2. **2 Boiled Eggs + Salt/Pepper:** ~₹16 | 156 kcal | 12.6g protein 🏆\n3. **Fresh Curd (150g) + 1 Banana:** ~₹21 | 185 kcal | 6g protein\n4. **Puffed Rice (Bhel) with Roasted Peanuts:** ~₹20 | 180 kcal | 6g protein`;
    }

    if (q.includes("health score") || q.includes("score") || q.includes("explain")) {
      return `📊 **How NutriScan Health Score Works:**\n\nYour score is calculated deterministically based on:\n- **Protein Ratio:** Boosts score (+12 pts)\n- **Dietary Fiber & Whole Grains:** Boosts score (+10 pts)\n- **Fresh Salad / Greens / Curd:** Boosts score (+6 pts)\n- **Ultra-processed / Fried Snacks / Soda:** Heavy penalty (-22 pts)\n\nIt is designed to give you instant feedback on food quality, not just calories!`;
    }

    if (q.includes("plan") || q.includes("menu") || q.includes("today") || q.includes("eat now")) {
      return `🍽️ **Today's Recommended Mess Strategy:**\n\n- **Remaining Budget:** ₹${remainingBudget}\n- **Remaining Calories:** ${remainingCalories} kcal\n- **Protein Needed:** ${proteinDeficit}g\n\n👉 **Recommended Dinner Plate:** 2 Roti + Yellow Dal + Mixed Veg Sabzi + Salad + 1 bowl Curd (Est. 540 kcal, 24g protein, ₹55). This fits your daily budget and closes your protein deficit!`;
    }

    // Default intelligent assistant response
    return `👋 I'm analyzing your student goals! You currently have **${remainingCalories} kcal** and **₹${remainingBudget}** remaining today with **${proteinDeficit}g** protein left to reach your ${profile.goal.replace('-', ' ')} target.\n\nFeel free to ask me:\n- *"Can I eat Maggi tonight?"*\n- *"How to get 80g protein from mess food?"*\n- *"Suggest a healthy snack under ₹30"*\n- *"Give me a ₹100 full day plan"*`;
  }

  /**
   * Optional Gemini API Chat integration
   */
  static async callGeminiChat(question, state, apiKey) {
    const profile = state.profile || {};
    const today = state.today || {};
    const systemPrompt = `You are NutriBot, an AI student nutrition, budget, and hostel food expert.
User Profile: Goal: ${profile.goal}, Diet: ${profile.diet}, Daily Calorie Target: ${profile.dailyCaloriesTarget} kcal, Daily Budget: ₹${profile.dailyBudget}.
Today's Consumed: Calories: ${today.consumedCalories} kcal, Protein: ${today.consumedProteinG}g, Budget Spent: ₹${today.budgetSpent}.
Give helpful, practical, encouraging Indian student/hostel advice formatted with clean markdown bullet points and emojis.`;

    const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${apiKey}`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        contents: [
          { parts: [{ text: `${systemPrompt}\n\nStudent Question: ${question}` }] }
        ]
      })
    });

    if (!response.ok) throw new Error("Gemini Chat failed");
    const data = await response.json();
    return data.candidates?.[0]?.content?.parts?.[0]?.text || "Here is your hostel food suggestion!";
  }
}
