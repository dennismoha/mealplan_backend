import type { MealPlan } from "./api"

const meals = (breakfast: string, morning: string, lunch: string, evening: string, supper: string) => ({
  breakfast, morning_break: morning, lunch, evening_break: evening, supper,
})

export const demoPlans: MealPlan[] = [{
  mealplankey: "September · Week 1",
  idmealPlanWeek: 1,
  data: { daysOfWeek: {
    Monday: meals("Mandazi & chai", "Mango slices", "Chicken avocado salad", "Yoghurt & honey", "Grilled tilapia & rice"),
    Tuesday: meals("Chapati & chai", "Banana", "Beef stew & mash", "Coffee & biscuits", "Githeri & avocado"),
    Wednesday: meals("Millet porridge", "Orange wedges", "Ugali & sukuma", "Roasted nuts", "Minji & rice"),
    Thursday: meals("Eggs & toast", "Pawpaw", "Pilau & kachumbari", "Fresh juice", "Vegetable curry"),
    Friday: meals("Sweet potato & tea", "Watermelon", "Coconut fish curry", "Yoghurt", "Ugali & beef stew"),
    Saturday: meals("Pancakes & berries", "Fruit bowl", "Chicken biryani", "Banana smoothie", "Chapati & ndengu"),
    Sunday: meals("Omelette & toast", "Passion fruit", "Roast chicken & potatoes", "Tea & fruit", "Light vegetable soup"),
  }},
}]
