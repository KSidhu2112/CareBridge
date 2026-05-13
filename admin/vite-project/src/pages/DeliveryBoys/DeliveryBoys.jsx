
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { toast } from 'react-toastify';
import './DeliveryBoys.css';

const DeliveryBoys = ({ url }) => {
    const [list, setList] = useState([]);
    const navigate = useNavigate();

    const fetchList = async () => {
        try {
            const response = await axios.get(`${url}/api/user/delivery-boys`);
            if (response.data.success) {
                setList(response.data.deliveryBoys);
            } else {
                toast.error("Error fetching delivery boys");
            }
        } catch (error) {
            console.error(error);
            toast.error("Error fetching delivery boys");
        }
    };

    useEffect(() => {
        fetchList();
    }, []);

    const renderStars = (rating) => {
        return [1, 2, 3, 4, 5].map((star) => (
            <span key={star} style={{ 
                color: star <= Math.round(rating) ? '#fdcb6e' : '#dfe6e9', 
                fontSize: '0.95rem' 
            }}>★</span>
        ));
    };

    const getRatingColor = (rating) => {
        if (rating >= 4) return '#00b894';
        if (rating >= 3) return '#fdcb6e';
        if (rating >= 2) return '#e17055';
        return '#d63031';
    };

    return (
        <div className='delivery-boys-page'>
            <h3>Delivery Boys List</h3>
            <div className="delivery-boys-grid">
                {list.length === 0 ? (
                    <p className="no-data">No delivery boys found</p>
                ) : (
                    list.map((item, index) => (
                        <div key={index} className='delivery-boy-card' 
                             onClick={() => navigate(`/deliveryboys/${item._id}/orders`)}
                             style={{ cursor: 'pointer' }}
                             title="Click to view orders">
                            <div className="db-card-header">
                                <div className="db-avatar">
                                    {item.name ? item.name.charAt(0).toUpperCase() : '?'}
                                </div>
                                <div className="db-info">
                                    <h4>{item.name}</h4>
                                    <p className="db-email">{item.email}</p>
                                    <p className="db-phone">📞 {item.phone || "N/A"}</p>
                                </div>
                            </div>
                            <div className="db-card-rating">
                                <div className="db-rating-header">
                                    <span className="db-rating-label">Average Rating</span>
                                </div>
                                <div className="db-rating-display">
                                    <span className="db-rating-number" style={{ 
                                        color: item.averageRating ? getRatingColor(item.averageRating) : '#b2bec3' 
                                    }}>
                                        {item.averageRating ? item.averageRating.toFixed(1) : "—"}
                                    </span>
                                    <div className="db-rating-stars">
                                        {renderStars(item.averageRating || 0)}
                                    </div>
                                    <span className="db-rating-count">
                                        {item.ratingCount || 0} review{(item.ratingCount || 0) !== 1 ? 's' : ''}
                                    </span>
                                </div>
                                {item.averageRating > 0 && (
                                    <div className="db-rating-bar">
                                        <div className="db-rating-bar-fill" style={{ 
                                            width: `${(item.averageRating / 5) * 100}%`,
                                            background: getRatingColor(item.averageRating)
                                        }}></div>
                                    </div>
                                )}
                            </div>
                            <div className="db-card-footer">
                                <span className="db-id">ID: {item._id.slice(-8)}</span>
                            </div>
                        </div>
                    ))
                )}
            </div>
        </div>
    );
};

export default DeliveryBoys;
