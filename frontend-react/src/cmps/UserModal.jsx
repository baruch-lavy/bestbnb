import React from 'react'
import { Link, useNavigate } from 'react-router-dom'

export const UserModal = ({ isOpen, onClose }) => {
  const navigate = useNavigate()
  
  if (!isOpen) return null

  const handleDashboardClick = () => {
    onClose()
    navigate('/dashboard')
  }

  return (
    <div className="user-modal">
      <div className="modal-content">
        <div className="modal-links">
          <Link to="/login" className="modal-link" onClick={onClose}>Login</Link>
          <Link to="/signup" className="modal-link" onClick={onClose}>Signup</Link>
          <div className="modal-link" onClick={handleDashboardClick}>Dashboard</div>
        </div>
      </div>
    </div>
  )
};