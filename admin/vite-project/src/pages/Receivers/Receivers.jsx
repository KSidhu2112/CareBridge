import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { toast } from 'react-toastify';
import './Receivers.css';

const Receivers = ({ url }) => {
    const [list, setList] = useState([]);
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();

    const fetchList = async () => {
        try {
            setLoading(true);
            const response = await axios.get(`${url}/api/user/receivers`);
            if (response.data.success) {
                setList(response.data.receivers);
            } else {
                toast.error("Error fetching receivers list");
            }
        } catch (error) {
            console.error(error);
            toast.error("Error fetching receivers list");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchList();
    }, [url]);

    const renderStars = (rating) => {
        return [1, 2, 3, 4, 5].map((star) => (
            <span key={star} style={{ 
                color: star <= Math.round(rating) ? '#fdcb6e' : '#dfe6e9', 
                fontSize: '0.95rem' 
            }}>★</span>
        ));
    };

    const getRatingColor = (rating) => {
        if (rating >= 4) return '#304ffe';
        if (rating >= 3) return '#fdcb6e';
        if (rating >= 2) return '#e17055';
        return '#d63031';
    };

    return (
        <div className='receivers-page'>
            <div className="page-header">
                <h3>Receivers Registry</h3>
                <p className="subtitle">Displaying verified receivers registered with CareBridge</p>
            </div>
            {loading ? (
                <div className="loader-container">
                    <div className="simple-loader"></div>
                    <p>Loading receivers...</p>
                </div>
            ) : (
                <div className="receivers-grid">
                    {list.length === 0 ? (
                        <p className="no-data">No receivers registered yet.</p>
                    ) : (
                        list.map((item, index) => (
                            <div key={index} className='receiver-card'
                                 onClick={() => navigate(`/receivers/${item._id}/orders`)}
                                 style={{ cursor: 'pointer' }}
                                 title="Click to view received orders">
                                <div className="receiver-card-header">
                                    <div className="receiver-avatar">
                                        {item.name ? item.name.charAt(0).toUpperCase() : '?'}
                                    </div>
                                    <div className="receiver-info">
                                        <h4>{item.name}</h4>
                                        <p className="receiver-email">{item.email}</p>
                                        <p className="receiver-phone">📞 {item.phone || "No contact number"}</p>
                                    </div>
                                </div>
                                <div className="receiver-card-stats">
                                    <div className="receiver-rating-header">
                                        <span className="receiver-rating-label">Receiver Rating</span>
                                    </div>
                                    <div className="receiver-rating-display">
                                        <span className="receiver-rating-number" style={{ 
                                            color: item.averageRating ? getRatingColor(item.averageRating) : '#b2bec3' 
                                        }}>
                                            {item.averageRating ? item.averageRating.toFixed(1) : "—"}
                                        </span>
                                        <div className="receiver-rating-stars">
                                            {renderStars(item.averageRating || 0)}
                                        </div>
                                        <span className="receiver-rating-count">
                                            {item.ratingCount || 0} review{(item.ratingCount || 0) !== 1 ? 's' : ''}
                                        </span>
                                    </div>
                                    {item.averageRating > 0 && (
                                        <div className="receiver-rating-bar">
                                            <div className="receiver-rating-bar-fill" style={{ 
                                                width: `${(item.averageRating / 5) * 100}%`,
                                                background: getRatingColor(item.averageRating)
                                            }}></div>
                                        </div>
                                    )}
                                </div>
                                <div className="receiver-card-footer">
                                    <span className="badge badge-receiver">Receiver</span>
                                    <span className="receiver-id">ID: {item._id.slice(-8)}</span>
                                </div>
                            </div>
                        ))
                    )}
                </div>
            )}
        </div>
    );
};

export default Receivers;
