import { useState, type FormEvent } from 'react'
import type { ProfessionalProfile } from '../api'
import { useGetOwnProfileQuery, useSaveOwnProfileMutation, type ProfileInput } from '../features/auth/authApi'
export type ProfileDraft = { first_name: string; last_name: string; jobsText: string; bio: string; image_url: string }
export const profileDraft = (p?: Partial<ProfessionalProfile>): ProfileDraft => ({ first_name: p?.first_name || '', last_name: p?.last_name || '', jobsText: p?.jobs?.join(', ') || '', bio: p?.bio || '', image_url: p?.image_url || '' })
export const profileBody = (p: ProfileDraft): ProfileInput => ({ first_name: p.first_name, last_name: p.last_name, jobs: p.jobsText.split(',').map(job => job.trim()).filter(Boolean), bio: p.bio, image_url: p.image_url })
export function ProfileFields({ value, change }: { value: ProfileDraft; change: (value: ProfileDraft) => void }) {
  const field = (key: keyof ProfileDraft, label: string, maxLength: number, type = 'text') => <label><span>{label}</span><input required type={type} maxLength={maxLength} value={value[key]} onChange={e => change({ ...value, [key]: e.target.value })} /></label>
  return <div className="stack-fields">{field('first_name', 'First name', 100)}{field('last_name', 'Last name', 100)}{field('jobsText', 'Professional jobs (separate with commas)', 2000)}<label><span>About yourself</span><textarea required maxLength={5000} rows={4} value={value.bio} onChange={e => change({ ...value, bio: e.target.value })} /></label>{field('image_url', 'Profile image URL', 2000, 'url')}<small>These details appear on your public professional profile.</small></div>
}
export function ProfileEditor({ profile, save, close }: { profile: Partial<ProfessionalProfile>; save: (body: ProfileInput) => Promise<unknown>; close: () => void }) {
  const [value, change] = useState(profileDraft(profile)); const [error, setError] = useState(''); const [busy, setBusy] = useState(false)
  const submit = async (e: FormEvent) => { e.preventDefault(); setBusy(true); setError(''); try { await save(profileBody(value)); close() } catch (e) { setError((e as { data?: { message?: string } }).data?.message || 'Could not save profile') } finally { setBusy(false) } }
  return <div className="modal-backdrop"><form className="modal compact" onSubmit={submit}><h2>Professional profile</h2><ProfileFields value={value} change={change} />{error && <p role="alert">{error}</p>}<div className="modal-actions"><button type="button" onClick={close}>Cancel</button><button disabled={busy}>Save profile</button></div></form></div>
}
export default function OwnProfessionalProfile() {
  const query = useGetOwnProfileQuery(); const [save] = useSaveOwnProfileMutation(); const [editing, setEditing] = useState(false)
  return <section className="professionals-page"><h2>Your public profile</h2><p>Add your name, professional jobs, biography and photograph. Your profile appears in the directory once you own a meal plan.</p>{query.isError ? <p role="alert">Could not load profile. <button onClick={() => query.refetch()}>Retry</button></p> : <button disabled={!query.data} onClick={() => setEditing(true)}>Edit professional profile</button>}{editing && query.data && <ProfileEditor profile={query.data} save={body => save(body).unwrap()} close={() => setEditing(false)} />}</section>
}
