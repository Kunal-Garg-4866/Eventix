import { Link, NavLink, useNavigate, useLocation } from 'react-router-dom'
import { useState, useEffect, useRef } from 'react'
import { useAuth } from '../context/AuthContext.jsx'
import { notificationsApi } from '../api/eventix.js'

export default function Navbar() {
  const { user, logout, isAdmin } = useAuth()
  const navigate = useNavigate()
  const location = useLocation()
  
  const [notifications, setNotifications] = useState([])
  const [showDropdown, setShowDropdown] = useState(false)
  const dropdownRef = useRef(null)

  const dashPath = isAdmin ? '/admin' : '/student'

  useEffect(() => {
    if (user) {
      notificationsApi.list().then((res) => {
        setNotifications(res.data.notifications || [])
      }).catch(console.error)
    } else {
      setNotifications([])
    }
  }, [user, location.pathname])

  useEffect(() => {
    function handleClickOutside(event) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setShowDropdown(false)
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  const unreadCount = notifications.filter(n => !n.isRead).length

  async function handleMarkRead(id) {
    try {
      await notificationsApi.markRead(id)
      setNotifications(prev => prev.map(n => n._id === id ? { ...n, isRead: true } : n))
    } catch (e) {
      console.error(e)
    }
  }

  return (
    <header className="navbar">
      <div className="navbar-inner">
        <Link to="/" className="navbar-brand">
          <span className="navbar-logo">Eventix</span>
        </Link>
        <nav className="navbar-center">
          <NavLink to="/events" className={({ isActive }) => (isActive ? 'nav-link active' : 'nav-link')}>
            Events
          </NavLink>
          <NavLink to="/societies" className={({ isActive }) => (isActive ? 'nav-link active' : 'nav-link')}>
            Societies
          </NavLink>
          {user && (
            <NavLink to={dashPath} className={({ isActive }) => (isActive ? 'nav-link active' : 'nav-link')}>
              Dashboard
            </NavLink>
          )}
        </nav>
        <div className="navbar-right">
          {!user ? (
            <>
              <Link to="/login" className="btn btn-ghost">
                Login
              </Link>
              <Link to="/signup" className="btn btn-primary">
                Sign up
              </Link>
            </>
          ) : (
            <div className="navbar-user-section">
              <div className="notification-wrapper" ref={dropdownRef}>
                <button 
                  type="button" 
                  className="btn btn-ghost icon-btn"
                  onClick={() => setShowDropdown(!showDropdown)}
                >
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"></path>
                    <path d="M13.73 21a2 2 0 0 1-3.46 0"></path>
                  </svg>
                  {unreadCount > 0 && <span className="unread-badge">{unreadCount}</span>}
                </button>
                
                {showDropdown && (
                  <div className="notification-dropdown card">
                    <div className="dropdown-header">
                      <strong>Notifications</strong>
                    </div>
                    <div className="dropdown-body">
                      {notifications.length === 0 ? (
                        <p className="muted small" style={{ padding: '1rem', textAlign: 'center' }}>No notifications</p>
                      ) : (
                        notifications.map(n => (
                          <div 
                            key={n._id} 
                            className={`notification-item ${!n.isRead ? 'unread' : ''}`}
                            onClick={() => !n.isRead && handleMarkRead(n._id)}
                          >
                            <p className="small">{n.message}</p>
                            <span className="muted tiny">{new Date(n.createdAt).toLocaleDateString()}</span>
                          </div>
                        ))
                      )}
                    </div>
                  </div>
                )}
              </div>
              <span className="navbar-user">{user.name}</span>
              <button
                type="button"
                className="btn btn-ghost"
                onClick={() => {
                  logout()
                  navigate('/')
                }}
              >
                Log out
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  )
}
