import React, { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { FaUserCircle, FaGoogle, FaFacebook } from 'react-icons/fa'
import { userService } from '../services/user.service'
import { login, signup } from '../store/actions/user.actions'

export const UserModal = ({ isOpen, onClose }) => {
  const navigate = useNavigate()
  const [showAuthModal, setShowAuthModal] = useState(false)
  const [isLoginMode, setIsLoginMode] = useState(true)
  const [credentials, setCredentials] = useState({ username: '', password: '', fullname: '' })
  const [users, setUsers] = useState([])

  useEffect(() => {
    loadUsers()
  }, [])

  async function loadUsers() {
    const users = await userService.getUsers()
    setUsers(users)
  }

  const handleDashboardClick = () => {
    onClose()
    navigate('/dashboard')
  }

  const handleAuthClick = (type) => {
    setIsLoginMode(type === 'login')
    setShowAuthModal(true)
  }

  async function handleSubmit(ev) {
    ev.preventDefault()
    if (!credentials.username) return

    try {
      if (isLoginMode) {
        await login(credentials)
      } else {
        await signup(credentials)
      }
      setShowAuthModal(false)
      onClose()
    } catch (err) {
      console.error('Failed to authenticate:', err)
    }
  }

  function handleChange(ev) {
    const field = ev.target.name
    const value = ev.target.value
    setCredentials({ ...credentials, [field]: value })
  }

  const handleOverlayClick = (ev) => {
    ev.stopPropagation()
    setShowAuthModal(false)
  }

  if (!isOpen && !showAuthModal) return null

  return (
    <>
      {/* Menu Modal */}
      {isOpen && (
        <div className="user-menu-modal">
          <div className="modal-links">
            <button className="modal-link" onClick={() => handleAuthClick('login')}>
              Login
            </button>
            <button className="modal-link" onClick={() => handleAuthClick('signup')}>
              Signup
            </button>
            <button className="modal-link" onClick={handleDashboardClick}>
              Dashboard
            </button>
            <button className="close-btn" onClick={() => setShowAuthModal(false)}>×</button>

          </div>
        </div>
      )}

      {/* Auth Modal */}
      {showAuthModal && (
        <div className="modal-overlay" onClick={handleOverlayClick}>
          <div className="auth-modal" onClick={e => e.stopPropagation()}>
            <button className="close-btn" onClick={() => setShowAuthModal(false)}>×</button>
            
            <div className="modal-header">
              <h2>{isLoginMode ? 'Log in' : 'Sign up'}</h2>
            </div>

            <div className="modal-content">
              <h3>Welcome to Bestbnb</h3>
              
              <form onSubmit={handleSubmit}>
                {isLoginMode ? (
                  <select
                    name="username"
                    value={credentials.username}
                    onChange={handleChange}
                    required>
                    <option value="">Choose your account</option>
                    {users.map(user => 
                      <option key={user._id} value={user.username}>
                        {user.fullname}
                      </option>
                    )}
                  </select>
                ) : (
                  <>
                    <input
                      type="text"
                      name="fullname"
                      placeholder="Full name"
                      value={credentials.fullname}
                      onChange={handleChange}
                      required
                    />
                    <input
                      type="text"
                      name="username"
                      placeholder="Username"
                      value={credentials.username}
                      onChange={handleChange}
                      required
                    />
                    <input
                      type="password"
                      name="password"
                      placeholder="Password"
                      value={credentials.password}
                      onChange={handleChange}
                      required
                    />
                  </>
                )}

                <button className="primary-btn" disabled={!credentials.username}>
                  Continue
                </button>
              </form>

              <div className="or-divider">
                <span>or</span>
              </div>

              <div className="social-buttons">
                <button className="social-btn">
                  <FaGoogle /> Continue with Google
                </button>
                <button className="social-btn">
                  <FaFacebook /> Continue with Facebook
                </button>
              </div>

              {isLoginMode && (
                <button className="guest-btn">
                  <FaUserCircle /> Continue as Guest
                </button>
              )}

              <div className="modal-footer">
                <p>
                  {isLoginMode ? "Don't have an account? " : "Already have an account? "}
                  <button 
                    className="switch-mode-btn"
                    onClick={() => setIsLoginMode(!isLoginMode)}>
                    {isLoginMode ? 'Sign up' : 'Log in'}
                  </button>
                </p>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  )
}