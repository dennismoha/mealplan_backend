import type { Catalog, FoodItem, Recipe } from "../api";
import { FoodImage } from "./CatalogView";

const lines = (value?: string) =>
  (value || "")
    .split(/\r?\n|,|;/)
    .map((v) => v.replace(/^\s*[-•\d.)]+\s*/, "").trim())
    .filter(Boolean);

export function MealDrawer({
  name,
  slot,
  catalog,
  close,
  onFood,
}: {
  name: string;
  slot: string;
  catalog: Catalog;
  close: () => void;
  onFood: (food: FoodItem) => void;
}) {
  const meal = catalog.mealSlots.find(
    (item) => item.mealName.toLowerCase() === name.toLowerCase(),
  );
  const mealAssignments = catalog.assignments.filter(
    (assignment) => assignment.mealID === meal?.mealID,
  );
  const assignedTypeIds = new Set(
    mealAssignments.map((assignment) => assignment.mealTypesID),
  );
  const recipe = catalog.recipes.find(
    (r) =>
      (r.meal_typeID && assignedTypeIds.has(r.meal_typeID)) ||
      r.title.toLowerCase() === name.toLowerCase(),
  );
  const assignedTypes = mealAssignments.map(
    (assignment) => assignment.meal_name,
  );
  const ingredients = lines(recipe?.ingredients);
  const mealFoods = (meal?.meal_food_items || [])
    .map((item) => item.fooditems)
    .filter((item): item is FoodItem => Boolean(item));
  const relatedFoods = mealFoods.length
    ? mealFoods
    : recipe?.foodItems?.length
      ? recipe.foodItems
      : catalog.foodItems.filter(
          (food) =>
            ingredients.some((ingredient) =>
              ingredient.toLowerCase().includes(food.food_name.toLowerCase()),
            ) || name.toLowerCase().includes(food.food_name.toLowerCase()),
        );
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
          <span>Today’s {slot}</span>
          <strong>{name.slice(0, 1)}</strong>
        </div>
        <div className="drawer-body">
          <span className="eyebrow">{recipe?.cuisine || "Home cooking"}</span>
          <h2>{name}</h2>
          {meal?.local_name && (
            <p className="local-name">Also known as {meal.local_name}</p>
          )}
          <p className="lead">
            {meal?.description ||
              recipe?.description ||
              "This meal is on your plan. Add a matching recipe to the database to include ingredients and instructions here."}
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
          {(meal?.meal_food_items?.length || ingredients.length > 0) && (
            <section className="drawer-section">
              <h3>Ingredients</h3>
              <ul className="ingredient-list">
                {meal?.meal_food_items?.length
                  ? meal.meal_food_items.map((item) => (
                      <li key={item.food_item_id}>
                        <i />
                        {item.fooditems?.food_name || "Ingredient"}
                        {item.quantity
                          ? ` · ${item.quantity}${item.unit ? ` ${item.unit}` : ""}`
                          : ""}
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
}: {
  item: FoodItem;
  catalog: Catalog;
  close: () => void;
}) {
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
          <h2>{item.food_name}</h2>
          <p className="lead">
            {item.descriptionl ||
              "No description has been added for this ingredient yet."}
          </p>
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
                  <strong>{item.nutrition.energy_kcal || "—"}</strong>
                  <span>kcal</span>
                </div>
                <div>
                  <strong>{item.nutrition.protein_g || "—"}g</strong>
                  <span>protein</span>
                </div>
                <div>
                  <strong>{item.nutrition.carbohydrates_g || "—"}g</strong>
                  <span>carbs</span>
                </div>
                <div>
                  <strong>{item.nutrition.fiber_g || "—"}g</strong>
                  <span>fiber</span>
                </div>
              </div>
            </section>
          )}
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
