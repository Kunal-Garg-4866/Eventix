import { useEffect, useState } from 'react'
import { societiesApi } from '../api/eventix.js'
import { demoSocieties, societyEventCatalog } from '../data/demoContent.js'

export default function Societies() {
  const [societies, setSocieties] = useState([])
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    societiesApi
      .list()
      .then((res) => {
        const liveSocieties = res.data.societies || []
        setSocieties(liveSocieties.length > 0 ? liveSocieties : demoSocieties)
      })
      .catch(() => setError('Could not load societies.'))
      .finally(() => setLoading(false))
  }, [])

  const displaySocieties = societies.length > 0 ? societies : demoSocieties

  return (
    <div className="page-wide">
      <section className="page-hero card card-pad">
        <div>
          <p className="eyebrow">Communities on campus</p>
          <h1>Societies</h1>
          <p className="muted">
            Explore active clubs and chapters including IEEE, GeeksforGeeks, Coding Ninjas, robotics, debate, and
            many more communities driving campus engagement.
          </p>
        </div>
        <div className="hero-stats compact">
          <div className="stat-box">
            <strong>{displaySocieties.length}+</strong>
            <span>Featured societies</span>
          </div>
          <div className="stat-box">
            <strong>1.5k+</strong>
            <span>Student members</span>
          </div>
          <div className="stat-box">
            <strong>90+</strong>
            <span>Hosted sessions</span>
          </div>
        </div>
      </section>
      {loading && <p className="muted">Loading…</p>}
      {error && <p className="form-error">{error}. Showing curated sample societies below.</p>}
      {!loading && (
        <div className="event-grid">
          {displaySocieties.map((s) => (
            <article key={s._id} className="card card-pad society-card">
              <div className="society-head">
                {s.logo ? <img src={s.logo} alt="" className="society-logo" /> : <div className="society-logo placeholder" />}
                <div>
                  {s.category && <p className="eyebrow">{s.category}</p>}
                  <h2>{s.name}</h2>
                  <p className="muted small">Admin: {s.admin?.name}</p>
                </div>
              </div>
              <p style={{ marginTop: '0.75rem' }}>{s.description || 'No description.'}</p>
              <div className="mini-stats" style={{ marginTop: '1rem' }}>
                <span>{s.members || 100}+ members</span>
                <span>{s.eventsHosted || 6} events</span>
              </div>
              <div style={{ marginTop: '0.85rem' }}>
                <p className="muted small" style={{ marginBottom: '0.4rem' }}>
                  Popular events
                </p>
                <div className="tag-cloud">
                  {(societyEventCatalog[s.name] || []).slice(0, 5).map((eventName) => (
                    <span key={eventName} className="tag-chip">
                      {eventName}
                    </span>
                  ))}
                </div>
              </div>
            </article>
          ))}
        </div>
      )}
    </div>
  )
}
