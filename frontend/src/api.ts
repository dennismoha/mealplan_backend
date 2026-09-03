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
  ownerUserId?: number | null
  planGoal?: string
  description?: string
  data: { daysOfWeek: Record<string, DayMeals> } | string
}

export type MealPlanInterval = {
  idmealPlanWeek: number
  meal_plan_name: string
  created_on?: string | null
  updated_at?: string | null
  owner_user_id?: number | null
  plan_goal?: string
  description?: string
}

export type FoodCategory = { idFoodCategory: number; food_categoryID: string; category_name: string; description?: string; image_url?: string }
export type FoodSubcategory = { idFoodSubcategory: number; foodsubcategory_id: string; subcategory_name: string; description?: string; food_category_id: string }
export type Nutrition = { serving_size_g?: number; energy_kcal?: number; protein_g?: number; carbohydrates_g?: number; fat_g?: number; fiber_g?: number; source?: string }
export type Country = { id: number; name: string; code: string; description?: string; image_url?: string }
export type FoodItem = { idFoodItems: number; food_itemID: string; fooditem_cacheID?: string; food_name: string; descriptionl?: string; image_url?: string; category_id?: string; foodsubcategory_id?: string; countries?: Country[]; nutrition?: Nutrition }
export type MealType = { idtable1: number; mealTypesID: string; meal_name: string; countries?: Country[] }
export type MealAssignment = { meal_mealTypeID: string; mealName: string; mealID: string; meal_name: string; mealTypesID: string }
export type Recipe = { recipe_ID: string; idrecipe?: number; title: string; description?: string; ingredients?: string; instructions?: string; prep_time?: number; cook_time?: number; total_time?: number; servings?: number; cuisine?: string; difficulty?: string; meal_type?: string; meal_typeID?: string; video_url?: string; owner_user_id?: number; foodItems?: FoodItem[] }
export type Catalog = { categories: FoodCategory[]; subcategories: FoodSubcategory[]; foodItems: FoodItem[]; mealTypes: MealType[]; mealSlots: { mealName: string; mealID: string }[]; assignments: MealAssignment[]; recipes: Recipe[]; countries: Country[] }
