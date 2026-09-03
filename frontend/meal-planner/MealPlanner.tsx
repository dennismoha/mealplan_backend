import { useState, useEffect } from "react"
import "./meal-planner.css"

// ─── Data types ────────────────────────────────────────────────────────────────

type Recipe = {
  description: string
  prepTime: string
  calories: number
  servings: number
  ingredients: string[]
  steps: string[]
}

type Meal = {
  name: string
  tiktok?: string
  recipe?: Recipe
}

type DayMeals = {
  breakfast: Meal
  morning_break: Meal
  lunch: Meal
  evening_break: Meal
  supper: Meal
}

type MealPlan = {
  key: string
  label: string
  weekOf: string
  days: Record<string, DayMeals>
}

// ─── Sample data ───────────────────────────────────────────────────────────────

const PLANS: MealPlan[] = [
  {
    key: "week2",
    label: "Week 2",
    weekOf: "Jan 8–14, 2025",
    days: {
      Monday: {
        breakfast: {
          name: "Mandazi & Chai",
          tiktok: "https://www.tiktok.com/@kenyanfoodie/video/1234567890",
          recipe: {
            description:
              "Fluffy East African doughnuts spiced with cardamom, served with sweet milky chai.",
            prepTime: "25 min",
            calories: 380,
            servings: 4,
            ingredients: [
              "2 cups flour",
              "1 tsp baking powder",
              "½ tsp cardamom",
              "3 tbsp sugar",
              "1 egg",
              "¾ cup coconut milk",
              "Oil for frying",
            ],
            steps: [
              "Mix dry ingredients in a bowl.",
              "Add egg and coconut milk, knead to a soft dough.",
              "Rest for 10 minutes, then roll out and cut triangles.",
              "Fry in hot oil until golden brown on both sides.",
              "Drain on paper towels and serve with chai.",
            ],
          },
        },
        morning_break: {
          name: "Fresh Fruit",
          recipe: {
            description: "Seasonal mixed fruit plate.",
            prepTime: "5 min",
            calories: 90,
            servings: 1,
            ingredients: [
              "1 banana",
              "1 mango slice",
              "Handful of strawberries",
            ],
            steps: ["Slice fruit and plate."],
          },
        },
        lunch: {
          name: "Chicken Salad",
          tiktok: "https://www.tiktok.com/@healthyke/video/9876543210",
          recipe: {
            description:
              "Grilled chicken breast over crisp romaine with avocado and lemon dressing.",
            prepTime: "20 min",
            calories: 420,
            servings: 2,
            ingredients: [
              "200g chicken breast",
              "2 cups romaine",
              "1 avocado",
              "Lemon juice",
              "Olive oil",
              "Salt & pepper",
              "Cherry tomatoes",
            ],
            steps: [
              "Season and grill chicken until cooked through.",
              "Let rest 5 mins, slice thinly.",
              "Toss romaine with lemon-olive oil dressing.",
              "Top with chicken, avocado slices and tomatoes.",
            ],
          },
        },
        evening_break: {
          name: "Yogurt & Honey",
          recipe: {
            description: "Plain yogurt drizzled with local honey.",
            prepTime: "2 min",
            calories: 140,
            servings: 1,
            ingredients: ["200ml plain yogurt", "1 tbsp honey"],
            steps: ["Spoon yogurt into a bowl, drizzle honey."],
          },
        },
        supper: {
          name: "Grilled Fish & Rice",
          tiktok: "https://www.tiktok.com/@coastalcooks/video/1122334455",
          recipe: {
            description:
              "Tilapia marinated in garlic and lemon, grilled to perfection, with steamed white rice.",
            prepTime: "30 min",
            calories: 520,
            servings: 2,
            ingredients: [
              "2 tilapia fillets",
              "3 cloves garlic",
              "Juice of 1 lemon",
              "1 tsp paprika",
              "2 cups rice",
              "Coriander to garnish",
            ],
            steps: [
              "Marinate fish in garlic, lemon and paprika for 15 mins.",
              "Grill on medium-high for 4–5 mins each side.",
              "Cook rice with a pinch of salt.",
              "Serve fish over rice, garnish with coriander.",
            ],
          },
        },
      },
      Tuesday: {
        breakfast: {
          name: "Chapo & Chai",
          tiktok: "https://www.tiktok.com/@mamachapati/video/5544332211",
          recipe: {
            description:
              "Flaky layered chapati with a cup of Kenyan spiced tea.",
            prepTime: "40 min",
            calories: 440,
            servings: 3,
            ingredients: [
              "3 cups flour",
              "1 cup warm water",
              "3 tbsp oil",
              "1 tsp salt",
            ],
            steps: [
              "Mix flour, salt, water into dough.",
              "Rest 20 mins, divide into balls.",
              "Roll flat, spread oil, fold and re-roll.",
              "Cook on dry pan 2–3 mins per side.",
            ],
          },
        },
        morning_break: {
          name: "Loaf & Coffee",
          recipe: {
            description: "Slice of whole-grain bread with black coffee.",
            prepTime: "3 min",
            calories: 180,
            servings: 1,
            ingredients: ["2 slices bread", "1 cup black coffee"],
            steps: ["Toast bread if desired. Brew coffee and serve."],
          },
        },
        lunch: {
          name: "Mashed Potatoes & Stew",
          recipe: {
            description:
              "Creamy mashed potatoes served with vegetable beef stew.",
            prepTime: "35 min",
            calories: 560,
            servings: 2,
            ingredients: [
              "4 potatoes",
              "2 tbsp butter",
              "¼ cup milk",
              "300g beef",
              "1 onion",
              "2 tomatoes",
              "Carrots",
            ],
            steps: [
              "Boil potatoes, mash with butter and milk.",
              "Brown beef in a pot, add onions and tomatoes.",
              "Add carrots and water, simmer 20 mins.",
              "Serve stew over mash.",
            ],
          },
        },
        evening_break: {
          name: "Coffee & Biscuits",
          recipe: {
            description: "Instant coffee with digestive biscuits.",
            prepTime: "3 min",
            calories: 160,
            servings: 1,
            ingredients: ["1 cup coffee", "3 digestive biscuits"],
            steps: ["Brew coffee, serve with biscuits."],
          },
        },
        supper: {
          name: "Githeri & Avocado",
          recipe: {
            description:
              "Hearty boiled maize and beans stew served with sliced avocado.",
            prepTime: "50 min",
            calories: 480,
            servings: 3,
            ingredients: [
              "1 cup dry maize",
              "1 cup dry beans",
              "1 onion",
              "2 tomatoes",
              "1 avocado",
              "Salt",
            ],
            steps: [
              "Soak maize and beans overnight.",
              "Boil together until tender, about 45 mins.",
              "Sauté onion and tomato, add to the pot.",
              "Serve hot with sliced avocado on the side.",
            ],
          },
        },
      },
      Wednesday: {
        breakfast: {
          name: "Ugali Wimbi Porridge",
          recipe: {
            description:
              "Thick finger-millet porridge, nutritious and filling.",
            prepTime: "15 min",
            calories: 310,
            servings: 2,
            ingredients: [
              "1 cup millet flour",
              "3 cups water",
              "Salt",
              "Milk to serve",
            ],
            steps: [
              "Bring water to boil.",
              "Gradually whisk in millet flour.",
              "Stir constantly until thick, about 10 mins.",
              "Serve warm with milk.",
            ],
          },
        },
        morning_break: {
          name: "Loaf & Coffee",
          recipe: {
            description: "Toasted bread with butter and coffee.",
            prepTime: "5 min",
            calories: 200,
            servings: 1,
            ingredients: ["2 slices bread", "Butter", "Coffee"],
            steps: ["Toast bread, spread butter.", "Serve with hot coffee."],
          },
        },
        lunch: {
          name: "Ugali & Sukuma",
          tiktok: "https://www.tiktok.com/@kenyanfoodie/video/6677889900",
          recipe: {
            description:
              "Kenya's staple — stiff maize porridge alongside sautéed kale with onion and tomato.",
            prepTime: "25 min",
            calories: 490,
            servings: 2,
            ingredients: [
              "2 cups maize flour",
              "4 cups water",
              "1 bunch kale",
              "1 onion",
              "2 tomatoes",
              "Oil",
              "Salt",
            ],
            steps: [
              "Bring water to boil in a pot.",
              "Add flour gradually, stirring until stiff.",
              "Cook kale in oiled pan with onion and tomato.",
              "Season and serve together.",
            ],
          },
        },
        evening_break: {
          name: "Cocoa",
          recipe: {
            description: "Warm drinking chocolate.",
            prepTime: "5 min",
            calories: 130,
            servings: 1,
            ingredients: [
              "1 cup milk",
              "2 tbsp cocoa powder",
              "Sugar to taste",
            ],
            steps: ["Heat milk, whisk in cocoa and sugar until frothy."],
          },
        },
        supper: {
          name: "Minji Rice",
          recipe: {
            description:
              "Fragrant rice cooked with green peas and mild spices.",
            prepTime: "30 min",
            calories: 420,
            servings: 2,
            ingredients: [
              "2 cups basmati rice",
              "1 cup green peas",
              "1 onion",
              "1 tsp cumin",
              "2 tbsp ghee",
              "Salt",
            ],
            steps: [
              "Fry onion in ghee with cumin until golden.",
              "Add rice, stir 2 mins.",
              "Add peas and water, cook until rice is done.",
            ],
          },
        },
      },
      Thursday: {
        breakfast: {
          name: "Cocoa Oats",
          recipe: {
            description: "Rolled oats cooked with cocoa and banana.",
            prepTime: "10 min",
            calories: 350,
            servings: 1,
            ingredients: [
              "½ cup rolled oats",
              "1 cup milk",
              "1 tbsp cocoa",
              "1 banana",
              "Honey",
            ],
            steps: [
              "Cook oats in milk on medium heat.",
              "Stir in cocoa, sweeten with honey.",
              "Top with sliced banana.",
            ],
          },
        },
        morning_break: {
          name: "Juice & Cola Nuts",
          recipe: {
            description: "Fresh juice with a handful of mixed nuts.",
            prepTime: "5 min",
            calories: 170,
            servings: 1,
            ingredients: ["200ml fresh juice", "30g mixed nuts"],
            steps: ["Pour juice, serve with nuts on the side."],
          },
        },
        lunch: {
          name: "Pizza Slice",
          tiktok: "https://www.tiktok.com/@nairobi_pizza/video/2244668810",
          recipe: {
            description:
              "Thin-crust pizza with mozzarella, tomato sauce and mixed vegetables.",
            prepTime: "45 min",
            calories: 680,
            servings: 2,
            ingredients: [
              "Pizza base",
              "3 tbsp tomato paste",
              "100g mozzarella",
              "Bell peppers",
              "Mushrooms",
              "Olives",
              "Oregano",
            ],
            steps: [
              "Spread tomato paste on base.",
              "Add cheese and toppings.",
              "Bake at 220°C for 12–15 mins until golden.",
            ],
          },
        },
        evening_break: {
          name: "Coffee",
          recipe: {
            description: "Double espresso or strong Kenyan AA coffee.",
            prepTime: "5 min",
            calories: 10,
            servings: 1,
            ingredients: ["Kenyan AA ground coffee", "Hot water"],
            steps: ["Brew your preferred way and enjoy black."],
          },
        },
        supper: {
          name: "Fruits & Greens Bowl",
          recipe: {
            description:
              "Light dinner of mixed fresh fruit with steamed greens.",
            prepTime: "10 min",
            calories: 260,
            servings: 1,
            ingredients: [
              "1 cup mixed fruit",
              "1 cup steamed spinach",
              "Lemon dressing",
              "Chia seeds",
            ],
            steps: [
              "Steam spinach 3 mins.",
              "Arrange with fruit in a bowl.",
              "Drizzle lemon dressing, top with chia seeds.",
            ],
          },
        },
      },
      Friday: {
        breakfast: {
          name: "Tea & Biscuits",
          recipe: {
            description: "Kenyan spiced chai with glucose biscuits.",
            prepTime: "8 min",
            calories: 220,
            servings: 1,
            ingredients: [
              "2 tea bags",
              "1 cup milk",
              "Cardamom",
              "Ginger",
              "Sugar",
              "4 biscuits",
            ],
            steps: [
              "Boil milk with cardamom and ginger.",
              "Add tea bags, steep 3 mins.",
              "Sweeten and serve with biscuits.",
            ],
          },
        },
        morning_break: {
          name: "Avocado Fruit",
          recipe: {
            description: "Ripe Hass avocado with a squeeze of lime.",
            prepTime: "2 min",
            calories: 160,
            servings: 1,
            ingredients: ["1 ripe avocado", "Lime", "Pinch of salt"],
            steps: ["Halve avocado, remove seed. Squeeze lime over, add salt."],
          },
        },
        lunch: {
          name: "Mayai Sauce",
          tiktok: "https://www.tiktok.com/@kenyanfoodie/video/3355779900",
          recipe: {
            description:
              "Eggs cooked in a rich tomato-onion sauce, a Kenyan classic.",
            prepTime: "20 min",
            calories: 380,
            servings: 2,
            ingredients: [
              "4 eggs",
              "2 tomatoes",
              "1 onion",
              "1 green pepper",
              "Oil",
              "Salt & pepper",
              "Coriander",
            ],
            steps: [
              "Fry onion until soft.",
              "Add tomatoes and pepper, cook 5 mins.",
              "Crack eggs into sauce, cover and cook until set.",
              "Garnish with coriander.",
            ],
          },
        },
        evening_break: {
          name: "Yogurt",
          recipe: {
            description: "Plain probiotic yogurt.",
            prepTime: "1 min",
            calories: 100,
            servings: 1,
            ingredients: ["200ml plain yogurt"],
            steps: ["Serve chilled."],
          },
        },
        supper: {
          name: "Ugali & Beans",
          tiktok: "https://www.tiktok.com/@mamas_kitchen_ke/video/7788996655",
          recipe: {
            description:
              "Stiff ugali paired with slow-cooked kidney bean stew.",
            prepTime: "60 min",
            calories: 530,
            servings: 3,
            ingredients: [
              "2 cups maize flour",
              "1 cup kidney beans",
              "1 onion",
              "2 tomatoes",
              "1 tsp cumin",
            ],
            steps: [
              "Soak beans overnight, boil 45 mins.",
              "Sauté onion and tomatoes, add beans.",
              "Simmer 10 mins. Prepare ugali separately.",
            ],
          },
        },
      },
      Saturday: {
        breakfast: {
          name: "Eggs & Toast",
          tiktok: "https://www.tiktok.com/@breakfast_ke/video/4466880022",
          recipe: {
            description: "Scrambled eggs with buttered sourdough toast.",
            prepTime: "10 min",
            calories: 420,
            servings: 1,
            ingredients: [
              "3 eggs",
              "2 slices sourdough",
              "Butter",
              "Salt & pepper",
              "Chives",
            ],
            steps: [
              "Scramble eggs in butter on low heat.",
              "Toast bread until golden.",
              "Serve eggs on toast, top with chives.",
            ],
          },
        },
        morning_break: {
          name: "Fresh Fruit",
          recipe: {
            description: "Sliced tropical fruit — pawpaw, pineapple, mango.",
            prepTime: "5 min",
            calories: 110,
            servings: 1,
            ingredients: ["¼ pawpaw", "2 pineapple rings", "½ mango"],
            steps: ["Slice and arrange on a plate."],
          },
        },
        lunch: {
          name: "Chicken Salad",
          recipe: {
            description: "Grilled chicken over crisp greens.",
            prepTime: "20 min",
            calories: 420,
            servings: 2,
            ingredients: [
              "200g chicken",
              "Mixed greens",
              "Avocado",
              "Lemon vinaigrette",
            ],
            steps: [
              "Grill chicken, slice. Toss greens with dressing. Top with chicken and avocado.",
            ],
          },
        },
        evening_break: {
          name: "Yogurt",
          recipe: {
            description: "Probiotic yogurt with honey.",
            prepTime: "2 min",
            calories: 140,
            servings: 1,
            ingredients: ["200ml yogurt", "1 tbsp honey"],
            steps: ["Drizzle honey over yogurt and serve."],
          },
        },
        supper: {
          name: "Grilled Fish & Fries",
          recipe: {
            description: "Pan-grilled tilapia with crispy potato fries.",
            prepTime: "35 min",
            calories: 580,
            servings: 2,
            ingredients: [
              "2 tilapia fillets",
              "3 potatoes",
              "Oil",
              "Salt",
              "Lemon",
              "Paprika",
            ],
            steps: [
              "Cut potatoes into fries, fry until crispy.",
              "Season fish, grill 4 mins each side.",
              "Serve with lemon wedge.",
            ],
          },
        },
      },
      Sunday: {
        breakfast: {
          name: "Biscuits & Chai",
          recipe: {
            description:
              "Afternoon-style morning with digestive biscuits and milky tea.",
            prepTime: "8 min",
            calories: 200,
            servings: 1,
            ingredients: ["Tea", "Milk", "Sugar", "5 digestive biscuits"],
            steps: ["Brew strong tea with milk.", "Serve with biscuits."],
          },
        },
        morning_break: {
          name: "Fresh Fruit",
          recipe: {
            description: "Papaya and watermelon slices.",
            prepTime: "5 min",
            calories: 95,
            servings: 1,
            ingredients: ["½ cup papaya", "1 cup watermelon"],
            steps: ["Slice and serve chilled."],
          },
        },
        lunch: {
          name: "Nyama Choma & Kachumbari",
          tiktok: "https://www.tiktok.com/@nyamachoma_ke/video/9988776655",
          recipe: {
            description:
              "Charcoal-grilled goat ribs with tomato-onion-coriander salsa.",
            prepTime: "90 min",
            calories: 720,
            servings: 4,
            ingredients: [
              "1kg goat ribs",
              "Salt",
              "2 tomatoes",
              "1 red onion",
              "Coriander",
              "Lemon juice",
              "Chilli",
            ],
            steps: [
              "Season ribs with salt, grill over charcoal 1 hr turning regularly.",
              "Mix kachumbari: tomatoes, onion, coriander, lemon.",
              "Serve meat with kachumbari on the side.",
            ],
          },
        },
        evening_break: {
          name: "Yogurt",
          recipe: {
            description: "Chilled plain yogurt.",
            prepTime: "1 min",
            calories: 100,
            servings: 1,
            ingredients: ["200ml plain yogurt"],
            steps: ["Serve chilled."],
          },
        },
        supper: {
          name: "Grilled Fish & Rice",
          recipe: {
            description: "Tilapia with coconut rice.",
            prepTime: "35 min",
            calories: 540,
            servings: 2,
            ingredients: [
              "2 tilapia fillets",
              "2 cups rice",
              "400ml coconut milk",
              "Garlic",
              "Ginger",
            ],
            steps: [
              "Cook rice in coconut milk.",
              "Season fish with garlic and ginger.",
              "Grill 4 mins each side.",
              "Serve together.",
            ],
          },
        },
      },
    },
  },
  {
    key: "week3",
    label: "Week 3",
    weekOf: "Jan 15–21, 2025",
    days: {
      Monday: {
        breakfast: {
          name: "Oatmeal & Banana",
          tiktok: "https://www.tiktok.com/@fitke_eats/video/1122334456",
          recipe: {
            description: "Steel-cut oats with banana and cinnamon.",
            prepTime: "15 min",
            calories: 340,
            servings: 1,
            ingredients: [
              "½ cup oats",
              "1 cup milk",
              "1 banana",
              "Cinnamon",
              "Honey",
            ],
            steps: [
              "Cook oats in milk.",
              "Top with sliced banana, honey and cinnamon.",
            ],
          },
        },
        morning_break: {
          name: "Nuts & Raisins",
          recipe: {
            description: "Energy-dense trail mix.",
            prepTime: "1 min",
            calories: 200,
            servings: 1,
            ingredients: ["30g cashews", "20g raisins", "10g pumpkin seeds"],
            steps: ["Mix and serve in a small cup."],
          },
        },
        lunch: {
          name: "Mukimo & Stew",
          tiktok: "https://www.tiktok.com/@kikuyu_food/video/3344556677",
          recipe: {
            description:
              "Mashed potatoes, peas and corn with hearty beef stew.",
            prepTime: "45 min",
            calories: 610,
            servings: 3,
            ingredients: [
              "4 potatoes",
              "1 cup peas",
              "1 cup corn",
              "400g beef",
              "Onion",
              "Tomatoes",
              "Coriander",
            ],
            steps: [
              "Boil potatoes with peas and corn.",
              "Mash together.",
              "Prepare beef stew separately.",
              "Serve mukimo with stew on top.",
            ],
          },
        },
        evening_break: {
          name: "Green Tea",
          recipe: {
            description: "Antioxidant-rich green tea.",
            prepTime: "3 min",
            calories: 5,
            servings: 1,
            ingredients: ["1 green tea bag", "Hot water", "Honey (optional)"],
            steps: ["Steep tea bag 2–3 mins. Add honey if desired."],
          },
        },
        supper: {
          name: "Pilau & Kachumbari",
          tiktok: "https://www.tiktok.com/@kenyan_pilau/video/5566778899",
          recipe: {
            description:
              "Fragrant spiced rice with caramelized onions, served with fresh tomato-onion salsa.",
            prepTime: "50 min",
            calories: 560,
            servings: 4,
            ingredients: [
              "2 cups rice",
              "1 onion",
              "Pilau masala",
              "4 cups stock",
              "Bay leaves",
              "Cinnamon stick",
            ],
            steps: [
              "Fry onion until very dark.",
              "Add pilau masala, stir 1 min.",
              "Add rice and stock, cook until absorbed.",
              "Serve with kachumbari.",
            ],
          },
        },
      },
      Tuesday: {
        breakfast: {
          name: "Chapo & Eggs",
          recipe: {
            description: "Freshly made chapati with a fried egg.",
            prepTime: "30 min",
            calories: 510,
            servings: 2,
            ingredients: ["2 chapatis", "2 eggs", "Butter", "Salt"],
            steps: [
              "Fry egg in butter sunny-side up.",
              "Serve with warm chapati.",
            ],
          },
        },
        morning_break: {
          name: "Chocolate",
          recipe: {
            description: "Small piece of dark chocolate.",
            prepTime: "0 min",
            calories: 120,
            servings: 1,
            ingredients: ["40g dark chocolate (70%)"],
            steps: ["Enjoy as is."],
          },
        },
        lunch: {
          name: "Mashed Potatoes",
          recipe: {
            description: "Creamy mashed potatoes with butter and herbs.",
            prepTime: "25 min",
            calories: 380,
            servings: 2,
            ingredients: [
              "4 potatoes",
              "3 tbsp butter",
              "Warm milk",
              "Chives",
              "Salt",
            ],
            steps: [
              "Boil potatoes until soft.",
              "Drain and mash with butter and milk.",
              "Season and top with chives.",
            ],
          },
        },
        evening_break: {
          name: "Coffee",
          recipe: {
            description: "Kenyan AA single-origin coffee.",
            prepTime: "5 min",
            calories: 10,
            servings: 1,
            ingredients: ["Coffee grounds", "Hot water"],
            steps: ["Brew pour-over or French press coffee."],
          },
        },
        supper: {
          name: "Githeri & Avocado",
          recipe: {
            description: "Slow-cooked maize and beans with sliced avocado.",
            prepTime: "60 min",
            calories: 500,
            servings: 3,
            ingredients: [
              "1 cup maize",
              "1 cup beans",
              "Avocado",
              "Onion",
              "Tomatoes",
            ],
            steps: [
              "Soak legumes overnight.",
              "Boil 45–60 mins.",
              "Sauté onion and tomato, mix in.",
              "Serve with sliced avocado.",
            ],
          },
        },
      },
      Wednesday: {
        breakfast: {
          name: "Uji wa Mtama",
          recipe: {
            description: "Traditional sorghum porridge with milk and sugar.",
            prepTime: "15 min",
            calories: 290,
            servings: 2,
            ingredients: [
              "1 cup sorghum flour",
              "3 cups water",
              "Milk",
              "Sugar",
            ],
            steps: [
              "Boil water, whisk in flour.",
              "Stir until thick, simmer 8 mins.",
              "Serve with milk and sugar.",
            ],
          },
        },
        morning_break: {
          name: "Loaf & Coffee",
          recipe: {
            description: "Whole-grain toast with coffee.",
            prepTime: "5 min",
            calories: 200,
            servings: 1,
            ingredients: ["2 slices bread", "Coffee"],
            steps: ["Toast bread, brew coffee."],
          },
        },
        lunch: {
          name: "Ugali & Sukuma",
          tiktok: "https://www.tiktok.com/@kenyanfoodie/video/6677889900",
          recipe: {
            description: "Staple Kenyan ugali with braised kale.",
            prepTime: "25 min",
            calories: 490,
            servings: 2,
            ingredients: ["Maize flour", "Kale", "Onion", "Tomatoes"],
            steps: ["Prepare ugali. Sauté kale with onion and tomato. Serve."],
          },
        },
        evening_break: {
          name: "Cocoa",
          recipe: {
            description: "Hot cocoa drink.",
            prepTime: "5 min",
            calories: 130,
            servings: 1,
            ingredients: ["Milk", "Cocoa", "Sugar"],
            steps: ["Heat milk, whisk in cocoa and sugar."],
          },
        },
        supper: {
          name: "Minji Rice",
          recipe: {
            description: "Pea and cumin rice.",
            prepTime: "30 min",
            calories: 420,
            servings: 2,
            ingredients: ["Basmati rice", "Peas", "Cumin", "Ghee"],
            steps: [
              "Fry cumin in ghee.",
              "Add rice and peas.",
              "Cook in water until fluffy.",
            ],
          },
        },
      },
      Thursday: {
        breakfast: {
          name: "Cocoa",
          recipe: {
            description: "Warm cocoa with milk.",
            prepTime: "5 min",
            calories: 180,
            servings: 1,
            ingredients: ["Milk", "Cocoa", "Sugar"],
            steps: ["Heat and whisk together."],
          },
        },
        morning_break: {
          name: "Juice & Cola Nuts",
          recipe: {
            description: "Fresh orange juice and cola nuts.",
            prepTime: "5 min",
            calories: 160,
            servings: 1,
            ingredients: ["1 orange", "Cola nuts"],
            steps: ["Juice orange, serve with nuts."],
          },
        },
        lunch: {
          name: "Pizza",
          tiktok: "https://www.tiktok.com/@nairobi_pizza/video/2244668810",
          recipe: {
            description: "Homemade thin-crust pizza.",
            prepTime: "45 min",
            calories: 680,
            servings: 2,
            ingredients: [
              "Pizza dough",
              "Tomato sauce",
              "Mozzarella",
              "Toppings",
            ],
            steps: [
              "Roll dough, sauce, cheese, toppings.",
              "Bake 220°C for 12 mins.",
            ],
          },
        },
        evening_break: {
          name: "Coffee",
          recipe: {
            description: "Black Kenyan coffee.",
            prepTime: "5 min",
            calories: 10,
            servings: 1,
            ingredients: ["Coffee"],
            steps: ["Brew and enjoy."],
          },
        },
        supper: {
          name: "Fruits & Greens Bowl",
          recipe: {
            description: "Light mixed fruit and greens dinner.",
            prepTime: "10 min",
            calories: 260,
            servings: 1,
            ingredients: ["Mixed fruit", "Spinach", "Chia seeds"],
            steps: ["Plate greens and fruit, add chia seeds."],
          },
        },
      },
      Friday: {
        breakfast: {
          name: "Eggs & Toast",
          recipe: {
            description: "Scrambled eggs on toast.",
            prepTime: "10 min",
            calories: 420,
            servings: 1,
            ingredients: ["3 eggs", "Toast", "Butter"],
            steps: ["Scramble eggs, serve on buttered toast."],
          },
        },
        morning_break: {
          name: "Fresh Fruit",
          recipe: {
            description: "Seasonal fruit.",
            prepTime: "3 min",
            calories: 90,
            servings: 1,
            ingredients: ["Mixed seasonal fruit"],
            steps: ["Slice and serve."],
          },
        },
        lunch: {
          name: "Chicken Salad",
          tiktok: "https://www.tiktok.com/@healthyke/video/9876543210",
          recipe: {
            description: "Grilled chicken with mixed greens.",
            prepTime: "20 min",
            calories: 420,
            servings: 2,
            ingredients: [
              "Chicken breast",
              "Mixed greens",
              "Avocado",
              "Dressing",
            ],
            steps: ["Grill chicken, toss greens, assemble."],
          },
        },
        evening_break: {
          name: "Yogurt",
          recipe: {
            description: "Probiotic yogurt.",
            prepTime: "1 min",
            calories: 100,
            servings: 1,
            ingredients: ["200ml yogurt"],
            steps: ["Serve chilled."],
          },
        },
        supper: {
          name: "Grilled Fish & Rice",
          tiktok: "https://www.tiktok.com/@coastalcooks/video/1122334455",
          recipe: {
            description: "Tilapia with basmati rice.",
            prepTime: "30 min",
            calories: 520,
            servings: 2,
            ingredients: ["Tilapia", "Basmati rice", "Spices"],
            steps: ["Grill fish, cook rice, serve together."],
          },
        },
      },
      Saturday: {
        breakfast: {
          name: "Pancakes & Syrup",
          tiktok: "https://www.tiktok.com/@breakfast_ke/video/7744556633",
          recipe: {
            description: "Fluffy pancakes with golden syrup.",
            prepTime: "20 min",
            calories: 480,
            servings: 2,
            ingredients: [
              "1 cup flour",
              "1 cup milk",
              "2 eggs",
              "1 tbsp sugar",
              "Baking powder",
              "Syrup",
            ],
            steps: ["Mix batter, cook on buttered pan.", "Serve with syrup."],
          },
        },
        morning_break: {
          name: "Fresh Fruit",
          recipe: {
            description: "Pawpaw and banana.",
            prepTime: "3 min",
            calories: 100,
            servings: 1,
            ingredients: ["Pawpaw", "Banana"],
            steps: ["Slice and serve."],
          },
        },
        lunch: {
          name: "Chicken Salad",
          recipe: {
            description: "Grilled chicken over greens.",
            prepTime: "20 min",
            calories: 420,
            servings: 2,
            ingredients: ["Chicken", "Greens", "Dressing"],
            steps: ["Grill, toss, serve."],
          },
        },
        evening_break: {
          name: "Yogurt",
          recipe: {
            description: "Chilled yogurt.",
            prepTime: "1 min",
            calories: 100,
            servings: 1,
            ingredients: ["200ml yogurt"],
            steps: ["Serve chilled."],
          },
        },
        supper: {
          name: "Beef Stew & Ugali",
          tiktok: "https://www.tiktok.com/@mamas_kitchen_ke/video/8899001122",
          recipe: {
            description:
              "Rich slow-braised beef with vegetables and firm ugali.",
            prepTime: "90 min",
            calories: 640,
            servings: 3,
            ingredients: [
              "500g beef",
              "Potatoes",
              "Carrots",
              "Onion",
              "Tomatoes",
              "Maize flour",
            ],
            steps: [
              "Brown beef, add vegetables.",
              "Simmer 60 mins.",
              "Prepare ugali.",
              "Serve together.",
            ],
          },
        },
      },
      Sunday: {
        breakfast: {
          name: "Biscuits & Chai",
          recipe: {
            description: "Biscuits with Kenyan chai.",
            prepTime: "8 min",
            calories: 200,
            servings: 1,
            ingredients: ["Chai", "Biscuits"],
            steps: ["Brew chai, serve with biscuits."],
          },
        },
        morning_break: {
          name: "Fresh Fruit",
          recipe: {
            description: "Seasonal fruit plate.",
            prepTime: "3 min",
            calories: 95,
            servings: 1,
            ingredients: ["Mixed fruit"],
            steps: ["Slice and serve."],
          },
        },
        lunch: {
          name: "Nyama Choma & Ugali",
          tiktok: "https://www.tiktok.com/@nyamachoma_ke/video/9988776655",
          recipe: {
            description: "Charcoal-grilled beef with ugali and kachumbari.",
            prepTime: "90 min",
            calories: 740,
            servings: 4,
            ingredients: [
              "1kg beef",
              "Maize flour",
              "Tomatoes",
              "Onion",
              "Coriander",
            ],
            steps: [
              "Grill beef over charcoal.",
              "Prepare ugali.",
              "Make kachumbari.",
              "Serve all three.",
            ],
          },
        },
        evening_break: {
          name: "Yogurt",
          recipe: {
            description: "Probiotic yogurt.",
            prepTime: "1 min",
            calories: 100,
            servings: 1,
            ingredients: ["200ml yogurt"],
            steps: ["Serve chilled."],
          },
        },
        supper: {
          name: "Grilled Fish & Rice",
          recipe: {
            description: "Tilapia with fragrant rice.",
            prepTime: "35 min",
            calories: 540,
            servings: 2,
            ingredients: ["Tilapia", "Rice", "Spices"],
            steps: ["Grill fish, cook rice, serve."],
          },
        },
      },
    },
  },
]

