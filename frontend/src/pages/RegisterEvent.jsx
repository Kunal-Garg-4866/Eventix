import { useEffect, useState } from 'react'
import { Link, useNavigate, useParams } from 'react-router-dom'
import { eventsApi, registrationsApi } from '../api/eventix.js'

export default function RegisterEvent() {
  const { id } = useParams()
  const navigate = useNavigate()
  const [event, setEvent] = useState(null)
  const [error, setError] = useState('')
  const [busy, setBusy] = useState(false)

  const [soloName, setSoloName] = useState('')
  const [soloRoll, setSoloRoll] = useState('')
  const [teamName, setTeamName] = useState('')
  const [members, setMembers] = useState([{ name: '', rollNumber: '' }])

  useEffect(() => {
    eventsApi
      .get(id)
      .then((res) => {
        const ev = res.data.event
        setEvent(ev)
        if (ev.eventType === 'team') {
          const n = Math.max(ev.teamSizeMin, 1)
          setMembers(Array.from({ length: n }, () => ({ name: '', rollNumber: '' })))
        } else {
          setMembers([{ name: '', rollNumber: '' }])
        }
      })
      .catch(() => setError('Could not load event.'))
  }, [id])

  function updateMember(i, key, value) {
    setMembers((rows) => rows.map((r, j) => (j === i ? { ...r, [key]: value } : r)))
  }

  function addMember() {
    if (!event || event.eventType !== 'team') return
    if (members.length >= event.teamSizeMax) return
    setMembers((rows) => [...rows, { name: '', rollNumber: '' }])
  }

  function removeMember(i) {
    if (!event || event.eventType !== 'team') return
    if (members.length <= event.teamSizeMin) return
    setMembers((rows) => rows.filter((_, j) => j !== i))
  }

  async function onSubmit(e) {
    e.preventDefault()
    setError('')
    setBusy(true)
    try {
      if (event.eventType === 'solo') {
        await registrationsApi.register(id, { name: soloName, rollNumber: soloRoll })
      } else {
        await registrationsApi.register(id, { teamName, members })
      }
      navigate('/student')
    } catch (err) {
      setError(err.response?.data?.message || 'Registration failed')
    } finally {
      setBusy(false)
    }
  }

  if (!event && !error) {
    return (
      <div className="page-narrow">
        <p className="muted">Loading…</p>
      </div>
    )
  }

  if (error && !event) {
    return (
      <div className="page-narrow">
        <p className="form-error">{error}</p>
        <Link to="/events">Back</Link>
      </div>
    )
  }

  return (
    <div className="page-narrow">
      <Link to={`/events/${id}`} className="back-link">
        ← Event
      </Link>
      <div className="card card-pad">
        <h1>Register: {event.title}</h1>
        <p className="muted">Complete the form below. Fields are validated on the server.</p>
        {error && <p className="form-error">{error}</p>}
        {event.eventType === 'solo' ? (
          <form onSubmit={onSubmit} className="form-stack">
            <label className="field">
              <span>Name</span>
              <input value={soloName} onChange={(e) => setSoloName(e.target.value)} required />
            </label>
            <label className="field">
              <span>Roll number</span>
              <input value={soloRoll} onChange={(e) => setSoloRoll(e.target.value)} required />
            </label>
            <button type="submit" className="btn btn-primary" disabled={busy}>
              {busy ? 'Submitting…' : 'Submit registration'}
            </button>
          </form>
        ) : (
          <form onSubmit={onSubmit} className="form-stack">
            <label className="field">
              <span>Team name</span>
              <input value={teamName} onChange={(e) => setTeamName(e.target.value)} required />
            </label>
            <p className="muted small">
              Add {event.teamSizeMin}–{event.teamSizeMax} members (one row per member). No duplicate roll numbers.
            </p>
            <div className="inline-actions" style={{ marginBottom: '0.5rem' }}>
              <button type="button" className="btn btn-ghost btn-sm" onClick={addMember} disabled={members.length >= event.teamSizeMax}>
                Add member
              </button>
            </div>
            {members.map((m, i) => (
              <div key={i} className="member-row card inner">
                <div className="member-row-head">
                  <strong>Member {i + 1}</strong>
                  {members.length > event.teamSizeMin && (
                    <button type="button" className="btn btn-ghost btn-sm" onClick={() => removeMember(i)}>
                      Remove
                    </button>
                  )}
                </div>
                <label className="field">
                  <span>Name</span>
                  <input value={m.name} onChange={(e) => updateMember(i, 'name', e.target.value)} required />
                </label>
                <label className="field">
                  <span>Roll number</span>
                  <input value={m.rollNumber} onChange={(e) => updateMember(i, 'rollNumber', e.target.value)} required />
                </label>
              </div>
            ))}
            <button type="submit" className="btn btn-primary" disabled={busy}>
              {busy ? 'Submitting…' : 'Submit team registration'}
            </button>
          </form>
        )}
      </div>
    </div>
  )
}
