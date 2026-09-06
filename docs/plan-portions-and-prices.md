# Plan portions and food prices

A dish or recipe's **yield** defines how many servings its ingredient batch makes. A scheduled meal's **servings** specifies how much of that dish to eat in that plan on that day. Existing plans default to one serving. Goals such as weight loss or weight gain do not automatically prescribe quantities.

For example, if a dish contains six eggs and yields six servings, Monday breakfast can specify one serving in one plan and six in another. Ingredient weights, nutrition, shopping quantities and estimated costs scale accordingly. Set an accurate batch weight to calculate nutrients and cost; the text “six eggs” alone does not establish a gram weight.

Edit a day in the planner to write portion instructions for each meal. The meal name appears above the instructions in the planner; CSV exports also include the notes. Numeric serving and component inputs are no longer shown. Existing stored serving quantities are preserved; new selections default to one serving. Free-text instructions do not change nutrition, shopping or cost calculations. The API continues to support numeric portions for compatibility.

## Prices

Food prices remain attached to food items via their existing nutrition record. The **Food prices** section supports food search, external web searches by location, and administrator price updates. The food editor also has separate Nutrition and Price tabs. Nutrition-only edits preserve prices and their check dates.

Prices use a consistent basis of 100 g, with a currency, location/market, source/shop/URL and actual check date. A helper converts a known pack price and food weight to that basis. Counted items require a known food weight; the application does not guess an egg's weight. Blank prices mean unknown; zero is a known zero.

Web search opens an external search page. It does not fetch, verify or automatically save prices. Review a local quote and enter its details. Prices without a date, or checked over 30 days ago, are flagged for review. This is a reminder, not a guarantee of price validity. Shopping exports include price provenance. Different currencies remain separate.

The current model stores one latest recorded price per food, not historical or multiple-market quotes. Updating it recalculates all affected plan estimates. Location is visible so users can judge relevance. Plan-level recorded budget estimates remain available for comparison.

## API and migration

`POST /meal/meal-plan/new` and `PUT /meal/meal-plan/update` accept a `portions` object keyed by `breakfast`, `morning_break`, `lunch`, `evening_break`, and `supper`:

```json
{"breakfast":{"servings":6,"instructions":"Six eggs","components":{}}}
```

`components` maps canonical dish IDs within the selected combination to serving counts. Counts must be numeric and between 0.01 and 1000. Send the complete portions map when updating. Older clients that omit it preserve portions for unchanged dishes; replacing a dish resets its portion to one.

Migration `014_plan_portions_and_price_context` adds nullable `mealplan.portions` JSON and three price provenance columns on `food_nutrition`. Existing rows and prices are preserved; old price dates remain unknown. Apply the migration and regenerate Prisma Client before restarting the backend.

Validation: `node --test scripts/meal_totals.test.js scripts/planner_ids.test.js scripts/food_price.test.js scripts/ownership_and_dishes.test.js`, `npm run build --prefix frontend`, and `npm exec -- prisma validate`.
