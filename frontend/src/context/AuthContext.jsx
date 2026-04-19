import { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react'
import { setAuthToken } from '../api/client.js'
import { authApi } from '../api/eventix.js'

const AuthContext = createContext(null)

const TOKEN_KEY = 'eventix_token'

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null)
  const [token, setTokenState] = useState(() => localStorage.getItem(TOKEN_KEY))
  const [loading, setLoading] = useState(true)

  const persistToken = useCallback((t) => {
    if (t) {
      localStorage.setItem(TOKEN_KEY, t)
      setAuthToken(t)
      setTokenState(t)
    } else {
      localStorage.removeItem(TOKEN_KEY)
      setAuthToken(null)
      setTokenState(null)
    }
  }, [])

  useEffect(() => {
    if (token) {
      setAuthToken(token)
      authApi
        .me()
        .then((res) => setUser(res.data.user))
        .catch(() => {
          persistToken(null)
          setUser(null)
        })
        .finally(() => setLoading(false))
    } else {
      setAuthToken(null)
      setUser(null)
      setLoading(false)
    }
  }, [token, persistToken])

  const login = useCallback(
    async (email, password) => {
      const { data } = await authApi.login({ email, password })
      persistToken(data.token)
      setUser(data.user)
      return data.user
    },
    [persistToken]
  )

  const signup = useCallback(
    async (payload) => {
      const { data } = await authApi.signup(payload)
      persistToken(data.token)
      setUser(data.user)
      return data.user
    },
    [persistToken]
  )

  const logout = useCallback(() => {
    persistToken(null)
    setUser(null)
  }, [persistToken])

  const refreshUser = useCallback(async () => {
    const { data } = await authApi.me()
    setUser(data.user)
    return data.user
  }, [])

  const value = useMemo(
    () => ({
      user,
      token,
      loading,
      login,
      signup,
      logout,
      refreshUser,
      isStudent: user?.role === 'student',
      isAdmin: user?.role === 'society_admin',
    }),
    [user, token, loading, login, signup, logout, refreshUser]
  )

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export function useAuth() {
  const ctx = useContext(AuthContext)
  if (!ctx) throw new Error('useAuth must be used within AuthProvider')
  return ctx
}
