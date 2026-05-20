import React, { useContext, useEffect, useState } from "react";
import { StoreContext } from "../../context/StoreContext";
import { useNavigate } from "react-router-dom";
import "./Dashboard.css";
import axios from "axios";
import { assets as fassets } from "../../assets/frontend";
import Donation from "../Donation/Donation";
import MyDonations from "../MyDonations/MyDonations";

const Dashboard = () => {
    const { token, role, url, setToken, setRole, setUserName } = useContext(StoreContext);
    const navigate = useNavigate();
    const [stats, setStats] = useState({ totalDonations: 0, totalValue: 0, activeRequests: 0, totalRequests: 0 });
    const [recentActivity, setRecentActivity] = useState([]);
    const [activeTab, setActiveTab] = useState('overview');
    
    useEffect(() => {
        if (!token) {
            navigate("/");
            return;
        }
        fetchDashboardStats();
    }, [token, role]);

    const logout = () => {
        localStorage.removeItem("authToken");
        localStorage.removeItem("userRole");
        localStorage.removeItem("userName");
        setToken("");
        setRole("");
        if(setUserName) setUserName("");
        navigate("/");
    };

    const fetchDashboardStats = async () => {
        try {
            if (role === 'donor') {
                const profileRes = await axios.get(url + "/api/user/get-profile", { headers: { token } });
                if (profileRes.data.success) {
                    const donorId = profileRes.data.user._id;
                    const res = await axios.get(url + `/api/donation/donor/${donorId}`, { headers: { token } });
                    if (res.data.success) {
                        const donations = res.data.data;
                        const totalDonations = donations.length;
                        const totalValue = donations.reduce((acc, curr) => acc + curr.price, 0);
                        setStats(prev => ({ ...prev, totalDonations, totalValue }));
                        setRecentActivity(donations.slice(0, 5));
                    }
                }
            } else if (role === 'receiver') {
                const res = await axios.get(url + "/api/order/myorders", { headers: { token } });
                if (res.data.success) {
                    const orders = res.data.orders;
                    const totalRequests = orders.length;
                    const activeRequests = orders.filter(o => o.status !== 'Delivered' && o.status !== 'Cancelled' && o.status !== 'Received').length;
                    setStats(prev => ({ ...prev, totalRequests, activeRequests }));
                    setRecentActivity(orders.slice(0, 5));
                }
            }
        } catch (err) {
            console.error("Error fetching stats:", err);
        }
    };

    return (
        <div className="dashboard-container">
            <div className="dashboard-sidebar">
                <div className="sidebar-header">
                    <h3>{role === 'donor' ? 'Donor Panel' : 'Receiver Panel'}</h3>
                </div>
                <ul className="sidebar-menu">
                    <li className={activeTab === 'overview' ? 'active' : ''} onClick={() => setActiveTab('overview')}>
                        <img src={fassets.profile_icon} alt="" className="sidebar-icon" /> Dashboard
                    </li>
                    {role === 'donor' ? (
                        <>
                            <li className={activeTab === 'donation' ? 'active' : ''} onClick={() => setActiveTab('donation')}>
                                <span className="sidebar-icon">➕</span> Donate Now
                            </li>
                            <li className={activeTab === 'history' ? 'active' : ''} onClick={() => setActiveTab('history')}>
                                <img src={fassets.bag_icon} alt="" className="sidebar-icon" /> My Donations
                            </li>
                            <li onClick={() => setActiveTab('overview')}>
                                <span className="sidebar-icon">👤</span> Profile
                            </li>
                        </>
                    ) : (
                        <>
                            <li onClick={() => navigate('/menu')}>
                                <span className="sidebar-icon">➕</span> Request Help
                            </li>
                            <li onClick={() => navigate('/myorders')}>
                                <img src={fassets.bag_icon} alt="" className="sidebar-icon" /> My Requests
                            </li>
                            <li onClick={() => navigate('/dashboard')}>
                                <span className="sidebar-icon">👤</span> Profile
                            </li>
                        </>
                    )}
                    <li onClick={logout}>
                        <img src={fassets.logout_icon} alt="" className="sidebar-icon" style={{filter: 'grayscale(100%)'}} /> Logout
                    </li>
                </ul>
            </div>
            
            <div className="dashboard-main">
                {activeTab === 'overview' && (
                    <>
                        <div className="dashboard-header">
                            <h2>Welcome back!</h2>
                            <p>Here is an overview of your activity.</p>
                        </div>
                        
                        <div className="stats-cards">
                            {role === 'donor' ? (
                                <>
                                    <div className="stat-card">
                                        <h4>Total Donations</h4>
                                        <div className="stat-value">{stats.totalDonations}</div>
                                        <div className="stat-icon">❤️</div>
                                    </div>
                                    <div className="stat-card">
                                        <h4>Total Value Donated</h4>
                                        <div className="stat-value">₹{stats.totalValue}</div>
                                        <div className="stat-icon">📈</div>
                                    </div>
                                </>
                            ) : (
                                <>
                                    <div className="stat-card">
                                        <h4>Total Requests</h4>
                                        <div className="stat-value">{stats.totalRequests}</div>
                                        <div className="stat-icon">🤲</div>
                                    </div>
                                    <div className="stat-card">
                                        <h4>Active Requests</h4>
                                        <div className="stat-value">{stats.activeRequests}</div>
                                        <div className="stat-icon">⏳</div>
                                    </div>
                                </>
                            )}
                        </div>

                        <div className="recent-activity">
                            <h3>Recent Activity</h3>
                            {recentActivity.length === 0 ? (
                                <p className="no-activity">No recent activity found.</p>
                            ) : (
                                <ul className="activity-list">
                                    {recentActivity.map((item, index) => (
                                        <li key={index} className="activity-item">
                                            <div className="activity-details">
                                                <span className="activity-name">{role === 'donor' ? item.name : `Order ID: ${item._id?.slice(-8)}`}</span>
                                                <span className="activity-date">
                                                    {role === 'donor' ? `Category: ${item.category}` : `Items: ${item.items?.map(i => i.name).join(', ')}`}
                                                </span>
                                            </div>
                                            <div className={`activity-status ${role === 'donor' ? 'status-donated' : `status-${item.status?.toLowerCase()}`}`}>
                                                {role === 'donor' ? `₹${item.price}` : item.status}
                                            </div>
                                        </li>
                                    ))}
                                </ul>
                            )}
                        </div>
                    </>
                )}
                {activeTab === 'donation' && role === 'donor' && <Donation />}
                {activeTab === 'history' && role === 'donor' && <MyDonations />}
            </div>
        </div>
    );
};

export default Dashboard;
