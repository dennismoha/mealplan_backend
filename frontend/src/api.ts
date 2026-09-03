export type DayMeals = {
  breakfast: string
  morning_break: string
  lunch: string
  evening_break: string
  supper: string
}

export type MealPlan = {
  mealplankey: string
  idmealPlanWeek: number
  data: { daysOfWeek: Record<string, DayMeals> } | string
}

export type MealPlanInterval = {
  idmealPlanWeek: number
  meal_plan_name: string
  created_on?: string | null
  updated_at?: string | null
}

export type FoodCategory = { idFoodCategory: number; food_categoryID: string; category_name: string; description?: string; image_url?: string }
export type FoodSubcategory = { idFoodSubcategory: number; foodsubcategory_id: string; subcategory_name: string; description?: string; food_category_id: string }
export type FoodItem = { idFoodItems: number; food_itemID: string; fooditem_cacheID?: string; food_name: string; descriptionl?: string; image_url?: string; category_id?: string; foodsubcategory_id?: string }
export type MealType = { idtable1: number; mealTypesID: string; meal_name: string }
export type MealAssignment = { meal_mealTypeID: string; mealName: string; mealID: string; meal_name: string; mealTypesID: string }
export type Recipe = { recipe_ID: string; title: string; description?: string; ingredients?: string; instructions?: string; prep_time?: number; cook_time?: number; total_time?: number; servings?: number; cuisine?: string; difficulty?: string; meal_type?: string; meal_typeID?: string }
export type Catalog = { categories: FoodCategory[]; subcategories: FoodSubcategory[]; foodItems: FoodItem[]; mealTypes: MealType[]; mealSlots: { mealName: string; mealID: string }[]; assignments: MealAssignment[]; recipes: Recipe[] }

const API_URL = (import.meta.env.VITE_API_URL || "/api").replace(/\/$/, "")

async function request<T>(path: string, options?: RequestInit): Promise<T> {
  const response = await fetch(`${API_URL}${path}`, {
    ...options,
    headers: { "Content-Type": "application/json", ...options?.headers },
  })
  if (!response.ok) {
    const body = await response.json().catch(() => ({}))
    throw new Error(body?.errors?.message || body?.message || `Request failed (${response.status})`)
  }
  if (response.status === 204) return undefined as T
  return response.json()
}

function normalizePlan(plan: MealPlan): MealPlan {
  let data = plan.data
  if (typeof data === "string") {
    try { data = JSON.parse(data) } catch { data = { daysOfWeek: {} } }
  }
  return { ...plan, data }
}

export async function getMealPlans() {
  const response = await request<{ meals: MealPlan[] }>("/meal/meal-plan/all")
  return (response.meals || []).map(normalizePlan)
}

export async function getIntervals() {
  const response = await request<{ data: MealPlanInterval[] }>("/meal/meal-plan/time-intervals/")
  return response.data || []
}

export function createInterval(mealPlanName: string) {
  return request("/meal/meal-plan/time-intervals/", {
    method: "POST", body: JSON.stringify({ mealPlanName }),
  })
}

export function saveDay(meals: DayMeals, day: string, key: string, editing: boolean) {
  return request(`/meal/meal-plan/${editing ? "update" : "new"}`, {
    method: editing ? "PUT" : "POST",
    body: JSON.stringify({
      day_of_week: day,
      breakfast: meals.breakfast,
      morning_break: meals.morning_break,
      Lunch: meals.lunch,
      evening_break: meals.evening_break,
      supper: meals.supper,
      mealplan_key: key,
    }),
  })
}

export function deleteDay(key: string, day: string) {
  return request(`/meal/meal-plan/remove/${encodeURIComponent(key)}/${encodeURIComponent(day)}`, { method: "DELETE" })
}

export async function getCatalog() {
  const response = await request<{ data: Catalog }>("/catalog/")
  return response.data
}

export function createCategory(data: { categoryName: string; description: string; imageURL?: string }) {
  return request("/food/category/", { method: "POST", body: JSON.stringify(data) })
}

export function createSubcategory(data: { subcategory_name: string; description: string; food_category_id: string }) {
  return request("/foodsubcategories", { method: "POST", body: JSON.stringify(data) })
}

export function createFoodItem(data: { food_name: string; descriptionl: string; image_url: string; category_id: string; foodsubcategory_id?: string }) {
  return request("/food/fooditems", { method: "POST", body: JSON.stringify(data) })
}
