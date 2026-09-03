import { FormEvent, useEffect, useMemo, useState } from "react"
import { type DayMeals, type FoodItem } from "./api"
import { demoPlans } from "./demo"
import CatalogView from "./CatalogView"
import { FoodDrawer, MealDrawer } from "./DetailDrawers"
import { useCreateIntervalMutation, useDeleteDayMutation, useGetCatalogQuery, useGetPlansQuery, useSaveDayMutation } from "./store/mealPlanApi"
import { useSelector } from "react-redux"
import type { RootState } from "./store"
import { AccountButton, AdminPanel } from "./AuthWorkspace"
import CountryExplorer from "./CountryExplorer"
import RecipeForm from "./RecipeForm"
import RecipeManager from "./RecipeManager"

const DAYS = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"]
const EMPTY: DayMeals = { breakfast: "", morning_break: "", lunch: "", evening_break: "", supper: "" }
const SLOTS: { key: keyof DayMeals; label: string; icon: string }[] = [
  { key: "breakfast", label: "Breakfast", icon: "☼" },
  { key: "morning_break", label: "Morning break", icon: "◌" },
  { key: "lunch", label: "Lunch", icon: "◇" },
  { key: "evening_break", label: "Evening break", icon: "◌" },
  { key: "supper", label: "Supper", icon: "☾" },
]

type Toast = { kind: "success" | "error"; message: string }
export type WorkspaceMode = "public" | "professional" | "admin"

