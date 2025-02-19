import React, { useEffect, useState } from 'react'
import { FaUsers, FaMoneyBillWave, FaExchangeAlt, FaChartLine } from 'react-icons/fa'
import { LineChart, Line, XAxis, YAxis, CartesianGrid, ResponsiveContainer } from 'recharts'
import { orderService } from '../services/order/order.service.local'

export const Dashboard = () => {
  const [orders, setOrders] = useState([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState(null)
  const [stats, setStats] = useState({
    totalSales: 0,
    totalCustomers: 0,
    refundedCount: 0,
    averageRevenue: 0
  })

  useEffect(() => {
    loadOrdersData()
  }, [])

  const loadOrdersData = async () => {
    try {
      setIsLoading(true)
      const orders = await orderService.query()
      setOrders(orders)
      await loadStats()
    } catch (err) {
      console.error('Error loading orders:', err)
      setError('Failed to load orders')
    } finally {
      setIsLoading(false)
    }
  }

  async function loadStats() {
    try {
      const stats = await orderService.getOrderStats()
      setStats(stats)
    } catch (err) {
      console.error('Failed to load stats:', err)
    }
  }

  async function handleOrderStatus(orderId, status) {
    try {
      await orderService.updateOrderStatus(orderId, status)
      loadOrdersData() 
      loadStats()  
    } catch (err) {
      console.error('Failed to update order status:', err)
    }
  }

  const chartData = [
    { name: 'Jan', value: 10 },
    { name: 'Feb', value: 15 },
    { name: 'Mar', value: 12 },
    { name: 'Apr', value: 18 },
    { name: 'May', value: 14 },
    { name: 'Jun', value: 16 }
  ]

  if (isLoading) return <div>Loading...</div>
  if (error) return <div>Error: {error}</div>
  if (!orders.length) return <div>No orders found</div>

  return (
    <div className="dashboard-container">
      <h1>Review & analyze your data</h1>
      
      <div className="stats-grid">
        <div className="stat-card">
          <div className="stat-content">
            <h3>Total sales</h3>
            <div className="stat-value">${700}</div>
            {/* <div className="stat-value">${stats.totalSales.toFixed(2)}</div> */}
            <div className="stat-change decrease">-5% <span>compared to last month</span></div>
          </div>
          <div className="stat-icon">
            <FaMoneyBillWave />
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-content">
            <h3>Total customers</h3>
            <div className="stat-value">{stats.totalCustomers}</div>
            <div className="stat-change increase">+10% <span>compared to last month</span></div>
          </div>
          <div className="stat-icon">
            <FaUsers />
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-content">
            <h3>Refunded</h3>
            <div className="stat-value">{stats.refundedCount}</div>
            <div className="stat-change decrease">-2% <span>compared to last month</span></div>
          </div>
          <div className="stat-icon">
            <FaExchangeAlt />
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-content">
            <h3>Average revenue</h3>
            <div className="stat-value">${stats.averageRevenue.toFixed(2)}</div>
            <div className="stat-change increase">+5% <span>compared to last month</span></div>
          </div>
          <div className="stat-icon">
            <FaChartLine />
          </div>
        </div>
      </div>

      <div className="dashboard-grid">
        <div className="chart-section">
          <h2>Sale statistics</h2>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={chartData}>
            <CartesianGrid strokeDasharray="3 3" stroke="#e0e0e0" />
            <XAxis dataKey="name" stroke="#666" />
            <YAxis stroke="#666" />
            <Line 
              type="monotone" 
              dataKey="value" 
              stroke="#FF385C"
              strokeWidth={2}
              dot={{
                fill: '#FF385C',
                stroke: '#FF385C',
                strokeWidth: 2,
                r: 4
              }}

              activeDot={{
                fill: '#FF385C',
                stroke: '#fff',
                strokeWidth: 2,
                r: 6
              }}
            />
            </LineChart>
          </ResponsiveContainer>
        </div>

        <div className="overview-section">
          <h2>Overview</h2>
          <div className="overview-stats">
            <div className="overview-item">
              <span>Stays in list</span>
              <span>{orders.length}</span>
            </div>
            <div className="overview-item">
              <span>Total orders</span>
              <span>{orders.length}</span>
            </div>
            <div className="overview-item">
              <span>Refunded</span>
              <span>{stats.refundedCount}</span>
            </div>
            <div className="overview-item">
              <span>Average revenue</span>
              <span>${stats.averageRevenue.toFixed(2)}</span>
            </div>
          </div>
        </div>
      </div>

      <div className="orders-section">
        <h2>Recent orders</h2>
        <table className="orders-table">
          <thead>
            <tr>
              <th>Order ID</th>
              <th>Stay</th>
              <th>Guest</th>
              <th>Dates</th>
              <th>Price</th>
              <th>Status</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {orders.map(order => (
              <tr key={order._id}>
                <td>{order._id}</td>
                <td>{order.stay.name}</td>
                <td>{order.guest.fullname}</td>
                <td>{`${order.startDate} - ${order.endDate}`}</td>
                <td>${order.totalPrice}</td>
                <td>
                  <span className={`status-badge ${order.status.toLowerCase()}`}>
                    {order.status}
                  </span>
                </td>
                <td>
                  {order.status === 'pending' && (
                    <>
                      <button 
                        className="btn-approve"
                        onClick={() => handleOrderStatus(order._id, 'approved')}
                      >
                        Approve
                      </button>
                      <button 
                        className="btn-reject"
                        onClick={() => handleOrderStatus(order._id, 'rejected')}
                      >
                        Reject
                      </button>
                    </>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
} 