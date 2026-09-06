import NutritionForm from "./NutritionForm";
import TotalsPanel from "./TotalsPanel";
import MealForm from "./MealForm";
import CombinationForm from "./CombinationForm";
import RecipeForm from "./RecipeForm";
import { useSelector } from "react-redux";
import type { RootState } from "../store";
import { useState } from "react";
import { LocalNamesList } from "./FoodLocalNames";
import type { Catalog, FoodItem, Recipe } from "../api";
import { FoodImage, AddCatalogModal } from "./CatalogView";
import { useDeleteDishMutation, useDeleteFoodItemMutation, useDeleteFoodPronunciationMutation, useGetFoodPronunciationQuery } from "../store/mealPlanApi";

const lines = (value?: string) =>
  (value || "")
    .split(/\r?\n|,|;/)
    .map((v) => v.replace(/^\s*[-•\d.)]+\s*/, "").trim())
    .filter(Boolean);

export function MealDrawer({
  name,
  slot,
  mealId,
  catalog,
  close,
  onFood,
}: {
  name: string;
  slot: string;
  mealId?: string;
  catalog: Catalog;
  close: () => void;
  onFood: (food: FoodItem) => void;
}) {
  const user = useSelector((state: RootState) => state.auth.user);
  const [editingDish, setEditingDish] = useState(false);
  const [removeDish, removingDish] = useDeleteDishMutation();
  const [dishError, setDishError] = useState("");
  const [editingCombination, setEditingCombination] = useState(false);
  const [editingRecipe, setEditingRecipe] = useState(false);
  const meal = catalog.mealSlots.find(
    (item) => mealId ? item.mealID === mealId : item.mealName.toLowerCase() === name.toLowerCase(),
  );
  const mealAssignments = catalog.assignments.filter(
    (assignment) => assignment.mealID === meal?.mealID,
  );
  const recipe = catalog.recipes.find(r => r.meal_typeID === (mealId || meal?.mealID));
  const canManageRecipe = user?.role === "admin" || (user?.role === "professional" && (!recipe || recipe.owner_user_id === user.id));
  const assignedTypes = mealAssignments.map(
    (assignment) => assignment.meal_name,
  );
  const ingredients = lines(recipe?.ingredients);
  const mealFoods = (meal?.meal_food_items || [])
    .map((item) => item.fooditems)
    .filter((item): item is FoodItem => Boolean(item));
  const relatedFoods = recipe
    ? recipe.foodItems || []
    : mealFoods.length
      ? mealFoods
      : catalog.foodItems.filter(
          (food) =>
            ingredients.some((ingredient) =>
              ingredient.toLowerCase().includes(food.food_name.toLowerCase()),
            ) || name.toLowerCase().includes(food.food_name.toLowerCase()),
        );
  const canManageDish = user?.role === "admin" || (user?.role === "professional" && meal?.owner_user_id === user.id);
  const deleteDish = async () => {
    if (!meal || !window.confirm(`Delete ${meal.mealName}? Referenced meals cannot be deleted.`)) return;
    try { await removeDish(meal.mealID).unwrap(); close(); } catch (error) { setDishError((error as { data?: { message?: string } }).data?.message || "Could not delete meal"); }
  };
  const dishActions = canManageDish && <div className="recording-actions"><button className="secondary" onClick={() => meal?.meal_kind === "combination" ? setEditingCombination(true) : setEditingDish(true)}>Edit {meal?.meal_kind === "combination" ? "combination" : "dish"}</button><button className="danger" disabled={removingDish.isLoading} onClick={deleteDish}>Delete</button>{dishError && <p role="alert" className="form-error">{dishError}</p>}</div>;
  if (editingDish && meal) return <MealForm catalog={catalog} meal={meal} close={() => setEditingDish(false)} saved={() => setEditingDish(false)} />;
  if (editingCombination && meal) return <CombinationForm catalog={catalog} meal={meal} close={() => setEditingCombination(false)} saved={() => setEditingCombination(false)} />;
  if (meal?.meal_kind === "combination") return <div className="drawer-backdrop" onMouseDown={e => e.target === e.currentTarget && close()}><aside className="detail-drawer"><button className="close" onClick={close}>×</button><div className="drawer-body"><TotalsPanel kind="dish" id={meal.mealID} /><span className="eyebrow">Meal combination</span><h2>{meal.mealName}</h2>{meal.image_url && <img src={meal.image_url} alt={meal.mealName} style={{ width: "100%" }} />}<p>{meal.description}</p>{dishActions}
    {meal.combination_items?.map(component => { const dish = catalog.mealSlots.find(m => m.mealID === component.dish_id); const dishRecipe = catalog.recipes.find(r => r.meal_typeID === component.dish_id); return <details className="drawer-section" key={component.dish_id}><summary><strong>{dish?.mealName || "Dish"}</strong>{component.portions ? ` · ${component.portions}` : ""}</summary><p>{component.notes}</p><p>{dish?.description}</p><h3>Ingredients</h3><ul>{(dishRecipe ? (dishRecipe.ingredients || "").split(/\r?\n/).filter(Boolean) : dish?.meal_food_items?.map(f => [f.quantity, f.unit, f.fooditems?.food_name, f.preparation_notes].filter(Boolean).join(" ")) || []).map((line, index) => <li key={index}>{line}</li>)}</ul>{dishRecipe ? <><h3>{dishRecipe.title} — Method</h3><ol>{(dishRecipe.instructions || "").split(/\r?\n/).filter(Boolean).map((step, index) => <li key={index}>{step}</li>)}</ol></> : <p>No recipe yet for this dish.</p>}{(dishRecipe?.video_url || dish?.video_url) && <a href={dishRecipe?.video_url || dish?.video_url} target="_blank" rel="noreferrer">Watch preparation →</a>}{dish?.meal_preparation_sources?.map(source => <p key={source.id}><a href={source.source_url} target="_blank" rel="noreferrer">{source.title || source.source_type}</a></p>)}</details> })}
    {meal.serving_instructions && <section className="drawer-section"><h3>Serve together</h3><p style={{ whiteSpace: "pre-line" }}>{meal.serving_instructions}</p></section>}
    </div></aside></div>;
  if (editingRecipe && meal) return <RecipeForm catalog={catalog} mealId={meal.mealID} recipe={recipe} close={() => setEditingRecipe(false)} saved={() => setEditingRecipe(false)} />;
  return (
    <div
      className="drawer-backdrop"
      onMouseDown={(e) => e.target === e.currentTarget && close()}
    >
      <aside className="detail-drawer">
        <button className="close" onClick={close}>
          ×
        </button>
        <div className="dish-cover">
          {(meal?.image_url || meal?.meal_images?.[0]?.image_url) && (
            <img
              src={meal.image_url || meal.meal_images?.[0]?.image_url}
              alt=""
            />
          )}
          <span>{mealId ? slot : `Today’s ${slot}`}</span>
          <strong>{name.slice(0, 1)}</strong>
        </div>
        <div className="drawer-body">
          <span className="eyebrow">{recipe?.cuisine || "Home cooking"}</span>
          <h2>{meal?.mealName || name}</h2>
          {dishActions}
          {meal && canManageRecipe && <button className="secondary" onClick={() => setEditingRecipe(true)}>{recipe ? "Edit / delete recipe" : "Create recipe from this meal"}</button>}
          {!recipe && <p className="muted">No recipe yet. The ingredients and preparation sources below were saved with the meal.</p>}
          {meal?.local_name && (
            <p className="local-name">Also known as {meal.local_name}</p>
          )}
          <p className="lead">
            {recipe?.description ||
              meal?.description ||
              "Add a recipe for this meal to include ingredients and cooking instructions here."}
          </p>
          {(recipe?.video_url || meal?.video_url) && (
            <a
              className="video-link"
              href={recipe?.video_url || meal?.video_url}
              target="_blank"
              rel="noreferrer"
            >
              ▶ Watch how it’s prepared
            </a>
          )}
          {assignedTypes.length > 0 && (
            <div className="tag-row">
              {assignedTypes.map((type) => (
                <span key={type}>{type}</span>
              ))}
            </div>
          )}
          {recipe && (
            <section className="drawer-section">
              <span className="eyebrow">Recipe</span>
              <h3>{recipe.title}</h3>
              {meal?.description && recipe.description && (
                <p className="muted">{recipe.description}</p>
              )}
            </section>
          )}
          <RecipeMeta recipe={recipe} />
          {meal && <TotalsPanel kind="dish" id={meal.mealID} />}
          {(recipe ? ingredients.length > 0 : Boolean(meal?.meal_food_items?.length)) && (
            <section className="drawer-section">
              <h3>Ingredients</h3>
              <ul className="ingredient-list">
                {!recipe && meal?.meal_food_items?.length
                  ? meal.meal_food_items.map((item) => (
                      <li key={item.food_item_id}>
                        <i />
                        {item.fooditems?.food_name || "Ingredient"}
                        {item.quantity
                          ? ` · ${item.quantity}${item.unit ? ` ${item.unit}` : ""}`
                          : item.grams ? ` · ${item.grams} g` : ""}
                        {item.preparation_notes
                          ? ` — ${item.preparation_notes}`
                          : ""}
                      </li>
                    ))
                  : ingredients.map((item, i) => (
                      <li key={i}>
                        <i />
                        {item}
                      </li>
                    ))}
              </ul>
            </section>
          )}
          {meal?.pronunciation_url && <section className="drawer-section"><h3>Meal pronunciation</h3><audio controls preload="none" src={meal.pronunciation_url} /></section>}
          {Boolean(meal?.meal_images?.length) && <section className="drawer-section"><h3>Meal photos</h3><div className="mini-grid">{meal?.meal_images?.map(image => <img key={image.id} src={image.image_url} alt={name} style={{ width: "100%", borderRadius: 8 }} />)}</div></section>}
          {meal?.meal_preparation_sources &&
            meal.meal_preparation_sources.length > 0 && (
              <section className="drawer-section">
                <h3>Preparation guides</h3>
                <div className="recipe-links">
                  {meal.meal_preparation_sources.map((source) => (
                    <a
                      key={source.id}
                      href={source.source_url}
                      target="_blank"
                      rel="noreferrer"
                    >
                      <span>↗</span>
                      <div>
                        <strong>{source.title || source.source_type}</strong>
                        <small>{source.source_type}</small>
                      </div>
                    </a>
                  ))}
                </div>
              </section>
            )}
          {relatedFoods.length > 0 && (
            <section className="drawer-section">
              <h3>From your food library</h3>
              <div className="related-foods">
                {relatedFoods.map((food) => (
                  <button key={food.food_itemID} onClick={() => onFood(food)}>
                    <span>{food.food_name.slice(0, 1)}</span>
                    <div>
                      <strong>{food.food_name}</strong>
                      <small>View details →</small>
                    </div>
                  </button>
                ))}
              </div>
            </section>
          )}
          {lines(recipe?.instructions).length > 0 && (
            <section className="drawer-section">
              <h3>Method</h3>
              <ol className="method-list">
                {lines(recipe?.instructions).map((step, i) => (
                  <li key={i}>
                    <span>{i + 1}</span>
                    <p>{step}</p>
                  </li>
                ))}
              </ol>
            </section>
          )}
        </div>
      </aside>
    </div>
  );
}

