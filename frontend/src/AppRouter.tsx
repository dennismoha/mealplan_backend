import { Navigate, Route, Routes } from "react-router-dom"
import { useSelector } from "react-redux"
import App, { type WorkspaceMode } from "./App"
import { AuthGate } from "./AuthWorkspace"
import type { RootState } from "./store"
import type { SessionUser } from "./features/auth/authSlice"

function RoleRoute({ roles, children }: { roles: SessionUser["role"][]; children: React.ReactNode }) {
  const { user, initialized } = useSelector((state: RootState) => state.auth)
  if (!initialized) return <main className="auth-gate"><div className="loading"><span /><p>Restoring your workspace…</p></div></main>
  if (!user) return <Navigate to="/login" replace />
  if (!roles.includes(user.role)) return <Navigate to={user.role === "admin" ? "/admin" : user.role === "professional" ? "/professional" : "/"} replace />
  return children
}
const Workspace = ({ mode }: { mode: WorkspaceMode }) => <App mode={mode}/>
export default function AppRouter() { const user=useSelector((state:RootState)=>state.auth.user); return <Routes><Route path="/" element={<Workspace mode="public"/>}/><Route path="/login" element={user?<Navigate to={user.role==="admin"?"/admin":user.role==="professional"?"/professional":"/"} replace/>:<AuthGate/>}/><Route path="/professional" element={<RoleRoute roles={["professional"]}><Workspace mode="professional"/></RoleRoute>}/><Route path="/admin" element={<RoleRoute roles={["admin"]}><Workspace mode="admin"/></RoleRoute>}/><Route path="*" element={<Navigate to="/" replace/>}/></Routes> }
