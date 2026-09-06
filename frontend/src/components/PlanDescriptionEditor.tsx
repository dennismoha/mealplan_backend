import { useState, type FormEvent } from 'react'
import type { MealPlan } from '../api'
import { useUpdatePlanDescriptionMutation } from '../store/mealPlanApi'
export default function PlanDescriptionEditor({ plan }: { plan: MealPlan }) {
  const [open, setOpen] = useState(false)
  const [description, setDescription] = useState(plan.description || '')
  const [error, setError] = useState('')
  const [save, state] = useUpdatePlanDescriptionMutation()
  const submit = async (e: FormEvent) => { e.preventDefault(); try { await save({ id: plan.idmealPlanWeek, description: description.trim() }).unwrap(); setOpen(false) } catch (e) { setError((e as { data?: { message?: string } }).data?.message || 'Could not save description') } }
  if (!open) return <button type="button" onClick={() => { setDescription(plan.description || ''); setError(''); setOpen(true) }}>Edit description</button>
  return <form onSubmit={submit} className="stack-fields"><label><span>Meal-plan description</span><textarea required minLength={10} rows={4} value={description} onChange={e => setDescription(e.target.value)} /></label>{error && <p role="alert">{error}</p>}<div className="modal-actions"><button type="button" onClick={() => setOpen(false)}>Cancel</button><button disabled={state.isLoading || description.trim().length < 10}>Save description</button></div></form>
}
