'use client'

import { useMemo, useState } from 'react'
import { AlertTriangle, BarChart3, Check, ChevronDown, Leaf, Plus, Settings2, Sparkles, Target, Trash2, X } from 'lucide-react'

type ActivityType = 'Car travel' | 'Bus' | 'Flight' | 'Electricity' | 'Veg meal' | 'Non-veg meal'
type Category = 'Transport' | 'Energy' | 'Food'
type Activity = { id: string; type: ActivityType; quantity: number; unit: string; co2: number; date: string; category: Category }

const factors: Record<ActivityType, number> = { 'Car travel': 0.2, Bus: 0.08, Flight: 0.25, Electricity: 0.8, 'Veg meal': 0.5, 'Non-veg meal': 2 }
const units: Record<ActivityType, string> = { 'Car travel': 'km', Bus: 'km', Flight: 'km', Electricity: 'kWh', 'Veg meal': 'meals', 'Non-veg meal': 'meals' }
const categories: Record<ActivityType, Category> = { 'Car travel': 'Transport', Bus: 'Transport', Flight: 'Transport', Electricity: 'Energy', 'Veg meal': 'Food', 'Non-veg meal': 'Food' }
const types = Object.keys(factors) as ActivityType[]
const today = () => new Date().toISOString().slice(0, 10)
const monday = (date = new Date()) => { const d = new Date(date); const day = d.getDay(); const diff = day === 0 ? -6 : 1 - day; d.setDate(d.getDate() + diff); d.setHours(0, 0, 0, 0); return d }
const round = (value: number) => Math.round(value * 100) / 100
const formatDate = (value: string) => new Date(`${value}T12:00:00`).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })

function load<T>(key: string, fallback: T): T { if (typeof window === 'undefined') return fallback; try { const value = window.localStorage.getItem(key); return value ? JSON.parse(value) : fallback } catch { return fallback } }

