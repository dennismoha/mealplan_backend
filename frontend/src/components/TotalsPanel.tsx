import { useState } from "react"
import { useSelector } from "react-redux"
import type { RootState } from "../store"
import type { FoodItem, Meal, Recipe } from "../api"
import NutritionForm from "./NutritionForm"
import MealForm from "./MealForm"
import RecipeForm from "./RecipeForm"
import { useGetCatalogQuery } from "../store/mealPlanApi"
import { useGetTotalsQuery } from "../store/mealPlanApi"
type Summary = { price_warnings?: string[]; missing_weights?: { dish_id: string; dish_name: string; food_item_id: string; food_name: string; recipe_id: string | null }[]; nutrients: Record<string, number>; missing_nutrition: Record<string, string[]>; costs: Record<string, number>; missing_prices: string[]; shopping: { food_item_id: string; name: string; grams: number; missing_quantity: boolean; estimated_cost: number | null; currency: string | null; price_checked_at?: string; price_location?: string; price_source?: string }[]; warnings: string[]; complete: boolean }
export default function TotalsPanel({ kind, id, estimate, currency }: { kind: "dish" | "plan"; id: string; estimate?: number; currency?: string }) {
  const query = useGetTotalsQuery({ kind, id })
  const catalogQuery = useGetCatalogQuery()
  const catalog = catalogQuery.data
  const user = useSelector((state: RootState) => state.auth.user)
  const [nutritionFood, setNutritionFood] = useState<FoodItem | null>(null)
  const [weightEditor, setWeightEditor] = useState<{ meal: Meal; recipe?: Recipe } | null>(null)
  const closeEditor = () => { setNutritionFood(null); setWeightEditor(null) }
  const labels: Record<string, string> = { energy_kcal: "Energy (kcal)", protein_g: "Protein (g)", carbohydrates_g: "Carbohydrates (g)", fat_g: "Fat (g)", fiber_g: "Fibre (g)" }

  if (query.isLoading) return <p>Calculating totals…</p>
  if (query.isError) return <p role="alert">Totals could not be loaded. <button onClick={() => query.refetch()}>Retry</button></p>
  const summary: Summary | undefined = kind === 'plan' ? query.data?.total : query.data
  if (!summary) return null
  const download = () => {
    const quote = (value: unknown) => `"${String(value ?? '').replace(/^[=+@\-\t\r]/, "'$&").replace(/"/g, '""')}"`
    const csv = [['Ingredient','Known grams','Missing quantity','Estimated cost','Currency','Price checked on','Price location','Price source'], ...summary.shopping.map(row => [row.name, row.grams, row.missing_quantity ? 'Yes' : 'No', row.estimated_cost, row.currency, row.price_checked_at?.slice(0, 10), row.price_location, row.price_source])].map(row => row.map(quote).join(',')).join('\r\n')
    const url = URL.createObjectURL(new Blob([csv], { type: 'text/csv' })); const a = document.createElement('a'); a.href = url; a.download = 'shopping-list.csv'; a.click(); URL.revokeObjectURL(url)
  }
  return <section className="drawer-section"><h3>{kind === 'plan' ? 'Weekly nutrition, shopping and cost' : 'Nutrition and cost per serving'}</h3><p>{kind === 'plan' ? query.data?.basis : 'Ingredient weights divided by the dish’s serving yield. Combination components use their specified serving multipliers.'}</p>{!summary.complete && <p className="form-error">Partial estimate: some quantities, nutrition values, or prices are missing. Known amounts are shown below.</p>}
    <div className="fact-card">{Object.entries(summary.nutrients).map(([name,value]) => <div key={name}><span>{labels[name] || name}</span><strong>{value}{summary.missing_nutrition[name]?.length ? ' (partial)' : ''}</strong></div>)}</div>
    {Object.entries(summary.costs).map(([currency,value]) => <p key={currency}>Known cost: {currency} {value.toFixed(2)}{summary.missing_prices.length ? ' (partial)' : ''}</p>)}
    {!!summary.price_warnings?.length && <details><summary>Prices to review ({summary.price_warnings.length})</summary><ul>{summary.price_warnings.map(w => <li key={w}>{w}</li>)}</ul><a href="#food-prices">Review food prices</a></details>}
    {kind === 'plan' && estimate != null && currency && <p>Plan’s recorded estimate: {currency} {Number(estimate).toFixed(2)}. {summary.costs[currency] != null && `Calculated ${summary.missing_prices.length ? 'known ' : ''}cost differs by ${currency} ${(summary.costs[currency] - Number(estimate)).toFixed(2)}.`} Other currencies are shown separately.</p>}
    {kind === 'plan' && <details><summary>Daily totals</summary>{Object.entries(query.data.days as Record<string, Summary>).map(([day,total]) => <p key={day}>{day}: {total.nutrients.energy_kcal} kcal, {total.nutrients.protein_g} g protein{total.complete ? '' : ' · partial estimate'}; {Object.entries(total.costs).map(([c,v]) => `${c} ${v.toFixed(2)}`).join(', ')}</p>)}</details>}
    <details><summary>Shopping list ({summary.shopping.length} ingredients)</summary><p>Weights include the scheduled servings across all selected dishes. Costs use the food’s latest recorded price, not a live quote. Unknown quantities need checking.</p><table><thead><tr><th>Ingredient</th><th>Known weight</th><th>Cost</th><th>Price context</th></tr></thead><tbody>{summary.shopping.map(row => <tr key={row.food_item_id}><td>{row.name}</td><td>{row.grams} g{row.missing_quantity ? ' + unspecified amount' : ''}</td><td>{row.estimated_cost === null ? 'Not priced' : `${row.currency} ${row.estimated_cost.toFixed(2)}`}</td><td>{row.price_location || 'Location unknown'} · {row.price_checked_at?.slice(0, 10) || 'Date unknown'} · {row.price_source || 'Source unknown'}</td></tr>)}</tbody></table><button onClick={download}>Download shopping list</button></details>
    {!summary.complete && <section className="missing-data-entry">
      <h3>Complete the missing information</h3>
      <p>Ingredient weights belong to the dish or its recipe. Nutrition and price belong to each food item and can be reused across meals.</p>
      {summary.missing_weights?.map(gap => {
        const meal = catalog?.mealSlots.find(m => m.mealID === gap.dish_id)
        const recipe = gap.recipe_id ? catalog?.recipes.find(r => r.recipe_ID === gap.recipe_id) : undefined
        const owner = gap.recipe_id ? recipe?.owner_user_id : meal?.owner_user_id
        const allowed = user?.role === "admin" || (user?.role === "professional" && owner === user.id)
        return <div className="fact-card" key={`${gap.dish_id}-${gap.food_item_id}`}><div><strong>{gap.dish_name} / {gap.food_name}</strong><p>Enter the ingredient weight in grams for the whole batch, and check the serving yield.</p>{allowed && meal ? <button type="button" className="secondary" onClick={() => setWeightEditor({ meal, recipe })}>Add weight in {gap.recipe_id ? "recipe" : "dish"}</button> : <small>The {gap.recipe_id ? "recipe" : "dish"} author or an administrator can enter this weight.</small>}</div></div>
      })}
      {summary.shopping.filter(row => summary.missing_prices.includes(row.name) || Object.values(summary.missing_nutrition).some(names => names.includes(row.name))).map(row => {
        const food = catalog?.foodItems.find(f => f.food_itemID === row.food_item_id)
        const n = food?.nutrition
        const missingFields = Object.keys(labels).filter(key => n?.[key as keyof typeof n] == null)
        const missingReference = !n?.serving_size_g
        const missingPrice = n?.price_per_100g == null
        if (!missingFields.length && !missingReference && !missingPrice) return null
        return <div className="fact-card" key={row.food_item_id}><div><strong>{row.name}</strong><p>{[missingReference ? "Nutrition reference weight" : "", ...missingFields.map(key => labels[key]), missingPrice ? "Price per 100 g" : ""].filter(Boolean).join(", ")}</p>{user?.role === "admin" && food ? <button type="button" className="secondary" onClick={() => setNutritionFood(food)}>Add nutrition / price</button> : <small>An administrator can enter nutrition and prices for this food.</small>}</div></div>
      })}
      {catalogQuery.isError && <p role="alert">Could not load the editing controls. <button onClick={() => catalogQuery.refetch()}>Retry</button></p>}
      <details><summary>All missing information</summary><ul>{summary.warnings.map(w => <li key={w}>{w}</li>)}{summary.missing_prices.map(n => <li key={`price-${n}`}>{n}: price or quantity missing</li>)}{Object.entries(summary.missing_nutrition).filter(([,names]) => names.length).map(([key,names]) => <li key={key}>{labels[key] || key}: {names.join(', ')}</li>)}</ul></details>
    </section>}
    <div className="totals-editor">{nutritionFood && <NutritionForm item={nutritionFood} close={closeEditor} />}{weightEditor && catalog && (weightEditor.recipe ? <RecipeForm catalog={catalog} recipe={weightEditor.recipe} close={closeEditor} saved={closeEditor} /> : <MealForm catalog={catalog} meal={weightEditor.meal} close={closeEditor} saved={closeEditor} />)}</div>
  </section>
}