export default function App({ mode = "public" }: { mode?: WorkspaceMode }) {
  const [selectedKey, setSelectedKey] = useState("")
  const [editor, setEditor] = useState<{ day: string; values: DayMeals; editing: boolean } | null>(null)
  const [showNewPlan, setShowNewPlan] = useState(false)
  const [toast, setToast] = useState<Toast | null>(null)
  const [mealDetail, setMealDetail] = useState<{ name: string; slot: string } | null>(null)
  const [foodDetail, setFoodDetail] = useState<FoodItem | null>(null)
  const [showRecipe, setShowRecipe] = useState(false)
  const user = useSelector((state: RootState) => state.auth.user)

  const plansQuery = useGetPlansQuery(mode === "professional" ? "mine" : "all")
  const catalogQuery = useGetCatalogQuery()
  const [saveDayMutation, saveState] = useSaveDayMutation()
  const [deleteDayMutation, deleteState] = useDeleteDayMutation()
  const plans = plansQuery.data || (plansQuery.isError ? demoPlans : [])
  const catalog = catalogQuery.data || { categories: [], subcategories: [], foodItems: [], mealTypes: [], mealSlots: [], assignments: [], recipes: [], countries: [] }
  const offline = plansQuery.isError
  const catalogOffline = catalogQuery.isError
  const loading = plansQuery.isLoading
  const saving = saveState.isLoading || deleteState.isLoading
  const canCreatePlans = mode !== "public" && (user?.role === "professional" || user?.role === "admin")

  useEffect(() => {
    if (!plans.length) return
    if (!plans.some(plan => plan.mealplankey === selectedKey)) setSelectedKey(plans[0].mealplankey)
  }, [plans, selectedKey])
  useEffect(() => {
    if (!toast) return
    const id = window.setTimeout(() => setToast(null), 3500)
    return () => window.clearTimeout(id)
  }, [toast])

  const plan = useMemo(() => plans.find(item => item.mealplankey === selectedKey), [plans, selectedKey])
  const canManageSelectedPlan = user?.role === "admin" || (user?.role === "professional" && plan?.ownerUserId === user.id)
  const days = plan && typeof plan.data !== "string" ? plan.data.daysOfWeek : {}
  const filled = DAYS.filter(day => days[day]).length

  const openEditor = (day: string) => {
    const current = days[day]
    setEditor({ day, values: current ? { ...current } : { ...EMPTY }, editing: Boolean(current) })
  }

  const submitDay = async (event: FormEvent) => {
    event.preventDefault()
    if (!editor || !plan || offline) return
    try {
      await saveDayMutation({ meals: editor.values, day: editor.day, key: plan.mealplankey, editing: editor.editing }).unwrap()
      setToast({ kind: "success", message: `${editor.day}'s meals were saved.` })
      setEditor(null)
    } catch (error) {
      setToast({ kind: "error", message: error instanceof Error ? error.message : "Could not save this day." })
    }
  }

  const removeDay = async () => {
    if (!editor || !plan || offline || !window.confirm(`Remove all meals for ${editor.day}?`)) return
    try {
      await deleteDayMutation({ key: plan.mealplankey, day: editor.day }).unwrap()
      setEditor(null)
      setToast({ kind: "success", message: `${editor.day} was removed.` })
    } catch (error) {
      setToast({ kind: "error", message: error instanceof Error ? error.message : "Could not remove this day." })
    }
  }

  return <div className="app-shell">
    <aside className="sidebar">
      <a className="brand" href="#top" aria-label="Plateful home"><span className="brand-mark">P</span><span>plateful</span></a>
      <nav>
        <a className="nav-item active" href="#planner"><span>▦</span>{mode === "professional" ? "My meal plans" : "Meal planner"}</a>
        {mode !== "professional" && <a className="nav-item" href="#library"><span>♧</span>Food library</a>}
        {mode !== "professional" && <a className="nav-item" href="#countries"><span>◎</span>Countries</a>}
        {mode !== "public" && <a className="nav-item" href="#recipes"><span>♨</span>{mode === "professional" ? "My recipes" : "Recipes"}</a>}
        <a className="nav-item" href="/api-docs" target="_blank"><span>↗</span>API docs</a>
        {mode === "admin" && <a className="nav-item" href="#admin"><span>⚙</span>Administration</a>}
        {mode !== "public" && <a className="nav-item" href="/"><span>⌂</span>Public site</a>}
      </nav>
      <div className="sidebar-note">
        <span className="eyebrow">A small reminder</span>
        <p>Good food doesn’t need to be complicated. Plan simply, eat well.</p>
      </div>
      <div className="profile"><div className="avatar">MP</div><div><strong>Meal planner</strong><span>{offline ? "Demo workspace" : "Connected workspace"}</span></div></div>
    </aside>

    <main id="top">
      <header className="topbar">
        <div><span className="eyebrow">{mode === "admin" ? "Administration workspace" : mode === "professional" ? "Professional workspace" : "Your weekly rhythm"}</span><h1>{mode === "professional" ? "My meal plans" : mode === "admin" ? "Admin dashboard" : "Meal planner"}</h1></div>
        <div className="header-actions"><button className="secondary print-button" onClick={() => window.print()}>↧ Print plan</button>{canCreatePlans&&<button className="secondary" onClick={()=>setShowRecipe(true)}>＋ Recipe</button>}{canCreatePlans && <button className="primary" onClick={() => setShowNewPlan(true)} disabled={offline}>＋ New plan</button>}<AccountButton/></div>
      </header>

      {offline && <div className="notice"><span>Preview mode</span> The API is unavailable, so you’re seeing sample meals. Start the backend to create and edit plans.</div>}

      <section className="hero" id="insights">
        <div><span className="eyebrow">{plan?.planGoal?.replace(/_/g, " ") || "Balanced plan"}</span><h2>{filled === 7 ? "Your week is beautifully planned." : `${7 - filled} days are waiting for you.`}</h2><p>{plan?.description || `${filled * 5} meals planned across ${filled} of 7 days. A little preparation now makes the whole week lighter.`}</p></div>
        <div className="progress-wrap"><div className="progress-ring" style={{ "--progress": `${filled / 7 * 360}deg` } as React.CSSProperties}><div><strong>{filled}/7</strong><span>days</span></div></div></div>
      </section>

      <section className="planner" id="planner">
        <div className="section-heading">
          <div><span className="eyebrow">Plan at a glance</span><h2>Weekly table</h2></div>
          <div className="plan-control"><label htmlFor="plan">Meal plan</label><select id="plan" value={selectedKey} onChange={e => setSelectedKey(e.target.value)} disabled={loading}>{plans.map(item => <option key={item.mealplankey}>{item.mealplankey}</option>)}</select></div>
        </div>

        {loading ? <div className="loading"><span /><p>Setting the table…</p></div> : plans.length === 0 ? <EmptyPlans onCreate={canCreatePlans ? () => setShowNewPlan(true) : undefined} /> :
          <div className="table-scroll"><div className="meal-grid">
            <div className="corner" />
            {DAYS.map(day => <button className={`day-head ${day === new Intl.DateTimeFormat("en-US", { weekday: "long" }).format(new Date()) ? "today" : ""}`} key={day} onClick={() => canManageSelectedPlan && openEditor(day)}><span>{day.slice(0, 3)}</span><strong>{day}</strong></button>)}
            {SLOTS.map(slot => [
              <div className="slot-head" key={`${slot.key}-head`}><span>{slot.icon}</span><div><strong>{slot.label}</strong><small>{slot.key.includes("break") ? "A light pause" : "Main meal"}</small></div></div>,
              ...DAYS.map(day => { const mealName = days[day]?.[slot.key]; return <button className={`meal-cell ${!mealName ? "empty" : ""}`} key={`${slot.key}-${day}`} onClick={() => mealName ? setMealDetail({ name: mealName, slot: slot.label }) : canManageSelectedPlan && openEditor(day)}>{mealName || <span>{canManageSelectedPlan ? "＋ Add meal" : "—"}</span>}</button> })
            ])}
          </div></div>}
        <p className="table-hint">Select a day or meal to add and edit the full day.</p>
      </section>

      {mode !== "professional" && <div id="library"><CatalogView catalog={catalog} offline={catalogOffline || mode !== "admin"} onFood={setFoodDetail} notify={(kind, message) => setToast({ kind, message })} /></div>}
      {mode !== "professional" && <CountryExplorer catalog={catalog} onFood={setFoodDetail}/>}
      {mode !== "public" && <RecipeManager catalog={catalog} notify={(kind, message) => setToast({ kind, message })}/>}
      {mode === "admin" && <AdminPanel />}

      <footer><span>Plateful</span><p>Thoughtful meals, one week at a time.</p></footer>
    </main>

    {editor && <div className="modal-backdrop" onMouseDown={e => e.target === e.currentTarget && setEditor(null)}>
      <form className="modal" onSubmit={submitDay}>
        <button className="close" type="button" onClick={() => setEditor(null)} aria-label="Close">×</button>
        <span className="eyebrow">{editor.editing ? "Edit the menu" : "Set the menu"}</span><h2>{editor.day}</h2><p className="modal-copy">Make it nourishing, make it yours.</p>
        <div className="fields">{SLOTS.map(slot => <label key={slot.key}><span>{slot.icon} {slot.label}</span><input required value={editor.values[slot.key]} placeholder={`What’s for ${slot.label.toLowerCase()}?`} onChange={e => setEditor({ ...editor, values: { ...editor.values, [slot.key]: e.target.value } })} /></label>)}</div>
        {offline && <p className="form-note">Editing is disabled in preview mode.</p>}
        <div className="modal-actions">{editor.editing && <button className="danger" type="button" onClick={removeDay} disabled={saving || offline}>Remove day</button>}<span /><button className="secondary" type="button" onClick={() => setEditor(null)}>Cancel</button><button className="primary" disabled={saving || offline}>{saving ? "Saving…" : "Save meals"}</button></div>
      </form>
    </div>}

    {showNewPlan && <NewPlanModal close={() => setShowNewPlan(false)} done={name => { setShowNewPlan(false); setSelectedKey(name); setToast({ kind: "success", message: `“${name}” was created.` }) }} fail={message => setToast({ kind: "error", message })} />}
    {showRecipe&&<RecipeForm catalog={catalog} close={()=>setShowRecipe(false)} saved={()=>{setShowRecipe(false);setToast({kind:"success",message:"Recipe saved."})}}/>}
    {mealDetail && <MealDrawer name={mealDetail.name} slot={mealDetail.slot} catalog={catalog} close={() => setMealDetail(null)} onFood={item => { setMealDetail(null); setFoodDetail(item) }} />}
    {foodDetail && <FoodDrawer item={foodDetail} catalog={catalog} close={() => setFoodDetail(null)} />}
    {toast && <div className={`toast ${toast.kind}`}>{toast.kind === "success" ? "✓" : "!"} {toast.message}</div>}
  </div>
}

