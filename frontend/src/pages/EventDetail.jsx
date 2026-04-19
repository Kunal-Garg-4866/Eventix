import { useEffect, useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import { eventsApi } from '../api/eventix.js'
import { useAuth } from '../context/AuthContext.jsx'
import { demoEvents } from '../data/demoContent.js'

function formatDate(d) {
  if (!d) return '—'
  return new Date(d).toLocaleString(undefined, { dateStyle: 'medium', timeStyle: 'short' })
}

export default function EventDetail() {
  const { id } = useParams()
  const { user, isStudent } = useAuth()
  const [event, setEvent] = useState(null)
  const [error, setError] = useState('')

  useEffect(() => {
    eventsApi
      .get(id)
      .then((res) => setEvent(res.data.event))
      .catch(() => {
        const fallback = demoEvents.find((item) => item._id === id)
        if (fallback) {
          setEvent(fallback)
          setError('')
        } else {
          setError('Event not found or API unavailable.')
        }
      })
  }, [id])

  if (error) {
    return (
      <div className="page-narrow">
        <p className="form-error">{error}</p>
        <Link to="/events">Back to events</Link>
      </div>
    )
  }

  if (!event) {
    return (
      <div className="page-narrow">
        <p className="muted">Loading…</p>
      </div>
    )
  }

  return (
    <div className="page-wide">
      <Link to="/events" className="back-link">
        ← All events
      </Link>
      <div className="detail-layout">
        <div>
          {event.image ? (
            <div className="detail-image">
              <img src={event.image} alt="" />
            </div>
          ) : (
            <div className="detail-image placeholder" />
          )}
        </div>
        <div className="card card-pad">
          <h1>{event.title}</h1>
          <p className="muted">{event.society?.name}</p>
          <p className="event-meta" style={{ marginTop: '0.5rem' }}>
            <span className="badge">{event.eventType}</span>
            <span className="badge badge-neutral">{event.status}</span>
          </p>
          <p style={{ marginTop: '1rem' }}>{event.description || 'No description provided.'}</p>
          <dl className="dl-grid">
            <div>
              <dt>Date</dt>
              <dd>{formatDate(event.date)}</dd>
            </div>
            {event.venue && (
              <div>
                <dt>Venue</dt>
                <dd>{event.venue}</dd>
              </div>
            )}
            {event.eventType === 'team' && (
              <div>
                <dt>Team size</dt>
                <dd>
                  {event.teamSizeMin} – {event.teamSizeMax} members
                </dd>
              </div>
            )}
          </dl>
          {user && isStudent && (
            <Link to={`/events/${event._id}/register`} className="btn btn-primary" style={{ marginTop: '1rem' }}>
              Register
            </Link>
          )}
          {!user && (
            <p className="muted" style={{ marginTop: '1rem' }}>
              <Link to="/login">Login</Link> as a student to register.
            </p>
          )}
        </div>
      </div>
    </div>
  )
}
