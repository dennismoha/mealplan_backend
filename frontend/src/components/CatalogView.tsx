import { LocalNamesEditor, LocalNamesList } from "./FoodLocalNames"
import { FormEvent, useMemo, useState } from "react"
import { type Catalog, type FoodItem, type FoodLocalName } from "../api"
import { useCreateCategoryMutation, useCreateFoodItemMutation, useCreateSubcategoryMutation } from "../store/mealPlanApi"

type Props = { catalog: Catalog; offline: boolean; onFood: (item: FoodItem) => void; notify: (kind: "success" | "error", message: string) => void }
type AddKind = "category" | "subcategory" | "food" | null

export default function CatalogView({ catalog, offline, onFood, notify }: Props) {
  const [query, setQuery] = useState("")
  const [category, setCategory] = useState("all")
  const [adding, setAdding] = useState<AddKind>(null)
  const filtered = useMemo(() => catalog.foodItems.filter(item => {
    const matchesText = `${item.english_name || item.food_name} ${item.local_name || ""} ${(item.local_names || []).map(n => `${n.name} ${n.tribe_name || ""} ${n.language_name || ""} ${n.country?.name || ""}`).join(" ")} ${item.descriptionl || ""}`.toLowerCase().includes(query.toLowerCase())
    return matchesText && (category === "all" || item.category_id === category)
  }), [catalog, query, category])

  return <section className="catalog-page">
    <div className="catalog-hero"><div><span className="eyebrow">Ingredients & building blocks</span><h1>Food library</h1><p>Organise the ingredients that make every meal possible.</p></div><div className="catalog-stats"><div><strong>{catalog.foodItems.length}</strong><span>foods</span></div><div><strong>{catalog.categories.length}</strong><span>categories</span></div><div><strong>{catalog.mealTypes.length}</strong><span>dishes</span></div></div></div>
    <div className="toolbar"><div className="search"><span>⌕</span><input value={query} onChange={e => setQuery(e.target.value)} placeholder="Search maize, beans, rice…" /></div><button className="secondary" onClick={() => setAdding("category")} disabled={offline}>＋ Category</button><button className="secondary" onClick={() => setAdding("subcategory")} disabled={offline}>＋ Subcategory</button><button className="primary" onClick={() => setAdding("food")} disabled={offline}>＋ Food item</button></div>
    <div className="category-pills"><button className={category === "all" ? "active" : ""} onClick={() => setCategory("all")}>All foods <span>{catalog.foodItems.length}</span></button>{catalog.categories.map(cat => <button className={category === cat.food_categoryID ? "active" : ""} key={cat.food_categoryID} onClick={() => setCategory(cat.food_categoryID)}>{cat.category_name} <span>{catalog.foodItems.filter(i => i.category_id === cat.food_categoryID).length}</span></button>)}</div>
    <div className="food-grid">{filtered.map((item, index) => { const cat = catalog.categories.find(c => c.food_categoryID === item.category_id); return <button className="food-card" key={item.food_itemID || item.fooditem_cacheID || index} onClick={() => onFood(item)}><FoodImage item={item} /><div className="food-card-body"><span className="food-category">{cat?.category_name || "Uncategorised"}</span><h3>{item.english_name || item.food_name}</h3><LocalNamesList item={item} /><p>{item.descriptionl || "No description added yet."}</p><span className="view-link">View ingredient <b>→</b></span></div></button> })}</div>
    {filtered.length === 0 && <div className="no-results"><span>⌕</span><h3>No ingredients found</h3><p>Try another search or add a new food item.</p></div>}
    {adding && <AddCatalogModal kind={adding} catalog={catalog} close={() => setAdding(null)} saved={() => { setAdding(null); notify("success", "Your food library was updated.") }} fail={message => notify("error", message)} />}
  </section>
}

export function FoodImage({ item }: { item: FoodItem }) {
  const valid = item.image_url && /^https?:\/\//.test(item.image_url) && item.image_url !== "http://"
  return <div className="food-image">{valid ? <img src={item.image_url} alt="" onError={e => { e.currentTarget.style.display = "none" }} /> : null}<span>{(item.english_name || item.food_name).slice(0, 1).toUpperCase()}</span></div>
}

function AddCatalogModal({ kind, catalog, close, saved, fail }: { kind: Exclude<AddKind, null>; catalog: Catalog; close: () => void; saved: () => void; fail: (m: string) => void }) {
  const [name, setName] = useState(""); const [localNames, setLocalNames] = useState<FoodLocalName[]>([]); const [description, setDescription] = useState(""); const [image, setImage] = useState(""); const [category, setCategory] = useState(catalog.categories[0]?.food_categoryID || ""); const [subcategory, setSubcategory] = useState(""); const [busy, setBusy] = useState(false)
  const [recording, setRecording] = useState(false)
  const [createCategory] = useCreateCategoryMutation(); const [createSubcategory] = useCreateSubcategoryMutation(); const [createFoodItem] = useCreateFoodItemMutation()
  const submit = async (e: FormEvent) => { e.preventDefault(); setBusy(true); try { if (kind === "category") await createCategory({ categoryName:name, description, imageURL:image }).unwrap(); if (kind === "subcategory") await createSubcategory({ subcategory_name:name, description, food_category_id:category }).unwrap(); if (kind === "food") await createFoodItem({ food_name:name, english_name:name, local_names:localNames, descriptionl:description, image_url:image, category_id:category, foodsubcategory_id:subcategory }).unwrap(); saved() } catch (error) { const response = error as { data?: { error?: string; message?: string; errors?: { message?: string } } }; fail(response.data?.error || response.data?.message || response.data?.errors?.message || "Could not save this item.") } finally { setBusy(false) } }
  const title = kind === "food" ? "New food item" : kind === "subcategory" ? "New subcategory" : "New category"
  return <div className="modal-backdrop" onMouseDown={e => e.target === e.currentTarget && close()}><form className="modal compact" onSubmit={submit}><button type="button" className="close" onClick={close}>×</button><span className="eyebrow">Grow your library</span><h2>{title}</h2><p className="modal-copy">Add a clear name and enough detail to recognise it later.</p><div className="stack-fields"><label><span>{kind === "food" ? "English name" : "Name"}</span><input required value={name} onChange={e => setName(e.target.value)} /></label>{kind === "food" && <LocalNamesEditor countries={catalog.countries} value={localNames} onChange={setLocalNames} onRecordingChange={setRecording} />}<label><span>Description</span><textarea required value={description} onChange={e => setDescription(e.target.value)} /></label>{kind !== "category" && <label><span>Category</span><select required value={category} onChange={e => { setCategory(e.target.value); setSubcategory("") }}>{catalog.categories.map(c => <option value={c.food_categoryID} key={c.food_categoryID}>{c.category_name}</option>)}</select></label>}{kind === "food" && <><label><span>Subcategory</span><select required value={subcategory} onChange={e => setSubcategory(e.target.value)}><option value="">Choose a subcategory…</option>{catalog.subcategories.filter(s => s.food_category_id === category).map(s => <option value={s.foodsubcategory_id} key={s.foodsubcategory_id}>{s.subcategory_name}</option>)}</select></label></>}{kind !== "subcategory" && <label><span>Image URL <small>optional</small></span><input type="url" value={image} onChange={e => setImage(e.target.value)} placeholder="https://…" /></label>}</div><div className="modal-actions"><span/><button type="button" className="secondary" onClick={close}>Cancel</button><button className="primary" disabled={busy||recording}>{busy ? "Saving…" : "Save"}</button></div></form></div>
}
