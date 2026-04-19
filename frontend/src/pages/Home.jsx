import { Link } from 'react-router-dom'
import { demoEvents, demoSocieties, featuredTracks, homepageHighlights, homepageStats } from '../data/demoContent.js'

const HERO_IMG =
  'https://images.unsplash.com/photo-1497366216548-37526070297c?auto=format&fit=crop&w=1600&q=80'

export default function Home() {
  const featuredEvents = demoEvents.slice(0, 3)
  const featuredSocieties = demoSocieties.slice(0, 4)

  return (
    <div>
      <section className="hero">
        <div className="hero-image-wrap">
          <img src={HERO_IMG} alt="Professional workspace" className="hero-image" />
        </div>
        <div className="hero-copy">
          <h1>Eventix</h1>
          <p className="hero-subtitle">Unified society and event management for your campus.</p>
          <p className="hero-text">
            Coordinate societies, publish events, manage registrations and teams, and process duty leave in one
            streamlined platform built for students and society administrators.
          </p>
          <div className="hero-stats">
            {homepageStats.map((item) => (
              <div key={item.label} className="stat-box">
                <strong>{item.value}</strong>
                <span>{item.label}</span>
              </div>
            ))}
          </div>
          <div className="hero-actions">
            <Link to="/events" className="btn btn-primary">
              Browse events
            </Link>
            <Link to="/signup" className="btn btn-secondary">
              Get started
            </Link>
          </div>
        </div>
      </section>

      <section className="section">
        <div className="page-wide">
          <h2 className="section-title">What you can do</h2>
          <div className="grid-3">
            <article className="card card-pad">
              <h3>Students</h3>
              <p className="muted">
                Discover events, register solo or as a team, track participation, and apply for duty leave.
              </p>
            </article>
            <article className="card card-pad">
              <h3>Society admins</h3>
              <p className="muted">
                Maintain your society profile, create and manage events, review registrations, and approve DL requests.
              </p>
            </article>
            <article className="card card-pad">
              <h3>Operations</h3>
              <p className="muted">
                Role-based access, JWT-secured APIs, and clear audit trails for registrations and approvals.
              </p>
            </article>
          </div>
        </div>
      </section>

      <section className="section">
        <div className="page-wide">
          <div className="section-header">
            <div>
              <h2 className="section-title">Featured societies</h2>
              <p className="muted">A glimpse of active communities students can engage with on Eventix.</p>
            </div>
            <Link to="/societies" className="btn btn-ghost">
              View all societies
            </Link>
          </div>
          <div className="grid-4">
            {featuredSocieties.map((society) => (
              <article key={society._id} className="card card-pad feature-card">
                <img src={society.logo} alt="" className="feature-logo" />
                <p className="eyebrow">{society.category}</p>
                <h3>{society.name}</h3>
                <p className="muted small">{society.description}</p>
                <div className="mini-stats">
                  <span>{society.members} members</span>
                  <span>{society.eventsHosted} events</span>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="section">
        <div className="page-wide split-showcase">
          <div className="card card-pad">
            <h2 className="section-title">Popular event tracks</h2>
            <div className="list-stack">
              {featuredTracks.map((track) => (
                <div key={track} className="track-row">
                  <span className="track-dot" />
                  <span>{track}</span>
                </div>
              ))}
            </div>
          </div>
          <div className="card card-pad">
            <h2 className="section-title">Why Eventix feels complete</h2>
            <div className="list-stack">
              {homepageHighlights.map((item) => (
                <div key={item.title} className="content-block">
                  <h3>{item.title}</h3>
                  <p className="muted">{item.text}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section className="section">
        <div className="page-wide">
          <div className="section-header">
            <div>
              <h2 className="section-title">Featured events</h2>
              <p className="muted">Professional-looking demo content makes the platform feel active from first load.</p>
            </div>
            <Link to="/events" className="btn btn-secondary">
              Explore all events
            </Link>
          </div>
          <div className="event-grid">
            {featuredEvents.map((event) => (
              <article key={event._id} className="card card-pad event-card">
                <div className="event-thumb">
                  <img src={event.image} alt="" />
                </div>
                <p className="eyebrow">{event.society.name}</p>
                <h3>{event.title}</h3>
                <p className="muted small">{event.description}</p>
                <p className="event-meta" style={{ marginTop: '0.75rem' }}>
                  <span className="badge">{event.eventType}</span>
                  <span className="badge badge-neutral">{event.status}</span>
                </p>
              </article>
            ))}
          </div>
        </div>
      </section>
    </div>
  )
}
