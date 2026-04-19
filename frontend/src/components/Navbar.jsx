import { Link, NavLink, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext.jsx'

export default function Navbar() {
  const { user, logout, isAdmin } = useAuth()
  const navigate = useNavigate()

  const dashPath = isAdmin ? '/admin' : '/student'

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
            <>
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
            </>
          )}
        </div>
      </div>
    </header>
  )
}