function EmptyPlans({ onCreate }: { onCreate?: () => void }) {
  return <div className="empty-state"><span>✦</span><h3>{onCreate ? "Your table is ready" : "No meal plans yet"}</h3><p>{onCreate ? "Create your first weekly plan, then fill it one day at a time." : "Sign in as a professional to create and manage meal plans."}</p>{onCreate && <button className="primary" onClick={onCreate}>Create a meal plan</button>}</div>
}

function NewPlanModal({ close, done, fail }: { close: () => void; done: (name: string) => void; fail: (message: string) => void }) {
  const [name, setName] = useState("")
  const [planGoal, setPlanGoal] = useState("balanced")
  const [description, setDescription] = useState("")
  const [createInterval, { isLoading: busy }] = useCreateIntervalMutation()
  const submit = async (event: FormEvent) => {
    event.preventDefault()
    try { await createInterval({ mealPlanName: name.trim(), planGoal, description }).unwrap(); done(name.trim()) }
    catch (error) { fail(error instanceof Error ? error.message : "Could not create the plan.") }
  }
  return <div className="modal-backdrop" onMouseDown={e => e.target === e.currentTarget && close()}><form className="modal compact" onSubmit={submit}><button className="close" type="button" onClick={close}>×</button><span className="eyebrow">A fresh start</span><h2>New meal plan</h2><p className="modal-copy">Describe the purpose so people understand how to use it.</p><div className="stack-fields"><label><span>Plan name</span><input autoFocus required minLength={3} value={name} onChange={e => setName(e.target.value)} placeholder="e.g. September · Week 2" /></label><label><span>Goal</span><select value={planGoal} onChange={e=>setPlanGoal(e.target.value)}><option value="weight_loss">Weight loss</option><option value="weight_gain">Weight gain</option><option value="balanced">Balanced</option><option value="performance">Performance</option><option value="medical">Specialised</option></select></label><label><span>Description</span><textarea required value={description} onChange={e=>setDescription(e.target.value)} placeholder="Who this plan is for and how it works…"/></label></div><div className="modal-actions"><span /><button className="secondary" type="button" onClick={close}>Cancel</button><button className="primary" disabled={busy}>{busy ? "Creating…" : "Create plan"}</button></div></form></div>
}
