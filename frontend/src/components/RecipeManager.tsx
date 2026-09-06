import { useState } from "react"
import { useSelector } from "react-redux"
import type { Catalog, Recipe } from "../api"
import type { RootState } from "../store"
import { useDeleteRecipeMutation } from "../store/mealPlanApi"
import RecipeForm from "./RecipeForm"

export default function RecipeManager({ catalog, notify }: { catalog: Catalog; notify: (kind: "success" | "error", message: string) => void }) {
  const user = useSelector((state: RootState) => state.auth.user)
  const [editing, setEditing] = useState<Recipe | null>(null)
  const [remove, removeState] = useDeleteRecipeMutation()
  if (!user || (user.role !== "professional" && user.role !== "admin")) return null
  const recipes = user.role === "admin" ? catalog.recipes : catalog.recipes.filter(recipe => recipe.owner_user_id === user.id)
  const deleteRecipe = async (recipe: Recipe) => {
    if (!recipe.idrecipe || !window.confirm(`Delete “${recipe.title}”?`)) return
    try { await remove(recipe.idrecipe).unwrap(); notify("success", "Recipe deleted.") }
    catch { notify("error", "The recipe could not be deleted.") }
  }
  return <section className="admin-panel" id="recipes"><div className="section-heading"><div><span className="eyebrow">{user.role === "admin" ? "All contributors" : "Your collection"}</span><h2>{user.role === "admin" ? "Recipe management" : "My recipes"}</h2></div></div>{recipes.length ? <div className="users-table"><div className="user-row header"><span>Recipe</span><span>Dish</span><span>Owner</span><span>Actions</span></div>{recipes.map(recipe => <div className="user-row" key={recipe.recipe_ID}><span><strong>{recipe.title}</strong><small>{recipe.description || "No description"}</small></span><span>{catalog.mealTypes.find(type => type.mealTypesID === recipe.meal_typeID)?.meal_name || "Unlinked"}</span><span>{recipe.owner_user_id === user.id ? "You" : `User #${recipe.owner_user_id || "—"}`}</span><span><button className="secondary" onClick={() => setEditing(recipe)}>Edit</button> <button className="danger" disabled={removeState.isLoading} onClick={() => void deleteRecipe(recipe)}>Delete</button></span></div>)}</div> : <div className="empty-state"><span>♨</span><h3>No recipes created yet</h3><p>Use the Recipe button above to add your first one.</p></div>}{editing && <RecipeForm catalog={catalog} recipe={editing} close={() => setEditing(null)} saved={() => { setEditing(null); notify("success", "Recipe updated.") }}/>}</section>
}
