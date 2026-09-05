import { FormEvent, useState } from "react";
import type { Catalog } from "../api";
import { useCreateMealMutation } from "../store/mealPlanApi";

type IngredientDraft = {
  selected: boolean;
  quantity: string;
  unit: string;
  notes: string;
};
type SourceDraft = { source_type: string; source_url: string; title: string };

export default function MealForm({
  catalog,
  close,
  saved,
}: {
  catalog: Catalog;
  close: () => void;
  saved: (name: string) => void;
}) {
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [localName, setLocalName] = useState("");
  const [primaryImage, setPrimaryImage] = useState("");
  const [imageUrls, setImageUrls] = useState("");
  const [videoUrl, setVideoUrl] = useState("");
  const [pronunciationUrl, setPronunciationUrl] = useState("");
  const [countryId, setCountryId] = useState("");
  const [ingredients, setIngredients] = useState<
    Record<string, IngredientDraft>
  >({});
  const [sources, setSources] = useState<SourceDraft[]>([
    { source_type: "youtube", source_url: "", title: "" },
  ]);
  const [error, setError] = useState("");
  const [createMeal, { isLoading }] = useCreateMealMutation();

  const updateIngredient = (id: string, patch: Partial<IngredientDraft>) =>
    setIngredients((current) => ({
      ...current,
      [id]: {
        ...(current[id] || {
          selected: false,
          quantity: "",
          unit: "",
          notes: "",
        }),
        ...patch,
      },
    }));

  const submit = async (event: FormEvent) => {
    event.preventDefault();
    const foodItems = catalog.foodItems
      .filter((food) => ingredients[food.food_itemID]?.selected)
      .map((food) => ({
        food_item_id: food.food_itemID,
        quantity: ingredients[food.food_itemID].quantity || undefined,
        unit: ingredients[food.food_itemID].unit || undefined,
        preparation_notes: ingredients[food.food_itemID].notes || undefined,
      }));
    if (!foodItems.length) return setError("Choose at least one food item.");
    const mealImages = imageUrls
      .split(/\r?\n/)
      .map((url) => url.trim())
      .filter(Boolean);
    if (primaryImage.trim() && !mealImages.includes(primaryImage.trim()))
      mealImages.unshift(primaryImage.trim());
    try {
      await createMeal({
        mealName: name.trim(),
        description: description.trim(),
        local_name: localName.trim() || undefined,
        image_url: primaryImage.trim() || mealImages[0] || undefined,
        video_url: videoUrl.trim() || undefined,
        pronunciation_url: pronunciationUrl.trim() || undefined,
        country_id: countryId ? Number(countryId) : undefined,
        foodItems,
        preparationSources: sources
          .filter((source) => source.source_url.trim())
          .map((source) => ({
            ...source,
            source_url: source.source_url.trim(),
            title: source.title.trim() || undefined,
          })),
        mealImages,
      }).unwrap();
      saved(name.trim());
    } catch (caught) {
      const response = caught as {
        data?: { errors?: { message?: string }; message?: string };
      };
      setError(
        response.data?.errors?.message ||
          response.data?.message ||
          "Could not create this meal.",
      );
    }
  };

  return (
    <div
      className="modal-backdrop"
      onMouseDown={(event) => event.target === event.currentTarget && close()}
    >
      <form className="modal meal-form" onSubmit={submit}>
        <button
          type="button"
          className="close"
          onClick={close}
          aria-label="Close"
        >
          ×
        </button>
        <span className="eyebrow">Build a reusable meal</span>
        <h2>Create meal</h2>
        <p className="modal-copy">
          Combine food items into a named dish. It will become available in
          every meal-plan slot. Then open the meal to create its recipe; these ingredients and quantities will be filled in for you.
        </p>
        <div className="stack-fields">
          <div className="form-columns">
            <label>
              <span>Meal name</span>
              <input
                required
                minLength={2}
                value={name}
                onChange={(event) => setName(event.target.value)}
                placeholder="Chicken with rice"
              />
            </label>
            <label>
              <span>Local or other name</span>
              <input
                value={localName}
                onChange={(event) => setLocalName(event.target.value)}
                placeholder="Kuku na wali"
              />
            </label>
          </div>
          <label>
            <span>Country of origin</span>
            <select
              value={countryId}
              onChange={(event) => setCountryId(event.target.value)}
            >
              <option value="">Not specified</option>
              {catalog.countries.map((country) => (
                <option key={country.id} value={country.id}>
                  {country.name}
                </option>
              ))}
            </select>
          </label>
          <label><span>Meal description</span><textarea value={description} onChange={event => setDescription(event.target.value)} /></label>
          <fieldset>
            <legend>Food items involved</legend>
            <p className="field-help">
              Select ingredients from the food library and optionally add
              quantities.
            </p>
            <div className="meal-ingredient-list">
              {catalog.foodItems.map((food) => {
                const draft = ingredients[food.food_itemID] || {
                  selected: false,
                  quantity: "",
                  unit: "",
                  notes: "",
                };
                return (
                  <div
                    className={
                      draft.selected
                        ? "meal-ingredient selected"
                        : "meal-ingredient"
                    }
                    key={food.food_itemID}
                  >
                    <label className="check">
                      <input
                        type="checkbox"
                        checked={draft.selected}
                        onChange={(event) =>
                          updateIngredient(food.food_itemID, {
                            selected: event.target.checked,
                          })
                        }
                      />
                      <strong>{food.food_name}</strong>
                    </label>
                    {draft.selected && (
                      <div className="ingredient-fields">
                        <input
                          value={draft.quantity}
                          onChange={(event) =>
                            updateIngredient(food.food_itemID, {
                              quantity: event.target.value,
                            })
                          }
                          placeholder="Qty"
                        />
                        <input
                          value={draft.unit}
                          onChange={(event) =>
                            updateIngredient(food.food_itemID, {
                              unit: event.target.value,
                            })
                          }
                          placeholder="Unit"
                        />
                        <input
                          value={draft.notes}
                          onChange={(event) =>
                            updateIngredient(food.food_itemID, {
                              notes: event.target.value,
                            })
                          }
                          placeholder="Preparation note"
                        />
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </fieldset>
          <div className="form-columns">
            <label>
              <span>Primary image URL</span>
              <input
                type="url"
                value={primaryImage}
                onChange={(event) => setPrimaryImage(event.target.value)}
                placeholder="https://…"
              />
            </label>
            <label>
              <span>Pronunciation audio URL</span>
              <input
                type="url"
                value={pronunciationUrl}
                onChange={(event) => setPronunciationUrl(event.target.value)}
                placeholder="https://…"
              />
            </label>
          </div>
          <label>
            <span>
              Additional image URLs <small>one per line</small>
            </span>
            <textarea
              rows={3}
              value={imageUrls}
              onChange={(event) => setImageUrls(event.target.value)}
              placeholder={"https://…\nhttps://…"}
            />
          </label>
          <label>
            <span>Main preparation video URL</span>
            <input
              type="url"
              value={videoUrl}
              onChange={(event) => setVideoUrl(event.target.value)}
              placeholder="YouTube, TikTok, Instagram or another URL"
            />
          </label>
          <fieldset>
            <legend>Preparation sources</legend>
            {sources.map((source, index) => (
              <div className="source-row" key={index}>
                <select
                  value={source.source_type}
                  onChange={(event) =>
                    setSources((current) =>
                      current.map((item, i) =>
                        i === index
                          ? { ...item, source_type: event.target.value }
                          : item,
                      ),
                    )
                  }
                >
                  <option value="youtube">YouTube</option>
                  <option value="tiktok">TikTok</option>
                  <option value="instagram">Instagram</option>
                  <option value="x">X</option>
                  <option value="other">Other</option>
                </select>
                <input
                  type="url"
                  value={source.source_url}
                  onChange={(event) =>
                    setSources((current) =>
                      current.map((item, i) =>
                        i === index
                          ? { ...item, source_url: event.target.value }
                          : item,
                      ),
                    )
                  }
                  placeholder="Source URL"
                />
                <input
                  value={source.title}
                  onChange={(event) =>
                    setSources((current) =>
                      current.map((item, i) =>
                        i === index
                          ? { ...item, title: event.target.value }
                          : item,
                      ),
                    )
                  }
                  placeholder="Title (optional)"
                />
                {sources.length > 1 && (
                  <button
                    type="button"
                    className="icon-button"
                    onClick={() =>
                      setSources((current) =>
                        current.filter((_, i) => i !== index),
                      )
                    }
                  >
                    ×
                  </button>
                )}
              </div>
            ))}
            <button
              type="button"
              className="secondary add-source"
              onClick={() =>
                setSources((current) => [
                  ...current,
                  { source_type: "youtube", source_url: "", title: "" },
                ])
              }
            >
              ＋ Add source
            </button>
          </fieldset>
        </div>
        {error && <p className="form-error">{error}</p>}
        <div className="modal-actions">
          <span />
          <button type="button" className="secondary" onClick={close}>
            Cancel
          </button>
          <button className="primary" disabled={isLoading}>
            {isLoading ? "Creating…" : "Create meal"}
          </button>
        </div>
      </form>
    </div>
  );
}
