import { useState, useEffect } from 'react'
import { orderService } from '../services/order/order.service.local'
import { showErrorMsg } from '../services/event-bus.service'
import { FaTrash } from 'react-icons/fa'

export function Trips() {
  const [orders, setOrders] = useState([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    loadOrders()
  }, [])

  async function loadOrders() {
    try {
      const orders = await orderService.getOrdersByBuyer()
      console.log('Loaded orders in Trips:', orders)
      setOrders(orders)
    } catch (err) {
      console.error('Failed to load orders:', err)
      setError(err.message)
    } finally {
      setIsLoading(false)
    }
  }

  async function onRemoveOrder(orderId) {
    try {
      await orderService.remove(orderId)
      setOrders(orders.filter(order => order._id !== orderId))
    } catch (err) {
      console.error('Failed to remove order:', err)
      showErrorMsg('Failed to remove order')
    }
  }

  if (isLoading) return <div>Loading...</div>
  if (error) return <div>Error: {error}</div>
  if (!orders.length) return <div className="no-trips">No trips booked yet</div>

  return (
    <section className="trips-page">
      <h1>Your trips</h1>
      
      <div className="orders-table">
        <table>
          <thead>
            <tr>
              <th>Stay</th>
              <th>Dates</th>
              <th>Guests</th>
              <th>Total Price</th>
              <th>Status</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {orders.map(order => (
              <tr key={order._id}>
                <td>
                  <div className="stay-info">
                    <img src={order.stay.imgUrls[0]} alt={order.stay.name} />
                    <div>
                      <h3>{order.stay.name}</h3>
                      <p>{order.stay.loc.city}, {order.stay.loc.country}</p>
                    </div>
                  </div>
                </td>
                <td>
                  {new Date(order.startDate).toLocaleDateString()} - 
                  {new Date(order.endDate).toLocaleDateString()}
                </td>
                <td>{order.guests.adults + order.guests.children} guests</td>
                <td>${order.totalPrice}</td>
                <td>
                  <span className={`status ${order.status}`}>
                    {order.status}
                  </span>
                </td>
                <td>
                  <button 
                    className="remove-btn"
                    onClick={() => onRemoveOrder(order._id)}
                  >
                    <FaTrash />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </section>
  )
} 