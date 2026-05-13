import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { toast } from 'react-toastify';
import './DeliveryBoyOrders.css';

const DeliveryBoyOrders = ({ url }) => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [orders, setOrders] = useState([]);
    const [deliveryBoy, setDeliveryBoy] = useState(null);
    const [loading, setLoading] = useState(true);
    const [filter, setFilter] = useState('all');

    const fetchData = async () => {
        try {
            // Fetch delivery boy info
            const userRes = await axios.get(`${url}/api/user/delivery-boys`);
            if (userRes.data.success) {
                const found = userRes.data.deliveryBoys.find(db => db._id === id);
                setDeliveryBoy(found || null);
            }

            // Fetch orders for this delivery boy
            const orderRes = await axios.get(`${url}/api/order/by-delivery-boy/${id}`);
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

    const renderStars = (rating) => {
        return [1, 2, 3, 4, 5].map((star) => (
            <span key={star} style={{
                color: star <= Math.round(rating) ? '#fdcb6e' : '#dfe6e9',
                fontSize: '1rem'
            }}>★</span>
        ));
    };

    if (loading) {
        return (
            <div className="dbo-loading">
                <div className="dbo-spinner"></div>
                <p>Loading orders...</p>
            </div>
        );
    }

    return (
        <div className="dbo-page">
            {/* Back Button */}
            <button className="dbo-back-btn" onClick={() => navigate('/deliveryboys')}>
                <span className="dbo-back-arrow">←</span> Back to Delivery Boys
            </button>

            {/* Delivery Boy Header */}
            {deliveryBoy && (
                <div className="dbo-header">
                    <div className="dbo-header-left">
                        <div className="dbo-avatar">
                            {deliveryBoy.name ? deliveryBoy.name.charAt(0).toUpperCase() : '?'}
                        </div>
                        <div className="dbo-header-info">
                            <h2>{deliveryBoy.name}</h2>
                            <p className="dbo-email">{deliveryBoy.email}</p>
                            {deliveryBoy.phone && <p className="dbo-phone">📞 {deliveryBoy.phone}</p>}
                        </div>
                    </div>
                    <div className="dbo-header-right">
                        <div className="dbo-rating-badge">
                            <span className="dbo-rating-value">
                                {deliveryBoy.averageRating ? deliveryBoy.averageRating.toFixed(1) : '—'}
                            </span>
                            <div className="dbo-rating-stars">
                                {renderStars(deliveryBoy.averageRating || 0)}
                            </div>
                            <span className="dbo-rating-count">
                                {deliveryBoy.ratingCount || 0} reviews
                            </span>
                        </div>
                    </div>
                </div>
            )}

            {/* Stats Cards */}
            <div className="dbo-stats-row">
                <div className="dbo-stat-card dbo-stat-total" onClick={() => setFilter('all')}>
                    <span className="dbo-stat-icon">📦</span>
                    <span className="dbo-stat-number">{stats.total}</span>
                    <span className="dbo-stat-label">Total Orders</span>
                </div>
                <div className="dbo-stat-card dbo-stat-active" onClick={() => setFilter('active')}>
                    <span className="dbo-stat-icon">🚚</span>
                    <span className="dbo-stat-number">{stats.active}</span>
                    <span className="dbo-stat-label">Active</span>
                </div>
                <div className="dbo-stat-card dbo-stat-completed" onClick={() => setFilter('completed')}>
                    <span className="dbo-stat-icon">✅</span>
                    <span className="dbo-stat-number">{stats.completed}</span>
                    <span className="dbo-stat-label">Completed</span>
                </div>
                <div className="dbo-stat-card dbo-stat-cancelled" onClick={() => setFilter('cancelled')}>
                    <span className="dbo-stat-icon">❌</span>
                    <span className="dbo-stat-number">{stats.cancelled}</span>
                    <span className="dbo-stat-label">Cancelled</span>
                </div>
            </div>

            {/* Filter Indicator */}
            <div className="dbo-filter-bar">
                <h3>
                    {filter === 'all' ? 'All Orders' :
                     filter === 'active' ? 'Active Orders' :
                     filter === 'completed' ? 'Completed Orders' : 'Cancelled Orders'}
                    <span className="dbo-filter-count">({filteredOrders.length})</span>
                </h3>
                {filter !== 'all' && (
                    <button className="dbo-clear-filter" onClick={() => setFilter('all')}>
                        Clear Filter ✕
                    </button>
                )}
            </div>

            {/* Orders List */}
            {filteredOrders.length === 0 ? (
                <div className="dbo-empty">
                    <span className="dbo-empty-icon">📭</span>
                    <p>No {filter !== 'all' ? filter : ''} orders found for this delivery boy</p>
                </div>
            ) : (
                <div className="dbo-orders-list">
                    {filteredOrders.map((order, index) => (
                        <div key={order._id} className={`dbo-order-card ${getStatusClass(order.status)}`}>
                            <div className="dbo-order-top">
                                <div className="dbo-order-id">
                                    <span className="dbo-order-hash">#</span>
                                    {order._id.slice(-8).toUpperCase()}
                                </div>
                                <div className={`dbo-status-badge ${getStatusClass(order.status)}`}>
                                    {getStatusIcon(order.status)} {order.status}
                                </div>
                            </div>

                            <div className="dbo-order-body">
                                {/* Customer Info */}
                                <div className="dbo-order-section">
                                    <span className="dbo-section-title">Customer</span>
                                    <p className="dbo-customer-name">
                                        {order.address?.firstName} {order.address?.lastName}
                                    </p>
                                    <p className="dbo-customer-address">
                                        {order.address?.street}, {order.address?.city}
                                    </p>
                                    {order.address?.phone && (
                                        <p className="dbo-customer-phone">📞 {order.address.phone}</p>
                                    )}
                                </div>

                                {/* Items */}
                                <div className="dbo-order-section">
                                    <span className="dbo-section-title">Items</span>
                                    <div className="dbo-items-list">
                                        {order.items.map((item, i) => (
                                            <div key={i} className="dbo-item-row">
                                                <span className="dbo-item-name">{item.name}</span>
                                                <span className="dbo-item-qty">×{item.quantity}</span>
                                            </div>
                                        ))}
                                    </div>
                                </div>

                                {/* Footer Info */}
                                <div className="dbo-order-meta">
                                    <span className="dbo-order-date">
                                        🕐 {new Date(order.date).toLocaleDateString('en-IN', {
                                            day: 'numeric',
                                            month: 'short',
                                            year: 'numeric',
                                            hour: '2-digit',
                                            minute: '2-digit'
                                        })}
                                    </span>
                                    {order.rating && (
                                        <span className="dbo-order-rating">
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

export default DeliveryBoyOrders;
