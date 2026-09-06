import { FormEvent, useState } from "react"
import type { FoodItem } from "../api"
import { useSaveNutritionMutation } from "../store/mealPlanApi"
export function priceSearch(item: FoodItem, location: string) {
  return `https://www.google.com/search?q=${encodeURIComponent(`${item.english_name || item.food_name} price ${location} ${new Date().toISOString().slice(0, 7)}`)}`
}
export default function NutritionForm({ item, close, initialTab = 'nutrition' }: { item: FoodItem; close: () => void; initialTab?: 'nutrition' | 'price' }) {
  const fields = { serving_size_g: 'Nutrition reference weight (g)', energy_kcal: 'Energy (kcal)', protein_g: 'Protein (g)', carbohydrates_g: 'Carbohydrate (g)', fat_g: 'Fat (g)', fiber_g: 'Fibre (g)' }
  const [tab, setTab] = useState(initialTab)
  const [data, setData] = useState<Record<string, string>>(Object.fromEntries(Object.keys(fields).map(key => [key, String((item.nutrition as Record<string, unknown> | undefined)?.[key] ?? '')])))
  const [source, setSource] = useState(item.nutrition?.source || '')
  const [price, setPrice] = useState(String(item.nutrition?.price_per_100g ?? ''))
  const [currency, setCurrency] = useState(item.nutrition?.currency || 'KES')
  const [checked, setChecked] = useState(item.nutrition?.price_checked_at?.slice(0, 10) || '')
  const [priceSource, setPriceSource] = useState(item.nutrition?.price_source || '')
  const [location, setLocation] = useState(item.nutrition?.price_location || item.countries?.[0]?.name || '')
  const [packPrice, setPackPrice] = useState('')
  const [packGrams, setPackGrams] = useState('')
  const [save, state] = useSaveNutritionMutation(); const [error, setError] = useState('')
  const submit = async (e: FormEvent) => {
    e.preventDefault(); setError('')
    const body = tab === 'nutrition'
      ? { ...Object.fromEntries(Object.entries(data).map(([k,v]) => [k, v === '' ? null : Number(v)])), source }
      : { price_per_100g: price === '' ? null : Number(price), currency, price_checked_at: checked || null, price_source: priceSource, price_location: location }
    try { await save({ id: item.food_itemID, body }).unwrap(); close() } catch (e) { setError((e as { data?: { message?: string } }).data?.message || 'Could not save food data') }
  }
  return <div className="modal-backdrop"><form className="modal compact" onSubmit={submit}><h2>{item.food_name}</h2>
    <div className="recording-actions"><button type="button" aria-pressed={tab === 'nutrition'} onClick={() => setTab('nutrition')}>Nutrition</button><button type="button" aria-pressed={tab === 'price'} onClick={() => setTab('price')}>Price</button></div>
    {tab === 'nutrition' ? <><p>Enter nutrients for the reference weight. Leave unknown values blank.</p><div className="stack-fields">{Object.entries(fields).map(([key,label]) => <label key={key}><span>{label}</span><input type="number" min={key === 'serving_size_g' ? '0.01' : '0'} max="999999" step="0.01" value={data[key]} onChange={e => setData({ ...data, [key]: e.target.value })} /></label>)}<label><span>Nutrition source</span><input maxLength={255} value={source} onChange={e => setSource(e.target.value)} /></label></div></> : <>
      <p>Record a local price estimate and when it was checked. Search results are not automatically verified or saved. Prices are shared across plans using this food.</p>
      <div className="stack-fields">
        <label><span>Location / market</span><input required={price !== ''} maxLength={150} placeholder="e.g. Nairobi, local market" value={location} onChange={e => setLocation(e.target.value)} /></label>
        <a href={priceSearch(item, location)} target="_blank" rel="noopener noreferrer">Search the web for current {item.food_name} prices ↗</a>
        <label><span>Price per 100 g</span><input type="number" min="0" max="999999" step="0.01" value={price} onChange={e => setPrice(e.target.value)} /></label>
        <label><span>Currency</span><input required pattern="[A-Z]{3}" maxLength={3} value={currency} onChange={e => setCurrency(e.target.value.toUpperCase())} /></label>
        <label><span>Price checked on</span><input type="date" required={price !== ''} max={new Date().toISOString().slice(0, 10)} value={checked} onChange={e => setChecked(e.target.value)} /></label>
        <label><span>Price source / shop / URL</span><input required={price !== ''} maxLength={255} value={priceSource} onChange={e => setPriceSource(e.target.value)} /></label>
      </div>
      <details><summary>Convert a pack or item price</summary><p>Use the measured food weight, excluding packaging. For eggs or other counted items, enter their total edible weight; counts alone cannot be converted to grams.</p><div className="stack-fields"><label><span>Pack / item price</span><input type="number" min="0" step="0.01" value={packPrice} onChange={e => setPackPrice(e.target.value)} /></label><label><span>Total food weight (g)</span><input type="number" min="0.01" step="0.01" value={packGrams} onChange={e => setPackGrams(e.target.value)} /></label></div><button type="button" disabled={packPrice === '' || Number(packPrice) < 0 || !Number.isFinite(Number(packGrams)) || Number(packGrams) <= 0} onClick={() => setPrice((Number(packPrice) * 100 / Number(packGrams)).toFixed(2))}>Use converted price</button></details>
    </>}
    {error && <p role="alert">{error}</p>}<div className="modal-actions"><button type="button" onClick={close}>Cancel</button><button disabled={state.isLoading}>Save {tab === 'price' ? 'price' : 'nutrition'}</button></div></form></div>
}
