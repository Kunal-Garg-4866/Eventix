import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { eventsApi } from '../api/eventix.js'
import { demoEvents } from '../data/demoContent.js'

function formatDate(d) {
  if (!d) return '—'
  return new Date(d).toLocaleString(undefined, { dateStyle: 'medium', timeStyle: 'short' })
}

export default function Events() {
  const [events, setEvents] = useState([])
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    eventsApi
      .list()
      .then((res) => {
        const liveEvents = res.data.events || []
        setEvents(liveEvents.length > 0 ? liveEvents : demoEvents)
      })
      .catch(() => setError('Could not load events. Is the API running?'))
      .finally(() => setLoading(false))
  }, [])

  const displayEvents = events.length > 0 ? events : demoEvents
  const featuredCount = displayEvents.filter((event) => event.status !== 'completed').length

  return (
    <div className="page-wide">
      <section className="page-hero card card-pad">
        <div>
          <p className="eyebrow">Campus event discovery</p>
          <h1>Events</h1>
          <p className="muted">
            Browse hackathons, symposiums, coding contests, workshops, robotics battles, speaker sessions, and more.
          </p>
        </div>
        <div className="hero-stats compact">
          <div className="stat-box">
            <strong>{displayEvents.length}</strong>
            <span>Total events</span>
          </div>
          <div className="stat-box">
            <strong>{featuredCount}</strong>
            <span>Open for participation</span>
          </div>
          <div className="stat-box">
            <strong>6+</strong>
            <span>Society categories</span>
          </div>
        </div>
      </section>
      {loading && <p className="muted">Loading…</p>}
      {error && <p className="form-error">{error}. Showing curated sample events below.</p>}
      {!loading && (
        <div className="event-grid">
          {displayEvents.map((ev) => (
            <article key={ev._id} className="card card-pad event-card">
              {ev.image ? (
                <div className="event-thumb">
                  <img src={ev.image} alt="" />
                </div>
              ) : (
                <div className="event-thumb placeholder" />
              )}
              {ev.society?.category && <p className="eyebrow">{ev.society.category}</p>}
              <h2>{ev.title}</h2>
              <p className="muted small">{ev.society?.name}</p>
              <p className="muted small">{ev.description}</p>
              <p className="event-meta">
                <span className="badge">{ev.eventType}</span>
                <span className="badge badge-neutral">{ev.status}</span>
              </p>
              <p className="muted small">{formatDate(ev.date)}</p>
              {ev.venue && <p className="muted small">Venue: {ev.venue}</p>}
              <Link to={`/events/${ev._id}`} className="btn btn-secondary" style={{ marginTop: '0.75rem' }}>
                View details
              </Link>
            </article>
          ))}
        </div>
      )}
    </div>
  )
}
