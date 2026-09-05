import { FormEvent, useState } from "react"
import { useSelector } from "react-redux"
import type { Catalog, Recipe } from "../api"
import type { RootState } from "../store"
import { useCreateRecipeMutation, useUpdateRecipeMutation, useDeleteRecipeMutation } from "../store/mealPlanApi"

export default function RecipeForm({ catalog, recipe, mealId, close, saved }: { catalog: Catalog; recipe?: Recipe; mealId?: string; close: () => void; saved: () => void }) {
  const [selected, setSelected] = useState(recipe?.meal_typeID || mealId || catalog.mealTypes.find(m => m.meal_kind !== "combination")?.mealTypesID || "")
  const existing = recipe || catalog.recipes.find(r => r.meal_typeID === selected)
  return <div className="modal-backdrop"><div className="modal recipe-form"><button type="button" className="close" onClick={close}>×</button>
    <h2>{existing ? "Manage recipe" : "Create meal recipe"}</h2>
    <p className="modal-copy">Each meal has one recipe. Start with its ingredients, then add the cooking method.</p>
    <label><span>Meal</span><select disabled={Boolean(recipe || mealId)} value={selected} onChange={e => setSelected(e.target.value)}>{catalog.mealTypes.filter(m => m.meal_kind !== "combination").map(m => <option key={m.mealTypesID} value={m.mealTypesID}>{m.meal_name}{catalog.recipes.some(r => r.meal_typeID === m.mealTypesID) ? " · Recipe exists" : " · Needs recipe"}</option>)}</select></label>
    {selected ? <RecipeEditor key={`${selected}-${existing?.recipe_ID || "new"}`} catalog={catalog} mealId={selected} recipe={existing} close={close} saved={saved} /> : <p>Create a meal before adding its recipe.</p>}
  </div></div>
}

function RecipeEditor({ catalog, recipe, mealId, close, saved }: { catalog: Catalog; recipe?: Recipe; mealId: string; close: () => void; saved: () => void }) {
  const meal = catalog.mealSlots.find(m => m.mealID === mealId)
  const user = useSelector((state: RootState) => state.auth.user)
  const canEdit = user?.role === "admin" || (user?.role === "professional" && (!recipe || recipe.owner_user_id === user.id))
  const [title, setTitle] = useState(recipe?.title ?? meal?.mealName ?? "")
  const [description, setDescription] = useState(recipe?.description ?? meal?.description ?? "")
  const [ingredients, setIngredients] = useState(recipe?.ingredients ?? meal?.meal_food_items?.map(item => [item.quantity, item.unit, item.fooditems?.food_name, item.preparation_notes ? `(${item.preparation_notes})` : ""].filter(Boolean).join(" ")).join("\n") ?? "")
  const [instructions, setInstructions] = useState(recipe?.instructions ?? "")
  const [video, setVideo] = useState(recipe?.video_url ?? meal?.video_url ?? "")
  const [foods, setFoods] = useState<string[]>(recipe ? recipe.foodItems?.map(f => f.food_itemID) || [] : meal?.meal_food_items?.map(f => f.food_item_id) || [])
  const [error, setError] = useState("")
  const [create, creating] = useCreateRecipeMutation(); const [update, updating] = useUpdateRecipeMutation(); const [remove, removing] = useDeleteRecipeMutation()
  const busy = creating.isLoading || updating.isLoading || removing.isLoading
  const fail = (error: unknown) => setError((error as { data?: { message?: string } }).data?.message || "Could not save the recipe.")
  const submit = async (e: FormEvent) => {
    e.preventDefault(); setError("")
    const body = { title: title.trim(), description, meal_typeID: mealId, ingredients, instructions, video_url: video || null, foodItems: foods.map(id => ({ id })) }
    try { if (recipe?.idrecipe) await update({ id: recipe.idrecipe, body }).unwrap(); else await create(body).unwrap(); saved() } catch (error) { fail(error) }
  }
  const deleteRecipe = async () => {
    if (!recipe?.idrecipe || !window.confirm(`Delete the recipe for ${meal?.mealName || title}? The meal and its original ingredients will remain.`)) return
    try { await remove(recipe.idrecipe).unwrap(); saved() } catch (error) { fail(error) }
  }
  return <form onSubmit={submit}>
    {recipe && <p className="field-help">This meal already has a recipe. {canEdit ? "Edit it below or delete it." : "Only its author or an administrator can edit or delete it."}</p>}
    <fieldset disabled={!canEdit || busy} className="stack-fields">
      <label><span>Recipe title</span><input required maxLength={255} value={title} onChange={e => setTitle(e.target.value)} /></label>
      <label><span>Description</span><textarea value={description} onChange={e => setDescription(e.target.value)} /></label>
      <label><span>Ingredients, one per line</span><textarea required value={ingredients} onChange={e => setIngredients(e.target.value)} /></label>
      <label><span>Cooking method, one step per line</span><textarea required value={instructions} onChange={e => setInstructions(e.target.value)} /></label>
      <label><span>Preparation video URL</span><input type="url" value={video} onChange={e => setVideo(e.target.value)} /></label>
      <fieldset><legend>Linked food items</legend>{catalog.foodItems.map(food => <label className="check" key={food.food_itemID}><input type="checkbox" checked={foods.includes(food.food_itemID)} onChange={e => setFoods(e.target.checked ? [...foods, food.food_itemID] : foods.filter(id => id !== food.food_itemID))} />{food.food_name}</label>)}</fieldset>
    </fieldset>
    {error && <p role="alert" className="form-error">{error}</p>}
    <div className="modal-actions">{recipe && canEdit && <button type="button" className="danger" disabled={busy} onClick={deleteRecipe}>Delete recipe</button>}<span /><button type="button" className="secondary" onClick={close}>Close</button>{canEdit && <button className="primary" disabled={busy}>{busy ? "Saving…" : recipe ? "Save changes" : "Create recipe"}</button>}</div>
  </form>
}
