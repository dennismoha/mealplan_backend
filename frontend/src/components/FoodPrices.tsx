import { useState } from 'react'
import type { Catalog, FoodItem } from '../api'
import NutritionForm, { priceSearch } from './NutritionForm'
export default function FoodPrices({ catalog, canManage }: { catalog: Catalog; canManage: boolean }) {
  const [search, setSearch] = useState('')
  const [location, setLocation] = useState('')
  const [editing, setEditing] = useState<FoodItem | null>(null)
  const foods = catalog.foodItems.filter(food => `${food.food_name} ${food.english_name || ''}`.toLowerCase().includes(search.toLowerCase()))
  return <section className="drawer-section food-prices" id="food-prices"><h2>Food prices</h2><p>Recorded estimates per 100 g, reused in meal-plan costs. Compare the location and currency before budgeting. Prices without a check date or checked over 30 days ago need review.</p>
    <div className="stack-fields"><label><span>Find a food</span><input type="search" value={search} onChange={e => setSearch(e.target.value)} /></label><label><span>Location for web searches</span><input placeholder="e.g. Nairobi, Kenya" value={location} onChange={e => setLocation(e.target.value)} /></label></div>
    <div className="table-scroll"><table><thead><tr><th>Food</th><th>Price / 100 g</th><th>Location</th><th>Checked</th><th>Source</th><th>Actions</th></tr></thead><tbody>{foods.map(food => {
      const n = food.nutrition
      const date = n?.price_checked_at?.slice(0, 10)
      const review = !date || Date.now() - new Date(date).getTime() > 30 * 86400000
      return <tr key={food.food_itemID}><td>{food.food_name}</td><td>{n?.price_per_100g == null ? 'Not priced' : `${n.currency} ${Number(n.price_per_100g).toFixed(2)}`}</td><td>{n?.price_location || 'Not recorded'}</td><td>{date || 'Unknown'}{review && ' · Review needed'}</td><td>{n?.price_source || 'Not recorded'}</td><td><a href={priceSearch(food, location || n?.price_location || food.countries?.[0]?.name || '')} target="_blank" rel="noopener noreferrer">Look up price ↗</a>{canManage && <button type="button" onClick={() => setEditing(food)}>Update price</button>}</td></tr>
    })}</tbody></table>{!foods.length && <p>No matching food items.</p>}</div>
    {editing && <NutritionForm item={editing} initialTab="price" close={() => setEditing(null)} />}
  </section>
}
