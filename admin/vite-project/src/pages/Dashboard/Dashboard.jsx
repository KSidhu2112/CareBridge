import React, { useState, useEffect } from "react";
import axios from "axios";
import "./Dashboard.css";

const Dashboard = ({ url }) => {
  const [stats, setStats] = useState({ donations: 0, receivers: 0, communities: 0 });

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const response = await axios.get(`${url}/api/stats`);
        if (response.data.success) {
          setStats(response.data.data);
        }
      } catch (error) {
        console.error("Error fetching stats:", error);
      }
    };
    fetchStats();
  }, [url]);

  return (
    <div className="dashboard">
      <h2>Dashboard Overview</h2>
      <div className="dashboard-stats">
        <div className="stat-card">
          <h3>{stats.donations}</h3>
          <p>List of Items</p>
        </div>
        <div className="stat-card">
          <h3>{stats.receivers}</h3>
          <p>Orders</p>
        </div>
        <div className="stat-card">
          <h3>{stats.communities}</h3>
          <p>Delivery Boys</p>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
