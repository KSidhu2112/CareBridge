import React, { useEffect, useState } from 'react';
import '../Home/Home.css'; // Reusing Home styles
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const History = ({ url }) => {
    const [orders, setOrders] = useState([]);
    const navigate = useNavigate();
    const token = localStorage.getItem('token');

    useEffect(() => {
        if (!token) {
            navigate('/login');
        } else {
            fetchOrders();
        }
    }, [token, navigate]);

    const fetchOrders = async () => {
        try {
            const response = await axios.get(`${url}/api/order/delivery-orders`, { headers: { token } });
            if (response.data.success) {
                // Filter only completed orders (including received)
                const pastOrders = response.data.orders.filter(order =>
                    order.status === 'Delivered' || order.status === 'Cancelled' || order.status === 'Received'
                );
                setOrders(pastOrders);
            }
        } catch (error) {
            console.error("Error fetching history orders", error);
        }
    }

    const renderStars = (rating) => {
        return [1, 2, 3, 4, 5].map((star) => (
            <span key={star} style={{ 
                color: star <= rating ? '#fdcb6e' : '#dfe6e9', 
                fontSize: '1.1rem' 
            }}>★</span>
        ));
    };

    return (
        <div className='home-container'>
            <div className="orders-section">
                <h3>Delivery History</h3>
                {orders.length === 0 ? (
                    <div className="no-orders">
                        <p>No past orders found.</p>
                    </div>
                ) : (
                    <div className="orders-list">
                        {orders.map((order) => (
                            <div key={order._id} className="order-card history-card">
                                <div className="order-header">
                                    <h4>Order #{order._id.slice(-6)}</h4>
                                    <span className={`status-badge status-${order.status.toLowerCase().replace(/\s/g, '-')}`}>{order.status}</span>
                                </div>
                                <div className="order-body">
                                    <p><strong>Items:</strong> {order.items.map(i => i.name + " x" + i.quantity).join(", ")}</p>
                                    <p><strong>Amount:</strong> ${order.amount}</p>
                                    <p><strong>Address:</strong> {order.address.street}, {order.address.city}, {order.address.zipcode}</p>
                                    <p><strong>Date:</strong> {new Date(order.date).toLocaleDateString()}</p>
                                </div>
                                {/* Rating Display */}
                                <div style={{ paddingTop: '0.8rem', borderTop: '1px solid #f0f0f0' }}>
                                    {order.rating ? (
                                        <div className="order-rating-badge">
                                            <span>⭐</span>
                                            <span>{order.rating}/5</span>
                                            <span style={{ display: 'flex' }}>{renderStars(order.rating)}</span>
                                        </div>
                                    ) : (
                                        <div className="order-no-rating">
                                            <span>☆</span>
                                            <span>No rating yet</span>
                                        </div>
                                    )}
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
};

export default History;

