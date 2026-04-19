import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext.jsx'

export default function Signup() {
  const { signup } = useAuth()
  const navigate = useNavigate()

  const [form, setForm] = useState({
    name: '',
    email: '',
    rollNumber: '',
    password: '',
    role: 'student',
  })
  const [error, setError] = useState('')
  const [busy, setBusy] = useState(false)

  function setField(key, value) {
    setForm((f) => ({ ...f, [key]: value }))
  }

  async function onSubmit(e) {
    e.preventDefault()
    setError('')
    setBusy(true)
    try {
      const u = await signup(form)
      if (u.role === 'society_admin') navigate('/admin', { replace: true })
      else navigate('/student', { replace: true })
    } catch (err) {
      setError(err.response?.data?.message || 'Signup failed')
    } finally {
      setBusy(false)
    }
  }

  return (
    <div className="page-narrow">
      <div className="card card-pad">
        <h1>Create account</h1>
        <p className="muted">Register as a student or society administrator.</p>
        {error && <p className="form-error">{error}</p>}
        <form onSubmit={onSubmit} className="form-stack">
          <label className="field">
            <span>Full name</span>
            <input value={form.name} onChange={(e) => setField('name', e.target.value)} required />
          </label>
          <label className="field">
            <span>Email</span>
            <input type="email" value={form.email} onChange={(e) => setField('email', e.target.value)} required />
          </label>
          <label className="field">
            <span>Roll number</span>
            <input value={form.rollNumber} onChange={(e) => setField('rollNumber', e.target.value)} required />
          </label>
          <label className="field">
            <span>Password</span>
            <input
              type="password"
              value={form.password}
              onChange={(e) => setField('password', e.target.value)}
              required
              minLength={6}
            />
          </label>
          <label className="field">
            <span>Role</span>
            <select value={form.role} onChange={(e) => setField('role', e.target.value)}>
              <option value="student">Student</option>
              <option value="society_admin">Society Admin</option>
            </select>
          </label>
          <button type="submit" className="btn btn-primary" disabled={busy}>
            {busy ? 'Creating…' : 'Create account'}
          </button>
        </form>
        <p className="muted" style={{ marginTop: '1rem' }}>
          Already registered? <Link to="/login">Login</Link>
        </p>
      </div>
    </div>
  )
}
