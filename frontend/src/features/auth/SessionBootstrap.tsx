import { useEffect, useRef, type PropsWithChildren } from "react"
import { useDispatch } from "react-redux"
import { finishInitialization, setCredentials } from "./authSlice"
import { useRefreshSessionMutation } from "./authApi"

export default function SessionBootstrap({ children }: PropsWithChildren) {
  const dispatch = useDispatch()
  const [refresh] = useRefreshSessionMutation()
  const started = useRef(false)
  useEffect(() => { if (started.current) return; started.current = true; void refresh().unwrap().then(session => dispatch(setCredentials(session))).catch(() => dispatch(finishInitialization())) }, [dispatch, refresh])
  return children
}
