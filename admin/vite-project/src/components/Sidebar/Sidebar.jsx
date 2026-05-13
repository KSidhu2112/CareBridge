import React, { useState, useEffect } from 'react'
import axios from 'axios'
import './Sidebar.css'
import { assets } from '../../../../../carebridge/src/assets/assets/assets'
import { NavLink } from 'react-router-dom'

const Sidebar = () => {
  const [stats, setStats] = useState({ donations: 0, receivers: 0, communities: 0 });

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const response = await axios.get("https://carebridge-auom.onrender.com/api/stats");
        if (response.data.success) {
          setStats(response.data.data);
        }
      } catch (error) {
        console.error("Error fetching stats:", error);
      }
    };
    fetchStats();
  }, []);

  return (
    <div className="sidebar">
        <NavLink to='/' className="dashboard-link" style={{ display: 'flex', alignItems: 'center', gap: '15px', padding: '10px 20px', textDecoration: 'none', color: '#555' }} exact="true">
            <span className="icon" style={{ fontSize: '1.2rem', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>📊</span>
            <p className="text">Dashboard</p>
        </NavLink>

        <NavLink to='/add' className="add-items">
            <img src={assets.add_icon} alt="" className="icon" />
            <p className="text">Add Items</p>
        </NavLink>

        <NavLink to='/list' className="list-items">
            <img src={assets.order_icon} alt="" className="icon" />
            <p className="text">List Items ({stats.donations})</p>
        </NavLink>

        <NavLink to='/orders' className="order-items">
            <img src={assets.order_icon} alt="" className="icon" />
            <p className="text">Orders ({stats.receivers})</p>
        </NavLink>

        <NavLink to='/deliveryboys' className="order-items">
            <span className="icon" style={{ fontSize: '1.2rem', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>🚚</span>
            <p className="text">Delivery Boys ({stats.communities})</p>
        </NavLink>
    </div>
  )
}

export default Sidebar
