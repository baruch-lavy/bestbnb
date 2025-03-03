import React, { useEffect, useState } from 'react'
import { FaUsers, FaMoneyBillWave, FaExchangeAlt, FaChartLine } from 'react-icons/fa'
import { LineChart, Line, XAxis, YAxis, CartesianGrid, ResponsiveContainer } from 'recharts'
import { orderService } from '../services/order'
import { userService } from '../services/user'
import { Loading } from '../cmps/Loading'

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
  const [expandedSections, setExpandedSections] = useState({
    stats: true,
    chart: false,
    overview: false,
    orders: true
  });

  useEffect(() => {
    loadOrdersData()
  }, [])

  async function loadOrdersData() {
    try {
        console.log('🔵 Fetching host orders...')

        // ✅ Get the logged-in user
        const loggedinUser = userService.getLoggedinUser()
        if (!loggedinUser) {
            console.error('❌ No logged-in user found')
            showErrorMsg('You must be logged in')
            return
        }

        console.log(`🆔 Logged-in hostId:`, loggedinUser._id)

        // ✅ Fetch orders for this host
        const hostOrders = await orderService.getOrdersByHost(loggedinUser._id)

        console.log('✅ Orders received:', hostOrders.length)
        setOrders(hostOrders)
    } catch (err) {
        console.error('❌ Error loading orders:', err)
        showErrorMsg('Failed to load orders')
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
    { name: 'Jan w1', value: 15 },
    { name: 'Jan w2', value: 20 },
    { name: 'Jan w3', value: 18 },
    { name: 'Feb', value: 22 },
    { name: 'Feb w1', value: 5 },
    { name: 'Feb w2', value: 28 },
    { name: 'Feb w3', value: 24 },
    { name: 'Mar', value: 20 },
    { name: 'Mar w1', value: 25 },
    { name: 'Mar w2', value: 12},
    { name: 'Mar w3', value: 12 },
    { name: 'Apr', value: 23 },
    { name: 'Apr w1', value: 28 },
    { name: 'Apr w2', value: 25 },
    { name: 'Apr w3', value: 22 },
    { name: 'May', value: 15 },
    { name: 'May w1', value: 18 },
    { name: 'May w2', value: 25 },
    { name: 'May w3', value: 25 },
    { name: 'Jun', value: 22 },
    { name: 'Jun w1', value: 26 },
    { name: 'Jun w2', value: 30 },
    { name: 'Jun w3', value: 28 }
  ]

  const toggleSection = (section) => {
    setExpandedSections(prev => ({
      ...prev,
      [section]: !prev[section]
    }));
  };

  if (isLoading) return < Loading />

  return (
    <div className="dashboard-container">
      <h1>Financial & Booking Reports</h1>
      
      <div className="stats-section">
        <div 
          className={`section-header ${!expandedSections.stats ? 'collapsed' : ''}`}
          onClick={() => toggleSection('stats')}
        >
         </div>
        <div className={`section-content ${expandedSections.stats ? 'expanded' : ''}`}>
          <div className="stats-grid">
            <div className="stat-card">
              <div className="stat-content">
                <h3>Total sales</h3>
                <div className="stat-value">${1},{486},{987}</div>
                {/* <div className="stat-value">${stats.totalSales.toFixed(2)}</div> */}
                <div className="stat-change increase">+23% <span>compared to last month</span></div>
              </div>
              <div className="stat-icon">
                <FaMoneyBillWave />
              </div>
            </div>

            <div className="stat-card">
              <div className="stat-content">
                <h3>Total customers</h3>
                {/* <div className="stat-value">{stats.totalCustomers}</div> */}
                <div className="stat-value">{1},{522}</div>
                <div className="stat-change increase">+10% <span>compared to last month</span></div>
              </div>
              <div className="stat-icon">
                <FaUsers />
              </div>
            </div>

            <div className="stat-card">
              <div className="stat-content">
                <h3>Refunded</h3>
                {/* <div className="stat-value">{stats.refundedCount}</div> */}
                <div className="stat-value">{13}</div>
                <div className="stat-change decrease">-2% <span>compared to last month</span></div>
              </div>
              <div className="stat-icon">
                <FaExchangeAlt />
              </div>
            </div>

            <div className="stat-card">
              <div className="stat-content">
                <h3>Average revenue</h3>
                {/* <div className="stat-value">${stats.averageRevenue.toFixed(2)}</div> */}
                <div className="stat-value">${6},{842}</div>
                <div className="stat-change increase">+5% <span>compared to last month</span></div>
              </div>
              <div className="stat-icon">
                <FaChartLine />
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="chart-section">
        <div 
          className={`section-header ${!expandedSections.chart ? 'collapsed' : ''}`}
          onClick={() => toggleSection('chart')}
        >
          <h2>Sale statistics</h2>
        </div>
        <div className={`section-content ${expandedSections.chart ? 'expanded' : ''}`}>
          <ResponsiveContainer width="100%" height={249}>
            <LineChart data={chartData}>
              <CartesianGrid 
                strokeDasharray="3 3" 
                stroke="#e0e0e0"
                vertical={true}
                horizontal={true}
              />
              <XAxis 
                dataKey="name" 
                stroke="#666"
                tickLine={false}
                axisLine={false}
                interval={3}
                tickFormatter={(value) => value.includes('w') ? '' : value}
              />
              <YAxis 
                stroke="#666"
                tickLine={false}
                axisLine={false}
                ticks={[0, 5, 10, 15, 20, 25, 30]}
                domain={[0, 30]}
              />
              <Line 
                type="monotone" 
                dataKey="value" 
                stroke="#FF385C"
                strokeWidth={2}
                dot={{
                  fill: '#FF385C',
                  stroke: '#FF385C',
                  strokeWidth: 2,
                  r: 2
                }}
                activeDot={{
                  fill: '#FF385C',
                  stroke: '#fff',
                  strokeWidth: 2,
                  r: 4
                }}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>

      <div className="orders-section">
        <div 
          className={`section-header ${!expandedSections.orders ? 'collapsed' : ''}`}
          onClick={() => toggleSection('orders')}
        >
          <h2>Recent orders</h2>
        </div>
        <div className={`section-content ${expandedSections.orders ? 'expanded' : ''}`}>
          <table className="orders-table">
            <thead>
              <tr>
                <th>Stay</th>
                <th>Guest</th>
                <th>Dates</th>
                <th>Price</th>
                <th>Status</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {orders.slice().reverse().map(order => (
                <tr key={order._id}>
                  <td data-label="Stay">{order.stay.name}</td>
                  <td data-label="Guest">{order.guest.fullname}</td>
                  <td data-label="Dates">{`${order.startDate} - ${order.endDate}`}</td>
                  <td data-label="Price">${order.totalPrice}</td>
                  <td data-label="Status">
                    <span className={`status-badge ${order.status.toLowerCase()}`}>
                      {order.status}
                    </span>
                  </td>
                  <td data-label="Action">
                    {order.status === 'pending' && (
                      <div className="action-buttons">
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
                      </div>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <footer className="dashboard-footer-media">
      <div className="footer-bottom-media">
        <p>&copy; 2025 Bestbnb. </p>
      </div>
      </footer>
    </div>
  )
} 