function RecipeMeta({ recipe }: { recipe?: Recipe }) {
  if (!recipe) return null;
  const items = [
    { l: "Prep", v: recipe.prep_time && `${recipe.prep_time} min` },
    { l: "Cook", v: recipe.cook_time && `${recipe.cook_time} min` },
    { l: "Serves", v: recipe.servings },
    { l: "Level", v: recipe.difficulty },
  ].filter((i) => i.v);
  return items.length ? (
    <div className="recipe-meta">
      {items.map((item) => (
        <div key={item.l}>
          <span>{item.l}</span>
          <strong>{item.v}</strong>
        </div>
      ))}
    </div>
  ) : null;
}

export function FoodDrawer({
  item,
  catalog,
  close,
  canManage = false,
}: {
  item: FoodItem;
  catalog: Catalog;
  close: () => void;
  canManage?: boolean;
}) {
  const [nutritionEditing, setNutritionEditing] = useState(false);
  const [editing, setEditing] = useState(false);
  const [confirmDelete, setConfirmDelete] = useState(false);
  const [error, setError] = useState("");
  const [remove, deleteState] = useDeleteFoodItemMutation();
  const deleteItem = async () => {
    setError("");
    try { await remove(item.food_itemID).unwrap(); close(); }
    catch (error) { setError((error as { data?: { message?: string } }).data?.message || "Could not delete the food item."); setConfirmDelete(false); }
  };
  item = catalog.foodItems.find(food => food.food_itemID === item.food_itemID) || item;
  if (nutritionEditing) return <NutritionForm item={item} close={() => setNutritionEditing(false)} />;
  if (editing) return <AddCatalogModal kind="food" item={item} catalog={catalog} close={() => setEditing(false)} saved={close} fail={setError} />;
  const category = catalog.categories.find(
    (c) => c.food_categoryID === item.category_id,
  );
  const subcategory = catalog.subcategories.find(
    (s) => s.foodsubcategory_id === item.foodsubcategory_id,
  );
  const usedIn = catalog.recipes.filter((recipe) =>
    (recipe.ingredients || "")
      .toLowerCase()
      .includes(item.food_name.toLowerCase()),
  );
  return (
    <div
      className="drawer-backdrop"
      onMouseDown={(e) => e.target === e.currentTarget && close()}
    >
      <aside className="detail-drawer food-detail">
        <button className="close" onClick={close}>
          ×
        </button>
        <FoodImage item={item} />
        <div className="drawer-body">
          <button className="back-link" onClick={close}>
            ← Back
          </button>
          <span className="eyebrow">
            {category?.category_name || "Food item"}
            {subcategory ? ` · ${subcategory.subcategory_name}` : ""}
          </span>
          <h2>{item.english_name || item.food_name}</h2>
          {canManage && <div className="recording-actions">
            <button type="button" className="secondary" onClick={() => { setError(""); setEditing(true); }}>Edit food item</button>
            <button className="secondary" onClick={() => setNutritionEditing(true)}>Nutrition / price</button>
            <button type="button" className="danger" disabled={deleteState.isLoading} onClick={() => setConfirmDelete(true)}>Delete food item</button>
          </div>}
          {confirmDelete && <div role="alert">
            <p>Delete {item.food_name}? This cannot be undone. Food items used in meals or recipes cannot be deleted.</p>
            <button type="button" disabled={deleteState.isLoading} onClick={deleteItem}>{deleteState.isLoading ? "Deleting…" : "Confirm delete"}</button>
            <button type="button" disabled={deleteState.isLoading} onClick={() => setConfirmDelete(false)}>Cancel</button>
          </div>}
          {error && <p role="alert" className="form-error">{error}</p>}
          <LocalNamesList item={item} playback canManage={canManage} />
          <p className="lead">
            {item.descriptionl ||
              "No description has been added for this ingredient yet."}
          </p>
          <PronunciationRecorder item={item} canManage={canManage} />
          <div className="fact-card">
            <div>
              <span>Category</span>
              <strong>{category?.category_name || "Not assigned"}</strong>
            </div>
            <div>
              <span>Subcategory</span>
              <strong>{subcategory?.subcategory_name || "Not assigned"}</strong>
            </div>
          </div>
          {item.nutrition && (
            <section className="drawer-section">
              <h3>Nutrition per {item.nutrition.serving_size_g || 100}g</h3>
              <div className="nutrition-grid">
                <div>
                  <strong>{item.nutrition.energy_kcal ?? "—"}</strong>
                  <span>kcal</span>
                </div>
                <div>
                  <strong>{item.nutrition.protein_g ?? "—"}g</strong>
                  <span>protein</span>
                </div>
                <div>
                  <strong>{item.nutrition.carbohydrates_g ?? "—"}g</strong>
                  <span>carbs</span>
                </div>
                <div>
                  <strong>{item.nutrition.fiber_g ?? "—"}g</strong>
                  <span>fiber</span>
                </div>
              </div>
            </section>
          )}
          <section className="drawer-section"><h3>Recorded food price</h3><p>{item.nutrition?.price_per_100g == null ? 'No price recorded' : `${item.nutrition.currency} ${Number(item.nutrition.price_per_100g).toFixed(2)} per 100 g`}</p><p>{item.nutrition?.price_location || 'Location unknown'} · Checked {item.nutrition?.price_checked_at?.slice(0, 10) || 'date unknown'}</p><p>Source: {item.nutrition?.price_source || 'Not recorded'}</p></section>
          <section className="drawer-section">
            <h3>Countries</h3>
            <div className="tag-row">
              {item.countries?.length ? (
                item.countries.map((country) => (
                  <span key={country.id}>{country.name}</span>
                ))
              ) : (
                <span>Not linked yet</span>
              )}
            </div>
          </section>
          <section className="drawer-section">
            <h3>Appears in recipes</h3>
            {usedIn.length ? (
              <div className="recipe-links">
                {usedIn.map((recipe) => (
                  <div key={recipe.recipe_ID}>
                    <span>♨</span>
                    <div>
                      <strong>{recipe.title}</strong>
                      <small>{recipe.cuisine || "Recipe"}</small>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p className="muted">
                This ingredient hasn’t been referenced by a recipe yet.
              </p>
            )}
          </section>
        </div>
      </aside>
    </div>
  );
}

function PronunciationRecorder({ item, canManage }: { item: FoodItem; canManage: boolean }) {
  const [remove, deleteState] = useDeleteFoodPronunciationMutation();
  const pronunciation = useGetFoodPronunciationQuery(item.food_itemID, { refetchOnMountOrArgChange: true });
  const audioUrl = pronunciation.data?.pronunciation_url || item.pronunciation_url;
  return <section className="drawer-section pronunciation"><h3>Local pronunciation</h3>{pronunciation.isLoading ? <p className="muted">Loading pronunciation…</p> : audioUrl ? <audio controls src={audioUrl} /> : <p className="muted">No pronunciation has been recorded.</p>}{pronunciation.isError && <p className="form-error">The pronunciation could not be loaded.</p>}{canManage && audioUrl && <div className="recording-actions"><button type="button" className="danger" disabled={deleteState.isLoading} onClick={() => remove(item.food_itemID)}>{deleteState.isLoading ? "Deleting…" : "Delete recording"}</button></div>}</section>;
}
