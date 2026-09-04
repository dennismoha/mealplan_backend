import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import type { Catalog, DayMeals, MealPlan, MealPlanInterval } from "../api";

const baseUrl = (import.meta.env.VITE_API_URL || "/api").replace(/\/$/, "");
const emptyCatalog: Catalog = {
  categories: [],
  subcategories: [],
  foodItems: [],
  mealTypes: [],
  mealSlots: [],
  assignments: [],
  recipes: [],
  countries: [],
};

function normalizePlan(plan: MealPlan): MealPlan {
  if (typeof plan.data !== "string") return plan;
  try {
    return { ...plan, data: JSON.parse(plan.data) };
  } catch {
    return { ...plan, data: { daysOfWeek: {} } };
  }
}

export const mealPlanApi = createApi({
  reducerPath: "mealPlanApi",
  baseQuery: fetchBaseQuery({
    baseUrl,
    credentials: "include",
    prepareHeaders: (headers, api) => {
      const token = (api.getState() as { auth: { token: string | null } }).auth
        .token;
      if (token) headers.set("authorization", `Bearer ${token}`);
      return headers;
    },
  }),
  tagTypes: ["Plans", "Catalog"],
  endpoints: (builder) => ({
    getPlans: builder.query<MealPlan[], "all" | "mine">({
      async queryFn(scope, _api, _options, baseQuery) {
        if (scope === "mine") {
          const result = await baseQuery("/meal/meal-plan/mine");
          if (result.error) return { error: result.error };
          return {
            data: ((result.data as { meals?: MealPlan[] }).meals || []).map(
              normalizePlan,
            ),
          };
        }
        const [plansResult, intervalsResult] = await Promise.all([
          baseQuery("/meal/meal-plan/all"),
          baseQuery("/meal/meal-plan/time-intervals/"),
        ]);
        if (plansResult.error) return { error: plansResult.error };
        if (intervalsResult.error) return { error: intervalsResult.error };
        const plans = (
          (plansResult.data as { meals?: MealPlan[] }).meals || []
        ).map(normalizePlan);
        const intervals =
          (intervalsResult.data as { data?: MealPlanInterval[] }).data || [];
        const populated = new Set(plans.map((plan) => plan.mealplankey));
        const empty = intervals
          .filter((item) => !populated.has(item.meal_plan_name))
          .map((item) => ({
            mealplankey: item.meal_plan_name,
            idmealPlanWeek: item.idmealPlanWeek,
            ownerUserId: item.owner_user_id,
            planGoal: item.plan_goal,
            description: item.description,
            budgetLevel: item.budget_level,
            estimatedCost: item.estimated_cost,
            currency: item.currency,
            imageUrl: item.image_url,
            data: { daysOfWeek: {} },
          }));
        return { data: [...plans, ...empty] };
      },
      providesTags: ["Plans"],
    }),
    getCatalog: builder.query<Catalog, void>({
      query: () => "/catalog/",
      transformResponse: (response: { data?: Catalog }) =>
        response.data || emptyCatalog,
      providesTags: ["Catalog"],
    }),
    createInterval: builder.mutation<
      { data: MealPlanInterval },
      {
        mealPlanName: string;
        planGoal: string;
        description: string;
        budgetLevel: string;
        estimatedCost?: number;
        currency: string;
        imageUrl?: string;
      }
    >({
      query: (body) => ({
        url: "/meal/meal-plan/time-intervals/",
        method: "POST",
        body,
      }),
      invalidatesTags: ["Plans"],
    }),
    saveDay: builder.mutation<
      unknown,
      { meals: DayMeals; day: string; key: string; editing: boolean }
    >({
      query: ({ meals, day, key, editing }) => ({
        url: `/meal/meal-plan/${editing ? "update" : "new"}`,
        method: editing ? "PUT" : "POST",
        body: {
          day_of_week: day,
          breakfast: meals.breakfast,
          morning_break: meals.morning_break,
          Lunch: meals.lunch,
          evening_break: meals.evening_break,
          supper: meals.supper,
          mealplan_key: key,
        },
      }),
      invalidatesTags: ["Plans"],
    }),
    deleteDay: builder.mutation<unknown, { key: string; day: string }>({
      query: ({ key, day }) => ({
        url: `/meal/meal-plan/remove/${encodeURIComponent(key)}/${encodeURIComponent(day)}`,
        method: "DELETE",
      }),
      invalidatesTags: ["Plans"],
    }),
    createCategory: builder.mutation<
      unknown,
      { categoryName: string; description: string; imageURL?: string }
    >({
      query: (body) => ({ url: "/food/category/", method: "POST", body }),
      invalidatesTags: ["Catalog"],
    }),
    createSubcategory: builder.mutation<
      unknown,
      {
        subcategory_name: string;
        description: string;
        food_category_id: string;
      }
    >({
      query: (body) => ({ url: "/foodsubcategories", method: "POST", body }),
      invalidatesTags: ["Catalog"],
    }),
    createFoodItem: builder.mutation<
      unknown,
      {
        food_name: string;
        descriptionl: string;
        image_url: string;
        category_id: string;
        foodsubcategory_id?: string;
      }
    >({
      query: (body) => ({ url: "/food/fooditems", method: "POST", body }),
      invalidatesTags: ["Catalog"],
    }),
    createRecipe: builder.mutation<unknown, Record<string, unknown>>({
      query: (body) => ({ url: "/recipes", method: "POST", body }),
      invalidatesTags: ["Catalog"],
    }),
    createMeal: builder.mutation<unknown, Record<string, unknown>>({
      query: (body) => ({ url: "/meal/meals/meals", method: "POST", body }),
      invalidatesTags: ["Catalog"],
    }),
    updateRecipe: builder.mutation<
      unknown,
      { id: number; body: Record<string, unknown> }
    >({
      query: ({ id, body }) => ({ url: `/recipes/${id}`, method: "PUT", body }),
      invalidatesTags: ["Catalog"],
    }),
    deleteRecipe: builder.mutation<void, number>({
      query: (id) => ({ url: `/recipes/${id}`, method: "DELETE" }),
      invalidatesTags: ["Catalog"],
    }),
  }),
});

export const {
  useGetPlansQuery,
  useGetCatalogQuery,
  useCreateIntervalMutation,
  useSaveDayMutation,
  useDeleteDayMutation,
  useCreateCategoryMutation,
  useCreateSubcategoryMutation,
  useCreateFoodItemMutation,
  useCreateRecipeMutation,
  useCreateMealMutation,
  useUpdateRecipeMutation,
  useDeleteRecipeMutation,
} = mealPlanApi;
