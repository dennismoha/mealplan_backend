import { Link, useParams } from 'react-router-dom'
import type { ProfessionalProfile } from '../api'
import { useGetProfessionalsQuery, useGetProfessionalQuery } from '../features/auth/authApi'
import { PublicHeader } from '../components/PublicChrome'
import Workspace from '../components/Workspace'
export function ProfileSummary({ profile }: { profile: ProfessionalProfile }) {
  const name = [profile.first_name, profile.last_name].filter(Boolean).join(' ') || `Professional #${profile.id}`
  return <><div className="professional-avatar">{profile.image_url ? <img src={profile.image_url} alt={name} loading="lazy" onError={e => { e.currentTarget.style.display = 'none' }} /> : <span>{name.slice(0, 1)}</span>}</div><h2>{name}</h2><div className="tag-row">{profile.jobs?.map(job => <span key={job}>{job}</span>)}</div><p className="profile-bio">{profile.bio || 'This professional has not added a biography yet.'}</p></>
}
export default function ProfessionalsPage() {
  const query = useGetProfessionalsQuery(undefined, { refetchOnMountOrArgChange: true })
  return <><PublicHeader /><main className="professionals-page"><span className="eyebrow">Meet the people behind the plans</span><h1>Professionals</h1><p>Explore professionals with meal plans and find their collections.</p>{query.isLoading ? <p>Loading professionals…</p> : query.isError ? <p role="alert">Could not load professionals. <button onClick={() => query.refetch()}>Retry</button></p> : <div className="professional-grid">{query.data?.map(profile => <Link className="professional-card" key={profile.id} to={`/professionals/${profile.id}`}><ProfileSummary profile={profile} /><strong>View {profile.plan_count} meal plan{profile.plan_count === 1 ? '' : 's'} →</strong></Link>)}{!query.data?.length && <p>No professionals with meal plans yet.</p>}</div>}</main></>
}
export function ProfessionalPlansPage() {
  const { id = '' } = useParams()
  const query = useGetProfessionalQuery(id, { refetchOnMountOrArgChange: true })
  if (query.isLoading || query.isFetching) return <><PublicHeader /><main className="professionals-page"><p>Loading professional…</p></main></>
  if (query.isError || !query.data) return <><PublicHeader /><main className="professionals-page"><p role="alert">Professional unavailable or no longer has meal plans.</p><Link to="/professionals">Back to professionals</Link><button onClick={() => query.refetch()}>Retry</button></main></>
  return <Workspace key={id} suppliedPlans={query.data.plans} introduction={<section className="professionals-page"><Link to="/professionals">← All professionals</Link><ProfileSummary profile={query.data.professional} /></section>} />
}