// ─── Constants ─────────────────────────────────────────────────────────────────

const DAYS = [
  "Monday",
  "Tuesday",
  "Wednesday",
  "Thursday",
  "Friday",
  "Saturday",
  "Sunday",
]
const DAYS_SHORT = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"]

const MEAL_SLOTS: {
  key: keyof DayMeals
  label: string
  color: string
  bg: string
  icon: string
}[] = [
  {
    key: "breakfast",
    label: "Breakfast",
    color: "#f59e0b",
    bg: "rgba(245,158,11,0.12)",
    icon: "☕",
  },
  {
    key: "morning_break",
    label: "Morning Break",
    color: "#10b981",
    bg: "rgba(16,185,129,0.12)",
    icon: "🍎",
  },
  {
    key: "lunch",
    label: "Lunch",
    color: "#ef4444",
    bg: "rgba(239,68,68,0.12)",
    icon: "🍽️",
  },
  {
    key: "evening_break",
    label: "Evening Break",
    color: "#8b5cf6",
    bg: "rgba(139,92,246,0.12)",
    icon: "🫖",
  },
  {
    key: "supper",
    label: "Supper",
    color: "#3b82f6",
    bg: "rgba(59,130,246,0.12)",
    icon: "🌙",
  },
]

// ─── TikTok icon ───────────────────────────────────────────────────────────────

