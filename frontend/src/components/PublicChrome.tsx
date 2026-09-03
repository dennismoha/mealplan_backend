import { useEffect, useState } from "react"
import { Link } from "react-router-dom"
import type { Catalog } from "../api"
import mealTableHero from "../assets/images/meal-table-hero.png"

export function ThemeToggle() {
  const [dark, setDark] = useState(() => localStorage.getItem("plateful-theme") === "dark")
  useEffect(() => { document.documentElement.dataset.theme = dark ? "dark" : "light"; localStorage.setItem("plateful-theme", dark ? "dark" : "light") }, [dark])
  return <button className="theme-toggle" onClick={() => setDark(!dark)} aria-label={`Use ${dark ? "light" : "dark"} theme`}>{dark ? "☀" : "☾"}</button>
}

export function PublicHeader() {
  const [open, setOpen] = useState(false)
  return <header className="public-header"><Link className="brand" to="/"><span className="brand-mark">P</span><span>plateful</span></Link><button className="mobile-menu" onClick={() => setOpen(!open)} aria-label="Toggle navigation">☰</button><nav className={open ? "open" : ""}><a href="#countries">Countries</a><a href="#library">Food items</a><a href="#meal-types">Meals</a><a href="#planner">Meal plans</a><a href="#budget">On a budget</a><a href="#professionals">Professionals</a><span className="coming">Ailment plans <small>soon</small></span></nav><div className="public-actions"><ThemeToggle/><Link to="/signin">Sign in</Link><Link className="primary" to="/register">Join free</Link></div></header>
}

export function PublicHero({ plans, foods }: { plans: number; foods: number }) {
  return <section className="public-hero"><img src={mealTableHero} alt="A table of wholesome dishes from around the world"/><div className="public-hero-copy"><span className="eyebrow">Eat well, wherever home is</span><h1>Good food.<br/><em>Thoughtfully planned.</em></h1><p>Discover practical meal plans, nourishing ingredients and recipes shaped by food cultures around the world.</p><div className="hero-actions"><a className="primary" href="#planner">Explore meal plans</a><a href="#library">Browse ingredients →</a></div><div className="hero-proof"><strong>{plans}</strong><span>meal plans</span><strong>{foods}</strong><span>ingredients</span></div></div></section>
}

export function DiscoveryStrip({ catalog }: { catalog: Catalog }) {
  return <><section className="discovery-section" id="meal-types"><div className="section-heading"><div><span className="eyebrow">From everyday staples to new favourites</span><h2>Explore meals</h2></div><a href="#library">See ingredients →</a></div><div className="discovery-rail">{catalog.mealTypes.map((meal, index) => <article className={`meal-discovery tone-${index%5}`} key={meal.mealTypesID}><div className="meal-art"><span>{meal.meal_name.slice(0,1)}</span></div><div><small>{meal.countries?.[0]?.name || "Everyday cooking"}</small><h3>{meal.meal_name}</h3><p>{catalog.recipes.filter(recipe => recipe.meal_typeID === meal.mealTypesID).length} recipes</p></div></article>)}</div></section><section className="future-grid" id="budget"><article><span>Budget-friendly</span><h2>Eat well without overspending.</h2><p>Explore meal plans grouped by estimated weekly cost, from simple staples to generous family tables.</p><a href="#planner">Browse affordable plans →</a></article><article id="professionals"><span>Expert-led planning</span><h2>Plans made by professionals.</h2><p>Professional profiles, workplace details and their specialised meal-plan collections are coming next.</p><Link to="/register">Become a contributor →</Link></article></section></>
}
