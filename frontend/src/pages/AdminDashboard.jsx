import { useEffect, useState } from 'react'
import { dutyLeavesApi, eventsApi, registrationsApi, societiesApi } from '../api/eventix.js'

function formatDate(d) {
  if (!d) return '—'
  return new Date(d).toLocaleString(undefined, { dateStyle: 'medium', timeStyle: 'short' })
}

const emptyEvent = {
  title: '',
  description: '',
  eventType: 'solo',
  teamSizeMin: 2,
  teamSizeMax: 4,
  date: '',
  status: 'upcoming',
  image: '',
}

export default function AdminDashboard() {
  const [society, setSociety] = useState(null)
  const [socForm, setSocForm] = useState({ name: '', description: '', logo: '' })
  const [events, setEvents] = useState([])
  const [eventForm, setEventForm] = useState(emptyEvent)
  const [editingId, setEditingId] = useState(null)
  const [regs, setRegs] = useState([])
  const [regEventId, setRegEventId] = useState('')
  const [dls, setDls] = useState([])
  const [message, setMessage] = useState('')
  const [error, setError] = useState('')

  async function loadSociety() {
    try {
      const res = await societiesApi.mine()
      setSociety(res.data.society)
      const s = res.data.society
      setSocForm({ name: s.name, description: s.description, logo: s.logo || '' })
    } catch (e) {
      if (e.response?.status === 404) {
        setSociety(null)
      }
    }
  }

  async function loadEvents() {
    const res = await eventsApi.managed()
    setEvents(res.data.events)
    if (!regEventId && res.data.events[0]) setRegEventId(res.data.events[0]._id)
  }

  async function loadDuty() {
    const res = await dutyLeavesApi.society()
    setDls(res.data.dutyLeaves)
  }

  async function refresh() {
    setError('')
    setMessage('')
    try {
      await loadSociety()
      await loadEvents()
      await loadDuty()
    } catch (e) {
      setError(e.response?.data?.message || 'Failed to load admin data')
    }
  }

  useEffect(() => {
    refresh()
  }, [])

  async function saveSociety(e) {
    e.preventDefault()
    setError('')
    setMessage('')
    try {
      if (society) {
        await societiesApi.updateMine(socForm)
        setMessage('Society profile updated.')
      } else {
        await societiesApi.create(socForm)
        setMessage('Society created.')
      }
      await loadSociety()
      await loadEvents()
    } catch (e) {
      setError(e.response?.data?.message || 'Could not save society')
    }
  }

  async function saveEvent(e) {
    e.preventDefault()
    setError('')
    setMessage('')
    try {
      if (editingId) {
        await eventsApi.update(editingId, eventForm)
        setMessage('Event updated.')
      } else {
        await eventsApi.create(eventForm)
        setMessage('Event created.')
      }
      setEventForm(emptyEvent)
      setEditingId(null)
      await loadEvents()
    } catch (e) {
      setError(e.response?.data?.message || 'Could not save event')
    }
  }

  function startEdit(ev) {
    setEditingId(ev._id)
    setEventForm({
      title: ev.title,
      description: ev.description,
      eventType: ev.eventType,
      teamSizeMin: ev.teamSizeMin,
      teamSizeMax: ev.teamSizeMax,
      date: ev.date ? new Date(ev.date).toISOString().slice(0, 16) : '',
      status: ev.status,
      image: ev.image || '',
    })
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  async function removeEvent(id) {
    if (!window.confirm('Delete this event?')) return
    await eventsApi.remove(id)
    setMessage('Event deleted.')
    await loadEvents()
  }

  async function loadRegs() {
    if (!regEventId) return
    const res = await registrationsApi.forEvent(regEventId)
    setRegs(res.data.registrations)
  }

  useEffect(() => {
    if (!regEventId) {
      setRegs([])
      return
    }
    loadRegs()
  }, [regEventId])

  async function setDlStatus(id, status) {
    await dutyLeavesApi.setStatus(id, status)
    setMessage(`Duty leave ${status}.`)
    await loadDuty()
  }

  return (
    <div className="page-wide">
      <h1>Society admin dashboard</h1>
      <p className="muted">Manage your society, events, registrations, and duty leave.</p>
      {message && <p className="form-success">{message}</p>}
      {error && <p className="form-error">{error}</p>}

      <section className="card card-pad section-block">
        <h2>Society profile</h2>
        <form onSubmit={saveSociety} className="form-stack" style={{ maxWidth: '36rem' }}>
          <label className="field">
            <span>Name</span>
            <input value={socForm.name} onChange={(e) => setSocForm({ ...socForm, name: e.target.value })} required />
          </label>
          <label className="field">
            <span>Description</span>
            <textarea
              value={socForm.description}
              onChange={(e) => setSocForm({ ...socForm, description: e.target.value })}
              rows={3}
            />
          </label>
          <label className="field">
            <span>Logo URL</span>
            <input value={socForm.logo} onChange={(e) => setSocForm({ ...socForm, logo: e.target.value })} />
          </label>
          <button type="submit" className="btn btn-primary">
            {society ? 'Update society' : 'Create society'}
          </button>
        </form>
      </section>

      <section className="card card-pad section-block">
        <h2>{editingId ? 'Edit event' : 'Create event'}</h2>
        <form onSubmit={saveEvent} className="form-grid">
          <label className="field">
            <span>Title</span>
            <input value={eventForm.title} onChange={(e) => setEventForm({ ...eventForm, title: e.target.value })} required />
          </label>
          <label className="field">
            <span>Date & time</span>
            <input
              type="datetime-local"
              value={eventForm.date}
              onChange={(e) => setEventForm({ ...eventForm, date: e.target.value })}
              required
            />
          </label>
          <label className="field full">
            <span>Description</span>
            <textarea
              value={eventForm.description}
              onChange={(e) => setEventForm({ ...eventForm, description: e.target.value })}
              rows={3}
            />
          </label>
          <label className="field">
            <span>Event type</span>
            <select
              value={eventForm.eventType}
              onChange={(e) => setEventForm({ ...eventForm, eventType: e.target.value })}
            >
              <option value="solo">Solo</option>
              <option value="team">Team</option>
            </select>
          </label>
          <label className="field">
            <span>Status</span>
            <select value={eventForm.status} onChange={(e) => setEventForm({ ...eventForm, status: e.target.value })}>
              <option value="upcoming">Upcoming</option>
              <option value="ongoing">Ongoing</option>
              <option value="completed">Completed</option>
            </select>
          </label>
          {eventForm.eventType === 'team' && (
            <>
              <label className="field">
                <span>Team size min</span>
                <input
                  type="number"
                  min={2}
                  value={eventForm.teamSizeMin}
                  onChange={(e) => setEventForm({ ...eventForm, teamSizeMin: Number(e.target.value) })}
                />
              </label>
              <label className="field">
                <span>Team size max</span>
                <input
                  type="number"
                  min={2}
                  value={eventForm.teamSizeMax}
                  onChange={(e) => setEventForm({ ...eventForm, teamSizeMax: Number(e.target.value) })}
                />
              </label>
            </>
          )}
          <label className="field full">
            <span>Image URL (optional)</span>
            <input value={eventForm.image} onChange={(e) => setEventForm({ ...eventForm, image: e.target.value })} />
          </label>
          <div className="full" style={{ display: 'flex', gap: '0.5rem' }}>
            <button type="submit" className="btn btn-primary">
              {editingId ? 'Save changes' : 'Create event'}
            </button>
            {editingId && (
              <button
                type="button"
                className="btn btn-ghost"
                onClick={() => {
                  setEditingId(null)
                  setEventForm(emptyEvent)
                }}
              >
                Cancel edit
              </button>
            )}
          </div>
        </form>
      </section>

      <section className="card card-pad section-block">
        <h2>Your events</h2>
        <div className="table-wrap">
          <table className="table">
            <thead>
              <tr>
                <th>Title</th>
                <th>Type</th>
                <th>Status</th>
                <th>Date</th>
                <th></th>
              </tr>
            </thead>
            <tbody>
              {events.map((ev) => (
                <tr key={ev._id}>
                  <td>{ev.title}</td>
                  <td>{ev.eventType}</td>
                  <td>{ev.status}</td>
                  <td className="muted small">{formatDate(ev.date)}</td>
                  <td style={{ display: 'flex', gap: '0.35rem' }}>
                    <button type="button" className="btn btn-ghost btn-sm" onClick={() => startEdit(ev)}>
                      Edit
                    </button>
                    <button type="button" className="btn btn-ghost btn-sm" onClick={() => removeEvent(ev._id)}>
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      <section className="card card-pad section-block">
        <h2>Registrations & teams</h2>
        <label className="field" style={{ maxWidth: '24rem' }}>
          <span>Event</span>
          <select value={regEventId} onChange={(e) => setRegEventId(e.target.value)}>
            {events.map((ev) => (
              <option key={ev._id} value={ev._id}>
                {ev.title}
              </option>
            ))}
          </select>
        </label>
        <div className="table-wrap" style={{ marginTop: '1rem' }}>
          <table className="table">
            <thead>
              <tr>
                <th>Student</th>
                <th>Type</th>
                <th>Details</th>
              </tr>
            </thead>
            <tbody>
              {regs.map((r) => (
                <tr key={r._id}>
                  <td>
                    {r.student?.name} <span className="muted small">({r.student?.rollNumber})</span>
                  </td>
                  <td>{r.registrationType}</td>
                  <td className="muted small">
                    {r.registrationType === 'solo' ? (
                      <>
                        {r.soloParticipant?.name} — {r.soloParticipant?.rollNumber}
                      </>
                    ) : (
                      <>
                        {r.teamName}: {r.teamMembers?.map((m) => `${m.name} (${m.rollNumber})`).join(', ')}
                      </>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      <section className="card card-pad section-block">
        <h2>Duty leave approvals</h2>
        <div className="table-wrap">
          <table className="table">
            <thead>
              <tr>
                <th>Student</th>
                <th>Event</th>
                <th>Reason</th>
                <th>Status</th>
                <th></th>
              </tr>
            </thead>
            <tbody>
              {dls.map((d) => (
                <tr key={d._id}>
                  <td>
                    {d.student?.name} <span className="muted small">({d.student?.rollNumber})</span>
                  </td>
                  <td>{d.event?.title}</td>
                  <td className="muted small">{d.reason}</td>
                  <td>
                    <span className={`badge badge-${d.status}`}>{d.status}</span>
                  </td>
                  <td>
                    {d.status === 'pending' && (
                      <div style={{ display: 'flex', gap: '0.35rem' }}>
                        <button type="button" className="btn btn-primary btn-sm" onClick={() => setDlStatus(d._id, 'approved')}>
                          Approve
                        </button>
                        <button type="button" className="btn btn-ghost btn-sm" onClick={() => setDlStatus(d._id, 'rejected')}>
                          Reject
                        </button>
                      </div>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>
    </div>
  )
}
