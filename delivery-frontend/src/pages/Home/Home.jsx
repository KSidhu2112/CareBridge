import React, { useEffect, useState } from 'react';
import './Home.css';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';

const Home = ({ url }) => {
    const [currentOrders, setCurrentOrders] = useState([]);
    const [availableOrders, setAvailableOrders] = useState([]);
    const [activeTab, setActiveTab] = useState('current'); // 'current' or 'available'
    const [profile, setProfile] = useState(null);
    const navigate = useNavigate();
    const token = localStorage.getItem('token');

    useEffect(() => {
        if (!token) {
            navigate('/login');
        } else {
            fetchAllOrders();
            fetchProfile();
        }
    }, [token, navigate]);

    const fetchProfile = async () => {
        try {
            const response = await axios.get(`${url}/api/user/get-profile`, { headers: { token } });
            if (response.data.success) {
                setProfile(response.data.user);
            }
        } catch (error) {
            console.error("Error fetching profile", error);
        }
    };

    const fetchAllOrders = () => {
        fetchCurrentOrders();
        fetchAvailableOrders();
    };

    const fetchCurrentOrders = async () => {
        try {
            const response = await axios.get(`${url}/api/order/delivery-orders`, { headers: { token } });
            if (response.data.success) {
                // Filter only active orders for this delivery person
                const activeOrders = response.data.orders.filter(order =>
                    order.status === 'Assigned' || order.status === 'Out for Delivery'
                );
                setCurrentOrders(activeOrders);
            }
        } catch (error) {
            console.error("Error fetching current orders", error);
        }
    };

    const fetchAvailableOrders = async () => {
        try {
            const response = await axios.get(`${url}/api/order/available`, { headers: { token } });
            if (response.data.success) {
                setAvailableOrders(response.data.orders);
            } else {
                toast.error(response.data.message || "Failed to fetch available orders");
            }
        } catch (error) {
            console.error("Error fetching available orders", error);
            toast.error("Network error fetching available orders");
        }
    };

    const bookOrder = async (orderId) => {
        try {
            const response = await axios.post(`${url}/api/order/book`, { orderId }, { headers: { token } });
            if (response.data.success) {
                toast.success(response.data.message);
                fetchAllOrders(); // Refresh both lists
                setActiveTab('current'); // Switch to current orders to see the new assignment
            } else {
                toast.error(response.data.message);
            }
        } catch (error) {
            console.error("Error booking order", error);
            toast.error("Error booking order");
        }
    };

    const updateStatus = async (orderId, newStatus) => {
        try {
            const response = await axios.post(`${url}/api/order/status`, { orderId, status: newStatus }, { headers: { token } });
            if (response.data.success) {
                fetchCurrentOrders();
                toast.success("Status Updated");
            }
        } catch (error) {
            console.error("Error updating status", error);
            toast.error("Error updating status");
        }
    };

    const renderStars = (rating) => {
        const stars = [];
        const fullStars = Math.floor(rating);
        const hasHalf = rating - fullStars >= 0.5;
        for (let i = 1; i <= 5; i++) {
            if (i <= fullStars) {
                stars.push(<span key={i} className="star-filled">★</span>);
            } else if (i === fullStars + 1 && hasHalf) {
                stars.push(<span key={i} className="star-half">★</span>);
            } else {
                stars.push(<span key={i} className="star-empty">★</span>);
            }
        }
        return stars;
    };

    return (
        <div className='home-container'>
            {/* Rating Dashboard Card */}
            {profile && (
                <div className="rating-dashboard-card">
                    <div className="rating-dashboard-left">
                        <div className="rating-avatar">👤</div>
                        <div className="rating-info">
                            <h3>Welcome, {profile.name}</h3>
                            <p className="rating-label">Your Performance Rating</p>
                        </div>
                    </div>
                    <div className="rating-dashboard-right">
                        <div className="rating-big-number">
                            {profile.averageRating ? profile.averageRating.toFixed(1) : "—"}
                        </div>
                        <div className="rating-stars-row">
                            {renderStars(profile.averageRating || 0)}
                        </div>
                        <p className="rating-reviews-count">
                            {profile.ratingCount || 0} review{(profile.ratingCount || 0) !== 1 ? 's' : ''}
                        </p>
                    </div>
                </div>
            )}

            <div className="tabs">
                <button
                    className={`tab-btn ${activeTab === 'current' ? 'active' : ''}`}
                    onClick={() => setActiveTab('current')}
                >
                    Current Orders ({currentOrders.length})
                </button>
                <button
                    className={`tab-btn ${activeTab === 'available' ? 'active' : ''}`}
                    onClick={() => setActiveTab('available')}
                >
                    Available Orders ({availableOrders.length})
                </button>
            </div>

            <div className="orders-section">
                {activeTab === 'current' && (
                    <>
                        <h3>Current Orders to Deliver</h3>
                        {currentOrders.length === 0 ? (
                            <div className="no-orders"><p>No active orders assigned.</p></div>
                        ) : (
                            <div className="orders-list">
                                {currentOrders.map((order) => (
                                    <div key={order._id} className="order-card">
                                        <div className="order-header">
                                            <h4>Order #{order._id.slice(-6)}</h4>
                                            <span className={`status-badge status-${order.status.toLowerCase().replace(/\s/g, '-')}`}>{order.status}</span>
                                        </div>
                                        <div className="order-body">
                                            <p><strong>Items:</strong> {order.items.map(i => i.name + " x" + i.quantity).join(", ")}</p>
                                            <p><strong>Amount:</strong> ${order.amount}</p>
                                            <p><strong>Address:</strong> {order.address.street}, {order.address.city}, {order.address.zipcode}</p>
                                        </div>
                                        <div className="order-actions">
                                            <select onChange={(e) => updateStatus(order._id, e.target.value)} value={order.status}>
                                                <option value="Assigned">Assigned</option>
                                                <option value="Out for Delivery">Out for Delivery</option>
                                                <option value="Delivered">Delivered</option>
                                            </select>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                    </>
                )}

                {activeTab === 'available' && (
                    <>
                        <h3>Available Orders for Pickup</h3>
                        {availableOrders.length === 0 ? (
                            <div className="no-orders"><p>No orders available for booking.</p></div>
                        ) : (
                            <div className="orders-list">
                                {availableOrders.map((order) => (
                                    <div key={order._id} className="order-card available-order">
                                        <div className="order-header">
                                            <h4>Order #{order._id.slice(-6)}</h4>
                                            <span className="status-badge status-placed">{order.status}</span>
                                        </div>
                                        <div className="order-body">
                                            <p><strong>Items:</strong> {order.items.map(i => i.name + " x" + i.quantity).join(", ")}</p>
                                            <p><strong>Amount:</strong> ${order.amount}</p>
                                            <p><strong>Address:</strong> {order.address.street}, {order.address.city}, {order.address.zipcode}</p>
                                        </div>
                                        <div className="order-actions">
                                            <button className="book-btn" onClick={() => bookOrder(order._id)}>Book Order</button>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                    </>
                )}
            </div>
        </div>
    );
};

export default Home;

