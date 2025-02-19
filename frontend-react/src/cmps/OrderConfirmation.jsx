import React from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import { FaCheck } from 'react-icons/fa'

export const OrderConfirmation = () => {
  const location = useLocation()
  const navigate = useNavigate()
  const { stay, dates, guests } = location.state || {}

  if (!stay) {
    navigate('/')
    return null
  }

  return (
    <div className="confirmation-container">
      <div className="confirmation-card">
        <div className="success-icon">
          <FaCheck />
        </div>
        <h1>Your reservation is confirmed</h1>
        <p>You're going to {stay}</p>

        <div className="confirmation-details">
          <div className="detail-item">
            <h3>Dates</h3>
            <p>{dates}</p>
          </div>
          <div className="detail-item">
            <h3>Guests</h3>
            <p>{guests}</p>
          </div>
        </div>

        <div className="confirmation-actions">
          <button 
            className="primary-btn"
            onClick={() => navigate('/dashboard')}
          >
            View your trips
          </button>
          <button 
            className="secondary-btn"
            onClick={() => navigate('/chat')}
          >
            Message host
          </button>
        </div>
      </div>
    </div>
  )
} 