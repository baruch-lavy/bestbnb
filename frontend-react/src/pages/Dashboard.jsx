import React from 'react'
import { FaUsers, FaMoneyBillWave, FaExchangeAlt, FaChartLine } from 'react-icons/fa'
import { LineChart, Line, XAxis, YAxis, CartesianGrid, ResponsiveContainer } from 'recharts'

export const Dashboard = () => {
  const chartData = [
    { name: 'Jan', value: 10 },
    { name: 'Feb', value: 15 },
    { name: 'Mar', value: 12 },
    { name: 'Apr', value: 18 },
    { name: 'May', value: 14 },
    { name: 'Jun', value: 16 }
  ]

  const recentOrders = [
    { id: "Cozy Retreat", product: 'France', customer: 'Customer 1', date: '2025-05-31', price: 578, status: 'PAID' },
    { id: "Sunny Haven", product: 'Italy', customer: 'Customer 2', date: '2025-12-25', price: 213, status: 'PAID' },
    { id: "Ocean Breeze", product: 'Japan', customer: 'Customer 3', date: '2025-01-08', price: 657, status: 'PENDING' },
    { id: "Mountain Escape", product: 'Brazil', customer: 'Customer 4', date: '2025-08-02', price: 247, status: 'PAID' },
    { id: "Urban Nest", product: 'Canada', customer: 'Customer 5', date: '2025-06-01', price: 586, status: 'PAID' },
    { id: "Tranquil Stay", product: 'Australia', customer: 'Customer 6', date: '2025-11-04', price: 786, status: 'PENDING' },
  ]

  return (
    <div className="dashboard-container">
      <h1>Review & analyze your data</h1>
      
      <div className="stats-grid">
        <div className="stat-card">
          <div className="stat-content">
            <h3>Total sales</h3>
            <div className="stat-value">$1995.34</div>
            <div className="stat-change decrease">-5% <span>compared to last month</span></div>
          </div>
          <div className="stat-icon">
            <FaMoneyBillWave />
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-content">
            <h3>Total customers</h3>
            <div className="stat-value">1250</div>
            <div className="stat-change increase">+10% <span>compared to last month</span></div>
          </div>
          <div className="stat-icon">
            <FaUsers />
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-content">
            <h3>Refunded</h3>
            <div className="stat-value">34</div>
            <div className="stat-change decrease">-2% <span>compared to last month</span></div>
          </div>
          <div className="stat-icon">
            <FaExchangeAlt />
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-content">
            <h3>Average revenue</h3>
            <div className="stat-value">$50.25</div>
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
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis />
              <Line type="monotone" dataKey="value" stroke="#8884d8" />
            </LineChart>
          </ResponsiveContainer>
        </div>

        <div className="overview-section">
          <h2>Overview</h2>
          <div className="overview-stats">
            <div className="overview-item">
              <span>Stays in list</span>
              <span>10</span>
            </div>
            <div className="overview-item">
              <span>Total orders</span>
              <span>122</span>
            </div>
            <div className="overview-item">
              <span>Refunded</span>
              <span>34</span>
            </div>
            <div className="overview-item">
              <span>Average revenue</span>
              <span>$50.25</span>
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
              <th>Product</th>
              <th>Customer</th>
              <th>Date</th>
              <th>Price</th>
              <th>Status</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {recentOrders.map(order => (
              <tr key={order.id}>
                <td>{order.id}</td>
                <td>{order.product}</td>
                <td>{order.customer}</td>
                <td>{order.date}</td>
                <td>${order.price}</td>
                <td>
                  <span className={`status-badge ${order.status.toLowerCase()}`}>
                    {order.status}
                  </span>
                </td>
                <td>
                  <button className="btn-approve">Approve</button>
                  <button className="btn-reject">Reject</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
} 