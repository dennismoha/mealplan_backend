import { configureStore } from "@reduxjs/toolkit"
import { mealPlanApi } from "./store/mealPlanApi"
import authReducer from "./features/auth/authSlice"
import { authApi } from "./features/auth/authApi"

export const store = configureStore({
  reducer: { auth: authReducer, [mealPlanApi.reducerPath]: mealPlanApi.reducer, [authApi.reducerPath]: authApi.reducer },
  middleware: getDefaultMiddleware => getDefaultMiddleware().concat(mealPlanApi.middleware, authApi.middleware),
})

export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch
