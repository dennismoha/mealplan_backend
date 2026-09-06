import { createSlice, type PayloadAction } from "@reduxjs/toolkit"

export type SessionUser = { first_name?: string; last_name?: string; jobs?: string[]; bio?: string; image_url?: string; id: number; email: string; role: "user" | "professional" | "admin"; status: string; createdAt?: string }
type AuthState = { token: string | null; user: SessionUser | null; initialized: boolean }
const initialState: AuthState = { token: null, user: null, initialized: false }

const authSlice = createSlice({
  name: "auth", initialState,
  reducers: {
    setCredentials(state, action: PayloadAction<{ token: string; user: SessionUser }>) { state.token = action.payload.token; state.user = action.payload.user; state.initialized = true },
    clearCredentials(state) { state.token = null; state.user = null; state.initialized = true },
    finishInitialization(state) { state.initialized = true },
  },
})
export const { setCredentials, clearCredentials, finishInitialization } = authSlice.actions
export default authSlice.reducer
