import React, { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { FaUserCircle, FaGoogle, FaFacebook } from 'react-icons/fa'
import { userService } from '../services/user.service'
import { login, signup } from '../store/actions/user.actions'

export const UserModal = ({ isOpen, onClose }) => {
  const navigate = useNavigate()
  const [showAuthModal, setShowAuthModal] = useState(false)
  const [isLoginMode, setIsLoginMode] = useState(true)
  const [credentials, setCredentials] = useState({ 
    username: '', 
    password: '', 
    fullname: '',
    email: '',
    phone: '',
    address: ''
  })
  const [users, setUsers] = useState([])
  const [isClosing, setIsClosing] = useState(false)

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

  const handleModeSwitch = () => {
    setIsLoginMode(!isLoginMode)
  }

  const closeWithAnimation = () => {
    setIsClosing(true)
    setTimeout(() => {
      setIsClosing(false)
      setShowAuthModal(false)
      setCredentials({ username: '', password: '', fullname: '', email: '', phone: '', address: '' })
      onClose()
    }, 300)
  }

  const handleSocialLogin = (provider) => {
    closeWithAnimation()
  }

  const handleGuestLogin = () => {
    closeWithAnimation()
  }

  async function handleSubmit(ev) {
    ev.preventDefault()
    if (!credentials.username) return

    try {
        let user
        if (isLoginMode) {
            user = await login(credentials)
        } else {
            user = await signup(credentials)
        }
        console.log('Logged in user:', user)
        
        if (user) {
            closeWithAnimation()
            window.location.reload()
        }
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
              Log in
            </button>
            <button className="modal-link enrollment" onClick={() => handleAuthClick('signup')}>
              Sign up
            </button>
            <button className="modal-link" onClick={handleDashboardClick}>
              Dashboard
            </button>
            <button className="modal-link" onClick={() => {
              onClose()
              navigate('/trips')
            }}>
              Trips
            </button>
          </div>
        </div>
      )}

      {/* Auth Modal */}
      {showAuthModal && (
        <div className="modal-overlay" onClick={handleOverlayClick}>
          <div 
            className={`auth-modal ${isClosing ? 'closing' : ''}`} 
            onClick={e => e.stopPropagation()}
          >
            <div className="modal-header">
              <h2>{isLoginMode ? 'Log in' : 'Sign up'}</h2>
              <button className="close-btn" onClick={() => setShowAuthModal(false)}>×</button>
            </div>

            <div className="modal-content">
              <h3>Welcome to Bestbnb</h3>
              
              <form onSubmit={handleSubmit}>
                {!isLoginMode && (
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
                      type="email"
                      name="email"
                      placeholder="Email"
                      value={credentials.email}
                      onChange={handleChange}
                      required
                    />
                    <input
                      type="tel"
                      name="phone"
                      placeholder="Phone number"
                      value={credentials.phone}
                      onChange={handleChange}
                      required
                    />
                    <input
                      type="text"
                      name="address"
                      placeholder="Address"
                      value={credentials.address}
                      onChange={handleChange}
                      required
                    />
                  </>
                )}
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

                <button 
                  className="primary-btn" 
                  disabled={!credentials.username || (!isLoginMode && !(credentials.fullname && credentials.email && credentials.phone && credentials.address))}
                >
                  Continue
                </button>
              </form>

              <div className="or-divider">
                <span>or</span>
              </div>

              <div className="social-buttons">
                <button 
                  type="button"
                  className="social-btn"
                  onClick={() => handleSocialLogin('Google')}>
                  <FaGoogle /> Continue with Google
                </button>
                <button 
                  type="button"
                  className="social-btn"
                  onClick={() => handleSocialLogin('Facebook')}>
                  <FaFacebook /> Continue with Facebook
                </button>
              </div>

              {isLoginMode && (
                <button 
                  type="button"
                  className="guest-btn"
                  onClick={handleGuestLogin}>
                  <FaUserCircle /> Continue as Guest
                </button>
              )}

              <div className="modal-footer">
                <p>
                  {isLoginMode ? "Don't have an account? " : "Already have an account? "}
                  <button 
                    className="switch-mode-btn"
                    onClick={handleModeSwitch}>
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