function TikTokIcon({ size = 14 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor">
      <path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-2.88 2.5 2.89 2.89 0 0 1-2.89-2.89 2.89 2.89 0 0 1 2.89-2.89c.28 0 .54.04.79.1V9.01a6.33 6.33 0 0 0-.79-.05A6.34 6.34 0 0 0 3.15 15.3a6.34 6.34 0 0 0 6.34 6.34 6.34 6.34 0 0 0 6.34-6.34V8.69a8.28 8.28 0 0 0 4.84 1.55V6.79a4.85 4.85 0 0 1-1.08-.1z" />
    </svg>
  )
}

// ─── Recipe Drawer ─────────────────────────────────────────────────────────────

function RecipeDrawer({
  meal,
  slotMeta,
  day,
  onClose,
}: {
  meal: Meal
  slotMeta: typeof MEAL_SLOTS[number]
  day: string
  onClose: () => void
}) {
  const { recipe } = meal

  useEffect(() => {
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose()
    }
    document.addEventListener("keydown", handleKey)
    return () => document.removeEventListener("keydown", handleKey)
  }, [onClose])

  return (
    <div
      className="fixed inset-0 z-50 flex items-end justify-center"
      style={{ fontFamily: "'Inter', sans-serif" }}
    >
      {/* Backdrop */}
      <div
        className="absolute inset-0"
        style={{ background: "rgba(0,0,0,0.7)", backdropFilter: "blur(4px)" }}
        onClick={onClose}
      />

      {/* Drawer */}
      <div
        className="meal-planner-drawer relative w-full max-w-2xl rounded-t-2xl overflow-hidden"
        style={{
          background: "#181c27",
          border: "1px solid #2a2f3e",
          borderBottom: "none",
          maxHeight: "90vh",
          display: "flex",
          flexDirection: "column",
        }}
      >
        {/* Drag handle */}
        <div className="flex justify-center pt-3 pb-1">
          <div
            style={{
              width: 36,
              height: 4,
              borderRadius: 2,
              background: "#3a3f50",
            }}
          />
        </div>

        {/* Header */}
        <div
          style={{
            padding: "16px 24px 20px",
            borderBottom: "1px solid #2a2f3e",
          }}
        >
          <div
            style={{
              display: "flex",
              alignItems: "flex-start",
              justifyContent: "space-between",
              gap: 12,
            }}
          >
            <div>
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: 8,
                  marginBottom: 8,
                }}
              >
                <span
                  style={{
                    fontSize: 11,
                    fontFamily: "'JetBrains Mono', monospace",
                    fontWeight: 500,
                    padding: "2px 8px",
                    borderRadius: 99,
                    color: slotMeta.color,
                    background: slotMeta.bg,
                    border: `1px solid ${slotMeta.color}40`,
                    letterSpacing: "0.05em",
                    textTransform: "uppercase",
                  }}
                >
                  {slotMeta.icon} {slotMeta.label}
                </span>
                <span
                  style={{
                    color: "#8a8f9e",
                    fontSize: 11,
                    fontFamily: "'JetBrains Mono', monospace",
                  }}
                >
                  {day}
                </span>
              </div>
              <h2
                style={{
                  fontFamily: "'Outfit', sans-serif",
                  fontSize: 26,
                  fontWeight: 700,
                  color: "#f0f0f0",
                  lineHeight: 1.2,
                  margin: 0,
                }}
              >
                {meal.name}
              </h2>
            </div>
            <button
              onClick={onClose}
              style={{
                background: "#252934",
                border: "1px solid #2a2f3e",
                borderRadius: 8,
                padding: "6px 10px",
                color: "#8a8f9e",
                cursor: "pointer",
                flexShrink: 0,
                fontSize: 13,
              }}
            >
              ✕
            </button>
          </div>

          {/* TikTok link */}
          {meal.tiktok && (
            <a
              href={meal.tiktok}
              target="_blank"
              rel="noopener noreferrer"
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: 7,
                marginTop: 12,
                padding: "8px 14px",
                borderRadius: 8,
                background: "rgba(255,45,85,0.12)",
                border: "1px solid rgba(255,45,85,0.35)",
                color: "#ff2d55",
                fontSize: 13,
                fontWeight: 500,
                textDecoration: "none",
                transition: "background 0.15s",
              }}
              onMouseEnter={(e) =>
                (e.currentTarget.style.background = "rgba(255,45,85,0.22)")
              }
              onMouseLeave={(e) =>
                (e.currentTarget.style.background = "rgba(255,45,85,0.12)")
              }
            >
              <TikTokIcon size={15} />
              Watch on TikTok
              <svg
                width="11"
                height="11"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                strokeWidth={2.5}
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M18 13v6a2 2 0 01-2 2H5a2 2 0 01-2-2V8a2 2 0 012-2h6M15 3h6m0 0v6m0-6L10 14"
                />
              </svg>
            </a>
          )}
        </div>

        {/* Scrollable body */}
        <div style={{ overflowY: "auto", padding: "20px 24px 32px", flex: 1 }}>
          {recipe ? (
            <>
              {/* Description + meta */}
              <p
                style={{
                  color: "#a0a5b8",
                  fontSize: 14,
                  lineHeight: 1.7,
                  marginBottom: 20,
                }}
              >
                {recipe.description}
              </p>
              <div
                style={{
                  display: "flex",
                  gap: 12,
                  marginBottom: 28,
                  flexWrap: "wrap",
                }}
              >
                {[
                  { label: "PREP TIME", value: recipe.prepTime },
                  { label: "CALORIES", value: `${recipe.calories} kcal` },
                  {
                    label: "SERVINGS",
                    value: `${recipe.servings} serving${
                      recipe.servings > 1 ? "s" : ""
                    }`,
                  },
                ].map((m) => (
                  <div
                    key={m.label}
                    style={{
                      padding: "8px 14px",
                      borderRadius: 8,
                      background: "#252934",
                      border: "1px solid #2a2f3e",
                    }}
                  >
                    <div
                      style={{
                        fontFamily: "'JetBrains Mono', monospace",
                        fontSize: 9,
                        color: "#6a6f7e",
                        letterSpacing: "0.08em",
                        textTransform: "uppercase",
                        marginBottom: 3,
                      }}
                    >
                      {m.label}
                    </div>
                    <div
                      style={{
                        fontFamily: "'Outfit', sans-serif",
                        fontSize: 16,
                        fontWeight: 600,
                        color: "#f0f0f0",
                      }}
                    >
                      {m.value}
                    </div>
                  </div>
                ))}
              </div>

              {/* Ingredients */}
              <div style={{ marginBottom: 28 }}>
                <h3
                  style={{
                    fontFamily: "'JetBrains Mono', monospace",
                    fontSize: 10,
                    color: "#8a8f9e",
                    letterSpacing: "0.1em",
                    textTransform: "uppercase",
                    marginBottom: 14,
                    margin: "0 0 14px",
                  }}
                >
                  Ingredients
                </h3>
                <div
                  style={{
                    display: "grid",
                    gridTemplateColumns:
                      "repeat(auto-fill, minmax(180px, 1fr))",
                    gap: 8,
                  }}
                >
                  {recipe.ingredients.map((ing, i) => (
                    <div
                      key={i}
                      style={{ display: "flex", alignItems: "center", gap: 8 }}
                    >
                      <div
                        style={{
                          width: 5,
                          height: 5,
                          borderRadius: "50%",
                          background: slotMeta.color,
                          flexShrink: 0,
                        }}
                      />
                      <span style={{ color: "#c8cdd8", fontSize: 13 }}>
                        {ing}
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Steps */}
              <div>
                <h3
                  style={{
                    fontFamily: "'JetBrains Mono', monospace",
                    fontSize: 10,
                    color: "#8a8f9e",
                    letterSpacing: "0.1em",
                    textTransform: "uppercase",
                    margin: "0 0 14px",
                  }}
                >
                  Method
                </h3>
                <div
                  style={{ display: "flex", flexDirection: "column", gap: 12 }}
                >
                  {recipe.steps.map((step, i) => (
                    <div
                      key={i}
                      style={{
                        display: "flex",
                        gap: 14,
                        alignItems: "flex-start",
                      }}
                    >
                      <div
                        style={{
                          width: 24,
                          height: 24,
                          borderRadius: "50%",
                          flexShrink: 0,
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                          background: slotMeta.bg,
                          border: `1px solid ${slotMeta.color}40`,
                          fontFamily: "'JetBrains Mono', monospace",
                          fontSize: 10,
                          fontWeight: 600,
                          color: slotMeta.color,
                        }}
                      >
                        {i + 1}
                      </div>
                      <p
                        style={{
                          color: "#c8cdd8",
                          fontSize: 14,
                          lineHeight: 1.6,
                          margin: 0,
                          paddingTop: 2,
                        }}
                      >
                        {step}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            </>
          ) : (
            <p
              style={{
                color: "#6a6f7e",
                fontSize: 14,
                textAlign: "center",
                padding: "32px 0",
              }}
            >
              No recipe available for this meal.
            </p>
          )}
        </div>
      </div>

    </div>
  )
}

// ─── Meal Cell ──────────────────────────────────────────────────────────────────

function MealCell({
  meal,
  slotMeta,
  day,
  onClick,
}: {
  meal: Meal | undefined
  slotMeta: typeof MEAL_SLOTS[number]
  day: string
  onClick: () => void
}) {
  const [hovered, setHovered] = useState(false)
  if (!meal)
    return (
      <div
        style={{
          height: 64,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <span style={{ color: "#3a3f50", fontSize: 16 }}>—</span>
      </div>
    )

  return (
    <button
      onClick={onClick}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        width: "100%",
        minHeight: 64,
        padding: "10px 12px",
        background: hovered ? slotMeta.bg : "transparent",
        border: `1px solid ${hovered ? slotMeta.color + "50" : "#2a2f3e"}`,
        borderRadius: 8,
        cursor: "pointer",
        textAlign: "left",
        transition: "all 0.15s",
        position: "relative",
      }}
    >
      <div
        style={{
          fontSize: 12,
          color: hovered ? "#f0f0f0" : "#c8cdd8",
          fontWeight: 500,
          lineHeight: 1.3,
          marginBottom: meal.tiktok ? 6 : 0,
        }}
      >
        {meal.name}
      </div>
      {meal.tiktok && (
        <div
          style={{
            display: "inline-flex",
            alignItems: "center",
            gap: 4,
            fontSize: 10,
            color: "#ff2d55",
            fontFamily: "'JetBrains Mono', monospace",
          }}
        >
          <TikTokIcon size={10} />
          TikTok
        </div>
      )}
    </button>
  )
}

// ─── Main Component ─────────────────────────────────────────────────────────────

export default function MealPlanner() {
  const [activePlan, setActivePlan] = useState(PLANS[0].key)
  const [drawer, setDrawer] = useState<{
    meal: Meal
    slotMeta: typeof MEAL_SLOTS[number]
    day: string
  } | null>(null)
  const [today] = useState(
    () =>
      [
        "Sunday",
        "Monday",
        "Tuesday",
        "Wednesday",
        "Thursday",
        "Friday",
        "Saturday",
      ][new Date().getDay()],
  )

  const plan = PLANS.find((p) => p.key === activePlan)!

  return (
    <div
      style={{
        minHeight: "100%",
        background: "#0f1117",
        fontFamily: "'Inter', sans-serif",
        paddingBottom: 64,
      }}
    >
      {/* Header */}
      <div
        style={{
          padding: "32px 24px 24px",
          borderBottom: "1px solid #2a2f3e",
          maxWidth: 1200,
          margin: "0 auto",
        }}
      >
        <div
          style={{
            display: "flex",
            alignItems: "flex-end",
            justifyContent: "space-between",
            flexWrap: "wrap",
            gap: 16,
          }}
        >
          <div>
            <p
              style={{
                fontFamily: "'JetBrains Mono', monospace",
                fontSize: 10,
                color: "#8a8f9e",
                letterSpacing: "0.12em",
                textTransform: "uppercase",
                margin: "0 0 6px",
              }}
            >
              Nutrition Programme
            </p>
            <h1
              style={{
                fontFamily: "'Outfit', sans-serif",
                fontSize: 32,
                fontWeight: 800,
                color: "#f0f0f0",
                margin: 0,
                lineHeight: 1,
              }}
            >
              Weekly Meal Planner
            </h1>
            <p
              style={{
                color: "#8a8f9e",
                fontSize: 13,
                margin: "8px 0 0",
                fontFamily: "'JetBrains Mono', monospace",
              }}
            >
              {plan.weekOf} · 5 meals/day · 7 days
            </p>
          </div>

          {/* Week selector */}
          <div style={{ display: "flex", gap: 8 }}>
            {PLANS.map((p) => (
              <button
                key={p.key}
                onClick={() => setActivePlan(p.key)}
                style={{
                  padding: "8px 18px",
                  borderRadius: 99,
                  fontFamily: "'JetBrains Mono', monospace",
                  fontSize: 12,
                  fontWeight: 600,
                  cursor: "pointer",
                  transition: "all 0.15s",
                  background: activePlan === p.key ? "#c8102e" : "#181c27",
                  color: activePlan === p.key ? "#fff" : "#8a8f9e",
                  border:
                    activePlan === p.key
                      ? "1px solid #c8102e"
                      : "1px solid #2a2f3e",
                }}
              >
                {p.label}
              </button>
            ))}
          </div>
        </div>

        {/* Meal type legend */}
        <div
          style={{ display: "flex", gap: 16, marginTop: 20, flexWrap: "wrap" }}
        >
          {MEAL_SLOTS.map((s) => (
            <div
              key={s.key}
              style={{ display: "flex", alignItems: "center", gap: 6 }}
            >
              <div
                style={{
                  width: 8,
                  height: 8,
                  borderRadius: 2,
                  background: s.color,
                }}
              />
              <span
                style={{
                  fontFamily: "'JetBrains Mono', monospace",
                  fontSize: 10,
                  color: "#8a8f9e",
                  textTransform: "uppercase",
                  letterSpacing: "0.06em",
                }}
              >
                {s.icon} {s.label}
              </span>
            </div>
          ))}
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: 6,
              marginLeft: 8,
            }}
          >
            <TikTokIcon size={10} />
            <span
              style={{
                fontFamily: "'JetBrains Mono', monospace",
                fontSize: 10,
                color: "#ff2d55",
              }}
            >
              = Has TikTok video
            </span>
          </div>
        </div>
      </div>

      {/* Grid */}
      <div
        style={{
          maxWidth: 1200,
          margin: "0 auto",
          padding: "24px 24px 0",
          overflowX: "auto",
        }}
      >
        <div style={{ minWidth: 780 }}>
          {/* Day headers */}
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "120px repeat(7, 1fr)",
              gap: 4,
              marginBottom: 4,
            }}
          >
            <div /> {/* empty corner */}
            {DAYS.map((day, i) => {
              const isToday = day === today
              return (
                <div
                  key={day}
                  style={{
                    padding: "10px 12px",
                    borderRadius: 8,
                    background: isToday ? "rgba(200,16,46,0.12)" : "#181c27",
                    border: isToday
                      ? "1px solid rgba(200,16,46,0.4)"
                      : "1px solid #2a2f3e",
                    textAlign: "center",
                  }}
                >
                  <div
                    style={{
                      fontFamily: "'JetBrains Mono', monospace",
                      fontSize: 11,
                      fontWeight: 600,
                      color: isToday ? "#c8102e" : "#8a8f9e",
                      textTransform: "uppercase",
                      letterSpacing: "0.06em",
                    }}
                  >
                    {DAYS_SHORT[i]}
                  </div>
                  {isToday && (
                    <div
                      style={{
                        fontFamily: "'JetBrains Mono', monospace",
                        fontSize: 8,
                        color: "#c8102e",
                        letterSpacing: "0.08em",
                        textTransform: "uppercase",
                        marginTop: 2,
                      }}
                    >
                      TODAY
                    </div>
                  )}
                </div>
              )
            })}
          </div>

          {/* Meal rows */}
          {MEAL_SLOTS.map((slot) => (
            <div
              key={slot.key}
              style={{
                display: "grid",
                gridTemplateColumns: "120px repeat(7, 1fr)",
                gap: 4,
                marginBottom: 4,
              }}
            >
              {/* Row label */}
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: 8,
                  padding: "0 12px",
                  borderRight: `2px solid ${slot.color}30`,
                }}
              >
                <div
                  style={{
                    width: 6,
                    height: 6,
                    borderRadius: 2,
                    background: slot.color,
                    flexShrink: 0,
                  }}
                />
                <div>
                  <div
                    style={{
                      fontFamily: "'JetBrains Mono', monospace",
                      fontSize: 9,
                      color: slot.color,
                      textTransform: "uppercase",
                      letterSpacing: "0.08em",
                      fontWeight: 600,
                    }}
                  >
                    {slot.icon}
                  </div>
                  <div
                    style={{
                      fontFamily: "'JetBrains Mono', monospace",
                      fontSize: 9,
                      color: "#6a6f7e",
                      textTransform: "uppercase",
                      letterSpacing: "0.06em",
                    }}
                  >
                    {slot.label}
                  </div>
                </div>
              </div>

              {/* Day cells */}
              {DAYS.map((day) => {
                const dayMeals = plan.days[day]
                const meal = dayMeals?.[slot.key]
                return (
                  <MealCell
                    key={day}
                    meal={meal}
                    slotMeta={slot}
                    day={day}
                    onClick={() =>
                      meal && setDrawer({ meal, slotMeta: slot, day })
                    }
                  />
                )
              })}
            </div>
          ))}
        </div>

        {/* Footer hint */}
        <p
          style={{
            fontFamily: "'JetBrains Mono', monospace",
            fontSize: 11,
            color: "#3a3f50",
            textAlign: "center",
            marginTop: 28,
            letterSpacing: "0.04em",
          }}
        >
          Click any meal to view the recipe
        </p>
      </div>

      {/* Recipe drawer */}
      {drawer && (
        <RecipeDrawer
          meal={drawer.meal}
          slotMeta={drawer.slotMeta}
          day={drawer.day}
          onClose={() => setDrawer(null)}
        />
      )}
    </div>
  )
}
