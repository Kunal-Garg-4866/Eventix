import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { dutyLeavesApi, registrationsApi } from '../api/eventix.js'

function formatDate(d) {
  if (!d) return '—'
  return new Date(d).toLocaleString(undefined, { dateStyle: 'medium', timeStyle: 'short' })
}

export default function StudentDashboard() {
  const [regs, setRegs] = useState([])
  const [dls, setDls] = useState([])
  const [error, setError] = useState('')
  const [dlEvent, setDlEvent] = useState('')
  const [dlReason, setDlReason] = useState('')
  const [busy, setBusy] = useState(false)

  async function refresh() {
    setError('')
    try {
      const [r, d] = await Promise.all([registrationsApi.mine(), dutyLeavesApi.mine()])
      setRegs(r.data.registrations)
      setDls(d.data.dutyLeaves)
      if (!dlEvent && r.data.registrations[0]) {
        setDlEvent(r.data.registrations[0].event?._id || '')
      }
    } catch {
      setError('Could not load dashboard data.')
    }
  }

  useEffect(() => {
    refresh()
  }, [])

  async function submitDl(e) {
    e.preventDefault()
    setBusy(true)
    setError('')
    try {
      await dutyLeavesApi.apply({ event: dlEvent, reason: dlReason })
      setDlReason('')
      await refresh()
    } catch (err) {
      setError(err.response?.data?.message || 'Could not submit duty leave')
    } finally {
      setBusy(false)
    }
  }

  return (
    <div className="page-wide">
      <h1>Student dashboard</h1>
      <p className="muted">Your registrations and duty leave requests.</p>
      {error && <p className="form-error">{error}</p>}

      <section className="card card-pad section-block">
        <h2>Registered events</h2>
        {regs.length === 0 && <p className="muted">You have not registered for any event yet.</p>}
        <div className="table-wrap">
          <table className="table">
            <thead>
              <tr>
                <th>Event</th>
                <th>Type</th>
                <th>Participation</th>
                <th></th>
              </tr>
            </thead>
            <tbody>
              {regs.map((r) => (
                <tr key={r._id}>
                  <td>{r.event?.title}</td>
                  <td>{r.registrationType}</td>
                  <td className="muted small">
                    {r.registrationType === 'solo' ? (
                      <>
                        {r.soloParticipant?.name} ({r.soloParticipant?.rollNumber})
                      </>
                    ) : (
                      <>
                        Team: {r.teamName}
                        <br />
                        {r.teamMembers?.map((m) => (
                          <span key={m.rollNumber}>
                            {m.name} ({m.rollNumber}){' '}
                          </span>
                        ))}
                      </>
                    )}
                  </td>
                  <td>
                    <Link to={`/events/${r.event?._id}`} className="btn btn-ghost btn-sm">
                      View
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      <section className="card card-pad section-block">
        <h2>Apply for duty leave</h2>
        <p className="muted small">You may only apply for events you are registered for.</p>
        <form onSubmit={submitDl} className="form-stack" style={{ maxWidth: '32rem' }}>
          <label className="field">
            <span>Event</span>
            <select value={dlEvent} onChange={(e) => setDlEvent(e.target.value)} required>
              <option value="" disabled>
                Select event
              </option>
              {regs.map((r) => (
                <option key={r._id} value={r.event?._id}>
                  {r.event?.title}
                </option>
              ))}
            </select>
          </label>
          <label className="field">
            <span>Reason</span>
            <textarea value={dlReason} onChange={(e) => setDlReason(e.target.value)} rows={3} required />
          </label>
          <button type="submit" className="btn btn-primary" disabled={busy || regs.length === 0}>
            {busy ? 'Submitting…' : 'Submit request'}
          </button>
        </form>
      </section>

      <section className="card card-pad section-block">
        <h2>Duty leave status</h2>
        {dls.length === 0 && <p className="muted">No duty leave requests yet.</p>}
        <div className="table-wrap">
          <table className="table">
            <thead>
              <tr>
                <th>Event</th>
                <th>Reason</th>
                <th>Status</th>
                <th>Submitted</th>
              </tr>
            </thead>
            <tbody>
              {dls.map((d) => (
                <tr key={d._id}>
                  <td>{d.event?.title}</td>
                  <td className="muted small">{d.reason}</td>
                  <td>
                    <span className={`badge badge-${d.status}`}>{d.status}</span>
                  </td>
                  <td className="muted small">{formatDate(d.createdAt)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>
    </div>
  )
}
