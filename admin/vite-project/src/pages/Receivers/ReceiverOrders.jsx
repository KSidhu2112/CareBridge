import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { toast } from 'react-toastify';
import './ReceiverOrders.css';

const ReceiverOrders = ({ url }) => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [orders, setOrders] = useState([]);
    const [receiver, setReceiver] = useState(null);
    const [loading, setLoading] = useState(true);
    const [filter, setFilter] = useState('all');

    const fetchData = async () => {
        try {
            // Fetch receiver info
            const userRes = await axios.get(`${url}/api/user/receivers`);
            if (userRes.data.success) {
                const found = userRes.data.receivers.find(r => r._id === id);
                setReceiver(found || null);
            }

            // Fetch orders for this receiver
            const orderRes = await axios.get(`${url}/api/order/by-user/${id}`);
            if (orderRes.data.success) {
                setOrders(orderRes.data.orders);
            } else {
                toast.error("Failed to fetch orders");
            }
        } catch (error) {
            console.error(error);
            toast.error("Error loading data");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchData();
    }, [id]);

    const getStatusClass = (status) => {
        const s = status?.toLowerCase();
        if (s === 'delivered' || s === 'received') return 'status-delivered';
        if (s === 'assigned' || s === 'out for delivery') return 'status-active';
        if (s === 'placed') return 'status-placed';
        if (s === 'cancelled') return 'status-cancelled';
        return 'status-default';
    };

    const getStatusIcon = (status) => {
        const s = status?.toLowerCase();
        if (s === 'delivered' || s === 'received') return '✅';
        if (s === 'assigned') return '📋';
        if (s === 'out for delivery') return '🚚';
        if (s === 'placed') return '📦';
        if (s === 'cancelled') return '❌';
        return '📄';
    };

    const filteredOrders = orders.filter(order => {
        if (filter === 'all') return true;
        if (filter === 'active') return ['placed', 'assigned', 'out for delivery'].includes(order.status?.toLowerCase());
        if (filter === 'completed') return ['delivered', 'received'].includes(order.status?.toLowerCase());
        if (filter === 'cancelled') return order.status?.toLowerCase() === 'cancelled';
        return true;
    });

    const stats = {
        total: orders.length,
        active: orders.filter(o => ['placed', 'assigned', 'out for delivery'].includes(o.status?.toLowerCase())).length,
        completed: orders.filter(o => ['delivered', 'received'].includes(o.status?.toLowerCase())).length,
        cancelled: orders.filter(o => o.status?.toLowerCase() === 'cancelled').length,
    };

    if (loading) {
        return (
            <div className="ro-loading">
                <div className="ro-spinner"></div>
                <p>Loading orders...</p>
            </div>
        );
    }

    return (
        <div className="ro-page">
            {/* Back Button */}
            <button className="ro-back-btn" onClick={() => navigate('/receivers')}>
                <span className="ro-back-arrow">←</span> Back to Receivers
            </button>

            {/* Receiver Header */}
            {receiver && (
                <div className="ro-header">
                    <div className="ro-header-left">
                        <div className="ro-avatar">
                            {receiver.name ? receiver.name.charAt(0).toUpperCase() : '?'}
                        </div>
                        <div className="ro-header-info">
                            <h2>{receiver.name}</h2>
                            <p className="ro-email">{receiver.email}</p>
                            {receiver.phone && <p className="ro-phone">📞 {receiver.phone}</p>}
                        </div>
                    </div>
                    <div className="ro-header-right">
                        <div className="ro-header-badge">
                            <span className="ro-badge-label">RECEIVER</span>
                        </div>
                    </div>
                </div>
            )}

            {/* Stats Cards */}
            <div className="ro-stats-row">
                <div className="ro-stat-card ro-stat-total" onClick={() => setFilter('all')}>
                    <span className="ro-stat-icon">📦</span>
                    <span className="ro-stat-number">{stats.total}</span>
                    <span className="ro-stat-label">Total Orders</span>
                </div>
                <div className="ro-stat-card ro-stat-active" onClick={() => setFilter('active')}>
                    <span className="ro-stat-icon">🚚</span>
                    <span className="ro-stat-number">{stats.active}</span>
                    <span className="ro-stat-label">Active</span>
                </div>
                <div className="ro-stat-card ro-stat-completed" onClick={() => setFilter('completed')}>
                    <span className="ro-stat-icon">✅</span>
                    <span className="ro-stat-number">{stats.completed}</span>
                    <span className="ro-stat-label">Completed</span>
                </div>
                <div className="ro-stat-card ro-stat-cancelled" onClick={() => setFilter('cancelled')}>
                    <span className="ro-stat-icon">❌</span>
                    <span className="ro-stat-number">{stats.cancelled}</span>
                    <span className="ro-stat-label">Cancelled</span>
                </div>
            </div>

            {/* Filter Indicator */}
            <div className="ro-filter-bar">
                <h3>
                    {filter === 'all' ? 'All Received Orders' :
                     filter === 'active' ? 'Active Orders' :
                     filter === 'completed' ? 'Completed Orders' : 'Cancelled Orders'}
                    <span className="ro-filter-count">({filteredOrders.length})</span>
                </h3>
                {filter !== 'all' && (
                    <button className="ro-clear-filter" onClick={() => setFilter('all')}>
                        Clear Filter ✕
                    </button>
                )}
            </div>

            {/* Orders List */}
            {filteredOrders.length === 0 ? (
                <div className="ro-empty">
                    <span className="ro-empty-icon">📭</span>
                    <p>No {filter !== 'all' ? filter : ''} orders found for this receiver</p>
                </div>
            ) : (
                <div className="ro-orders-list">
                    {filteredOrders.map((order) => (
                        <div key={order._id} className={`ro-order-card ${getStatusClass(order.status)}`}>
                            <div className="ro-order-top">
                                <div className="ro-order-id">
                                    <span className="ro-order-hash">#</span>
                                    {order._id.slice(-8).toUpperCase()}
                                </div>
                                <div className={`ro-status-badge ${getStatusClass(order.status)}`}>
                                    {getStatusIcon(order.status)} {order.status}
                                </div>
                            </div>

                            <div className="ro-order-body">
                                {/* Address Info */}
                                <div className="ro-order-section">
                                    <span className="ro-section-title">Delivery Address</span>
                                    <p className="ro-customer-name">
                                        {order.address?.firstName} {order.address?.lastName}
                                    </p>
                                    <p className="ro-customer-address">
                                        {order.address?.street}, {order.address?.city}
                                    </p>
                                    {order.address?.phone && (
                                        <p className="ro-customer-phone">📞 {order.address.phone}</p>
                                    )}
                                </div>

                                {/* Items */}
                                <div className="ro-order-section">
                                    <span className="ro-section-title">Items Received ({order.items?.length || 0})</span>
                                    <div className="ro-items-list">
                                        {order.items?.map((item, i) => (
                                            <div key={i} className="ro-item-row">
                                                <span className="ro-item-name">{item.name}</span>
                                                <span className="ro-item-qty">×{item.quantity}</span>
                                            </div>
                                        ))}
                                    </div>
                                </div>

                                {/* Footer Info */}
                                <div className="ro-order-meta">
                                    <span className="ro-order-date">
                                        🕐 {new Date(order.date).toLocaleDateString('en-IN', {
                                            day: 'numeric',
                                            month: 'short',
                                            year: 'numeric',
                                            hour: '2-digit',
                                            minute: '2-digit'
                                        })}
                                    </span>
                                    {order.rating && (
                                        <span className="ro-order-rating">
                                            ⭐ {order.rating}/5
                                        </span>
                                    )}
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default ReceiverOrders;
