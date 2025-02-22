import { useState, useEffect } from 'react'
import { orderService } from '../services/order/order.service.local'
import { showErrorMsg } from '../services/event-bus.service'
import { FaTrash } from 'react-icons/fa'
import { Loading } from '../cmps/Loading'

export function Trips() {
  const [orders, setOrders] = useState([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    loadOrders()
  }, [])

  async function loadOrders() {
    try {
      const orders = await orderService.getOrdersByBuyer()
      setOrders(orders)
    } catch (err) {
      console.error('Failed to load orders:', err)
      showErrorMsg('Failed to load orders')
    } finally {
      setIsLoading(false)
    }
  }

  async function onRemoveOrder(orderId) {
    try {
      await orderService.updateOrderStatus(orderId, 'cancelled')
      setOrders(orders.map(order => 
        order._id === orderId 
          ? { ...order, status: 'cancelled' }
          : order
      ))
    } catch (err) {
      console.error('Failed to cancel order:', err)
      showErrorMsg('Failed to cancel order')
    }
  }

  if (isLoading) return < Loading />

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
                    <img src={order.stay.imgUrl || '/img/stays/default.jpg'} alt={order.stay.name} />
                    <div>
                      <h3>{order.stay.name}</h3>
                      <p>{order.stay.city || ''}, {order.stay.country || ''}</p>
                    </div>
                  </div>
                </td>
                <td>
                  {order.startDate} - {order.endDate}
                </td>
                <td>
                  {(order.guests?.adults || 0) + (order.guests?.children || 0)} guests
                </td>
                <td>${order.totalPrice}</td>
                <td>
                  <span className={`status ${order.status}`}>
                    {order.status}
                  </span>
                </td>
                <td>
                  <button 
                    className="cancel-btn"
                    onClick={() => onRemoveOrder(order._id)}
                    disabled={order.status === 'cancelled'}
                  >
                    {order.status === 'cancelled' ? 'Cancelled' : 'Cancel Order'}
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