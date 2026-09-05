import { FormEvent, useState } from "react"
import type { Catalog, Meal, CombinationItem } from "../api"
import { useSaveCombinationMutation } from "../store/mealPlanApi"
export default function CombinationForm({ catalog, meal, close, saved }: { catalog: Catalog; meal?: Meal; close: () => void; saved: () => void }) {
  const [name, setName] = useState(meal?.mealName || "")
  const [description, setDescription] = useState(meal?.description || "")
  const [image, setImage] = useState(meal?.image_url || "")
  const [instructions, setInstructions] = useState(meal?.serving_instructions || "")
  const [dishes, setDishes] = useState<CombinationItem[]>(meal?.combination_items || [])
  const [error, setError] = useState("")
  const [save, state] = useSaveCombinationMutation()
  const available = catalog.mealTypes.filter(m => m.meal_kind !== "combination" && !dishes.some(d => d.dish_id === m.mealTypesID))
  const patch = (index: number, value: Partial<CombinationItem>) => setDishes(dishes.map((d, i) => i === index ? { ...d, ...value } : d))
  const move = (index: number, offset: number) => { const next = [...dishes]; [next[index], next[index + offset]] = [next[index + offset], next[index]]; setDishes(next) }
  const submit = async (event: FormEvent) => {
    event.preventDefault(); setError("")
    try { await save({ id: meal?.mealID, body: { meal_name: name, description, image_url: image, serving_instructions: instructions, dishes } }).unwrap(); saved() }
    catch (error) { setError((error as { data?: { message?: string } }).data?.message || "Could not save the combination.") }
  }
  return <div className="modal-backdrop"><form className="modal meal-form" onSubmit={submit}><button type="button" className="close" onClick={close}>×</button><h2>{meal ? "Edit combination" : "Create meal combination"}</h2><p>Combine existing dishes. Each keeps its own recipe.</p>
    <div className="stack-fields"><label><span>Name</span><input required maxLength={255} readOnly={Boolean(meal)} value={name} onChange={e => setName(e.target.value)} placeholder="Ugali with spinach and beef" /></label>{meal && <small>The name stays fixed so existing meal plans keep working.</small>}
    <label><span>Description</span><textarea value={description} onChange={e => setDescription(e.target.value)} /></label>
    <label><span>Photo URL</span><input type="url" value={image} onChange={e => setImage(e.target.value)} /></label>
    <label><span>Add a dish</span><select value="" onChange={e => { if (e.target.value) setDishes([...dishes, { dish_id: e.target.value }]) }}><option value="">Choose an existing dish…</option>{available.map(m => <option value={m.mealTypesID} key={m.mealTypesID}>{m.meal_name}</option>)}</select></label>
    {!catalog.mealTypes.some(m => m.meal_kind !== "combination") && <p>Create individual dishes first, then combine them here.</p>}
    {dishes.map((dish, index) => <fieldset key={dish.dish_id}><legend>{index + 1}. {catalog.mealTypes.find(m => m.mealTypesID === dish.dish_id)?.meal_name}</legend><div className="stack-fields"><label><span>Portions</span><input maxLength={100} value={dish.portions || ""} onChange={e => patch(index, { portions: e.target.value })} placeholder="e.g. 2 servings" /></label><label><span>Serving notes</span><input value={dish.notes || ""} onChange={e => patch(index, { notes: e.target.value })} /></label></div><div className="recording-actions"><button type="button" disabled={index === 0} onClick={() => move(index, -1)}>Move up</button><button type="button" disabled={index === dishes.length - 1} onClick={() => move(index, 1)}>Move down</button><button type="button" className="danger" onClick={() => setDishes(dishes.filter((_, i) => i !== index))}>Remove dish</button></div></fieldset>)}
    <label><span>Instructions for serving together</span><textarea value={instructions} onChange={e => setInstructions(e.target.value)} placeholder="Prepare the stew first; serve the ugali hot alongside the greens." /></label></div>
    {error && <p role="alert" className="form-error">{error}</p>}<div className="modal-actions"><span /><button type="button" className="secondary" onClick={close}>Cancel</button><button className="primary" disabled={state.isLoading || dishes.length < 2}>{state.isLoading ? "Saving…" : "Save combination"}</button></div>
  </form></div>
}