export function CarbonTrack() {
  const [activities, setActivities] = useState<Activity[]>(() => load<Activity[]>('carbontrack-activities', []))
  const [target, setTarget] = useState(() => load<number>('carbontrack-target', 50))
  const [type, setType] = useState<ActivityType>('Car travel')
  const [quantity, setQuantity] = useState('')
  const [date, setDate] = useState(today())
  const [tab, setTab] = useState<'dashboard' | 'log' | 'history'>('dashboard')
  const [filters, setFilters] = useState({ type: 'All', start: '', end: '' })
  const [pending, setPending] = useState<Activity | null>(null)
  const [targetEditing, setTargetEditing] = useState(false)
  const [targetInput, setTargetInput] = useState(String(target))

  const saveActivities = (next: Activity[]) => { setActivities(next); window.localStorage.setItem('carbontrack-activities', JSON.stringify(next)) }
  const addActivity = (activity: Activity) => saveActivities([activity, ...activities])
  const draftCo2 = round((Number(quantity) || 0) * factors[type])
  const weekStart = monday()
  const weekEnd = new Date(weekStart); weekEnd.setDate(weekEnd.getDate() + 7)
  const weekly = useMemo(() => activities.filter(a => { const d = new Date(`${a.date}T12:00:00`); return d >= weekStart && d < weekEnd }), [activities, weekStart.getTime()])
  const total = round(weekly.reduce((sum, a) => sum + a.co2, 0))
  const percent = target ? Math.round((total / target) * 100) : 0
  const remaining = round(Math.max(target - total, 0))
  const breakdown = (['Transport', 'Energy', 'Food'] as Category[]).map(category => ({ category, value: round(weekly.filter(a => a.category === category).reduce((sum, a) => sum + a.co2, 0)) }))
  const filtered = activities.filter(a => (filters.type === 'All' || a.type === filters.type) && (!filters.start || a.date >= filters.start) && (!filters.end || a.date <= filters.end))
  const daysElapsed = Math.min(7, Math.max(1, Math.floor((Date.now() - weekStart.getTime()) / 86400000) + 1))

  const submit = (event: React.FormEvent) => { event.preventDefault(); const value = Number(quantity); if (!value || value < 0) return; const activity: Activity = { id: crypto.randomUUID(), type, quantity: value, unit: units[type], co2: round(value * factors[type]), date, category: categories[type] }; if (value >= 10000 || activity.co2 >= 10000) setPending(activity); else { addActivity(activity); setQuantity(''); setTab('dashboard') } }
  const confirmPending = () => { if (pending) addActivity(pending); setPending(null); setQuantity(''); setTab('dashboard') }
  const saveTarget = () => { const value = Math.max(0, Number(targetInput) || 0); setTarget(value); window.localStorage.setItem('carbontrack-target', JSON.stringify(value)); setTargetEditing(false) }

  return <div className="ct-shell">
    <header className="ct-header"><div className="ct-brand"><span className="ct-mark"><Leaf size={20} /></span><span>Carbon<span>Track</span></span></div><nav>{[['dashboard', 'Dashboard'], ['log', 'Log activity'], ['history', 'History']].map(([key, label]) => <button key={key} className={tab === key ? 'active' : ''} onClick={() => setTab(key as typeof tab)}>{label}</button>)}</nav><button className="icon-button" aria-label="Settings"><Settings2 size={19} /></button></header>
    <main className="ct-main"><div className="ct-intro"><div><p className="eyebrow">YOUR WEEK IN VIEW</p><h1>{tab === 'dashboard' ? 'Small steps, real impact.' : tab === 'log' ? 'Log your footprint.' : 'Your activity history.'}</h1><p className="muted">Track your choices, understand your impact, and keep moving forward.</p></div>{tab === 'dashboard' && <button className="primary-button" onClick={() => setTab('log')}><Plus size={18} /> Log activity</button>}</div>
      {tab === 'dashboard' && <>
        {percent > 100 && <div className="warning"><AlertTriangle size={20} /><div><strong>Weekly target exceeded.</strong><span>That&apos;s okay â€” awareness is the first step. Keep learning and making choices that work for you.</span></div></div>}
        <section className="hero-grid"><div className="card progress-card"><div className="card-label"><span>This week&apos;s footprint</span><span className="week-pill">Mon â€“ Sun</span></div><div className="metric"><strong>{total.toFixed(2)}</strong><span>kg COâ‚‚</span></div><div className="progress-track"><div className={`progress-fill ${percent > 100 ? 'over' : ''}`} style={{ width: `${Math.min(percent, 100)}%` }} /></div><div className="progress-meta"><span>{percent}% of {target} kg target</span><span>{remaining.toFixed(2)} kg remaining</span></div><div className="week-note"><Sparkles size={16} /> {daysElapsed} of 7 days elapsed Â· Future days are not counted</div></div><div className="card target-card"><div className="card-label"><span>Weekly target</span><Target size={19} /></div>{targetEditing ? <div className="target-edit"><input autoFocus type="number" min="0" value={targetInput} onChange={e => setTargetInput(e.target.value)} /><button className="small-button" onClick={saveTarget}><Check size={16} /> Save</button></div> : <><div className="target-value">{target}<span>kg COâ‚‚</span></div><button className="text-button" onClick={() => setTargetEditing(true)}>Adjust target <ChevronDown size={15} /></button></>}</div></section>
        <section className="section"><div className="section-heading"><div><p className="eyebrow">BREAKDOWN</p><h2>Where your impact comes from</h2></div><BarChart3 size={22} className="heading-icon" /></div><div className="breakdown-grid">{breakdown.map(item => <div className="category-card" key={item.category}><div className={`category-dot ${item.category.toLowerCase()}`} /><span>{item.category}</span><strong>{item.value.toFixed(2)} <small>kg</small></strong><div className="mini-track"><i style={{ width: `${total ? Math.min(100, item.value / total * 100) : 0}%` }} /></div></div>)}</div></section>
        <section className="section"><div className="section-heading"><div><p className="eyebrow">RECENT ACTIVITY</p><h2>What you&apos;ve logged</h2></div><button className="text-button" onClick={() => setTab('history')}>View all <ChevronDown size={15} /></button></div>{weekly.length === 0 ? <div className="empty card">No activity logged this week yet. Start with one small step.</div> : <div className="activity-list">{weekly.slice(0, 4).map(a => <ActivityRow key={a.id} activity={a} />)}</div>}</section>
      </>}
      {tab === 'log' && <section className="form-card card"><form onSubmit={submit}><label>What did you do?<select value={type} onChange={e => setType(e.target.value as ActivityType)}>{types.map(item => <option key={item}>{item}</option>)}</select></label><div className="form-row"><label>Quantity<input type="number" min="0" step="any" placeholder="0" value={quantity} onChange={e => setQuantity(e.target.value)} required /><span className="unit">{units[type]}</span></label><label>Date<input type="date" value={date} onChange={e => setDate(e.target.value)} max={today()} required /></label></div><div className="calculation"><span>Estimated impact</span><strong>{draftCo2.toFixed(2)} <small>kg COâ‚‚</small></strong><p>{quantity || '0'} {units[type]} Ã— {factors[type].toFixed(2)} kg COâ‚‚ per {units[type].slice(0, -1) || units[type]}</p></div><button className="primary-button submit" type="submit"><Plus size={18} /> Add activity</button></form></section>}
      {tab === 'history' && <section className="history-section"><div className="filters card"><label>Activity type<select value={filters.type} onChange={e => setFilters({ ...filters, type: e.target.value })}><option>All</option>{types.map(item => <option key={item}>{item}</option>)}</select></label><label>From<input type="date" value={filters.start} onChange={e => setFilters({ ...filters, start: e.target.value })} /></label><label>To<input type="date" value={filters.end} onChange={e => setFilters({ ...filters, end: e.target.value })} /></label></div><div className="activity-list">{filtered.length ? filtered.map(a => <ActivityRow key={a.id} activity={a} onDelete={() => saveActivities(activities.filter(item => item.id !== a.id))} />) : <div className="empty card">No activities match these filters.</div>}</div></section>}
    </main>
    {pending && <div className="modal-backdrop"><div className="modal card"><button className="modal-close" onClick={() => setPending(null)} aria-label="Cancel"><X size={19} /></button><div className="modal-icon"><AlertTriangle size={23} /></div><p className="eyebrow">PLEASE CONFIRM</p><h2>This seems unusually high</h2><p>You entered <strong>{pending.quantity.toLocaleString()} {pending.unit}</strong> of {pending.type.toLowerCase()}, which equals <strong>{pending.co2.toFixed(2)} kg COâ‚‚</strong>.</p><p>Could you check the quantity before adding it?</p><div className="modal-actions"><button className="secondary-button" onClick={() => setPending(null)}>Cancel / edit</button><button className="primary-button" onClick={confirmPending}>Add anyway</button></div></div></div>}
  </div>
}
function ActivityRow({ activity, onDelete }: { activity: Activity; onDelete?: () => void }) { return <div className="activity-row"><div className={`activity-icon ${activity.category.toLowerCase()}`}><Leaf size={16} /></div><div className="activity-info"><strong>{activity.type}</strong><span>{activity.quantity.toLocaleString()} {activity.unit} Â· {formatDate(activity.date)}</span></div><strong className="activity-co2">{activity.co2.toFixed(2)} kg</strong>{onDelete && <button className="delete-button" onClick={onDelete} aria-label={`Delete ${activity.type}`}><Trash2 size={16} /></button>}</div> }
export default CarbonTrack


