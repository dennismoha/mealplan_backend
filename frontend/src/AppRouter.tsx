import type { ReactNode } from "react"
import { useSelector } from "react-redux"
import { Navigate, Route, Routes } from "react-router-dom"
import type { SessionUser } from "./features/auth/authSlice"
import AdminPage from "./pages/AdminPage"
import HomePage from "./pages/HomePage"
import ProfessionalPage from "./pages/ProfessionalPage"
import RegisterPage from "./pages/RegisterPage"
import SignInPage from "./pages/SignInPage"
import type { RootState } from "./store"

function RoleRoute({ roles, children }: { roles: SessionUser["role"][]; children: ReactNode }) {
  const { user, initialized } = useSelector((state: RootState) => state.auth)
  if (!initialized) return <main className="auth-gate"><div className="loading"><span /><p>Restoring your workspace…</p></div></main>
  if (!user) return <Navigate to="/signin" replace />
  if (!roles.includes(user.role)) return <Navigate to={user.role === "admin" ? "/admin" : user.role === "professional" ? "/professional" : "/"} replace />
  return children
}

export default function AppRouter() {
  return <Routes>
    <Route path="/" element={<HomePage />} />
    <Route path="/signin" element={<SignInPage />} />
    <Route path="/register" element={<RegisterPage />} />
    <Route path="/professional" element={<RoleRoute roles={["professional"]}><ProfessionalPage /></RoleRoute>} />
    <Route path="/admin" element={<RoleRoute roles={["admin"]}><AdminPage /></RoleRoute>} />
    <Route path="*" element={<Navigate to="/" replace />} />
  </Routes>
}
