import React, { useEffect } from 'react';

export function OrderStatusModal({ order, onClose }) {
  useEffect(() => {
    const timer = setTimeout(() => {
      onClose();
    }, 300000);

    return () => clearTimeout(timer);
  }, [onClose]);

  const getStatusMessage = () => {
    switch (order.status) {
      case 'approved':
        return 'Your reservation has been approved!';
      case 'rejected':
        return 'Your reservation has been rejected';
      case 'cancelled':
        return 'Your reservation has been cancelled';
      default:
        return 'Reservation status updated';
    }
  };

  return (
    <div className={`status-modal ${order.status}`}>
      <div className="modal-content">
        <h3>{getStatusMessage()}</h3>
        <p>{order.stay.name}</p>
        <p className="dates">{order.startDate} - {order.endDate}</p>
      </div>
    </div>
  );
} 