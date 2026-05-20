import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { toast } from 'react-toastify';
import './Donors.css';

const Donors = ({ url }) => {
    const [list, setList] = useState([]);
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();

    const fetchList = async () => {
        try {
            setLoading(true);
            const response = await axios.get(`${url}/api/user/donors`);
            if (response.data.success) {
                setList(response.data.donors);
            } else {
                toast.error("Error fetching donors list");
            }
        } catch (error) {
            console.error(error);
            toast.error("Error fetching donors list");
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
        if (rating >= 4) return '#00b894';
        if (rating >= 3) return '#fdcb6e';
        if (rating >= 2) return '#e17055';
        return '#d63031';
    };

    return (
        <div className='donors-page'>
            <div className="page-header">
                <h3>Donors Registry</h3>
                <p className="subtitle">Displaying verified donors contributing to CareBridge</p>
            </div>
            {loading ? (
                <div className="loader-container">
                    <div className="simple-loader"></div>
                    <p>Loading donors...</p>
                </div>
            ) : (
                <div className="donors-grid">
                    {list.length === 0 ? (
                        <p className="no-data">No donors registered yet.</p>
                    ) : (
                        list.map((item, index) => (
                            <div key={index} className='donor-card'
                                 onClick={() => navigate(`/donors/${item._id}/donations`)}
                                 style={{ cursor: 'pointer' }}
                                 title="Click to view donations">
                                <div className="donor-card-header">
                                    <div className="donor-avatar">
                                        {item.name ? item.name.charAt(0).toUpperCase() : '?'}
                                    </div>
                                    <div className="donor-info">
                                        <h4>{item.name}</h4>
                                        <p className="donor-email">{item.email}</p>
                                        <p className="donor-phone">📞 {item.phone || "No contact number"}</p>
                                    </div>
                                </div>
                                <div className="donor-card-stats">
                                    <div className="donor-rating-header">
                                        <span className="donor-rating-label">Donor Reputation</span>
                                    </div>
                                    <div className="donor-rating-display">
                                        <span className="donor-rating-number" style={{ 
                                            color: item.averageRating ? getRatingColor(item.averageRating) : '#b2bec3' 
                                        }}>
                                            {item.averageRating ? item.averageRating.toFixed(1) : "—"}
                                        </span>
                                        <div className="donor-rating-stars">
                                            {renderStars(item.averageRating || 0)}
                                        </div>
                                        <span className="donor-rating-count">
                                            {item.ratingCount || 0} review{(item.ratingCount || 0) !== 1 ? 's' : ''}
                                        </span>
                                    </div>
                                    {item.averageRating > 0 && (
                                        <div className="donor-rating-bar">
                                            <div className="donor-rating-bar-fill" style={{ 
                                                width: `${(item.averageRating / 5) * 100}%`,
                                                background: getRatingColor(item.averageRating)
                                            }}></div>
                                        </div>
                                    )}
                                </div>
                                <div className="donor-card-footer">
                                    <span className="badge badge-donor">Donor</span>
                                    <span className="donor-id">ID: {item._id.slice(-8)}</span>
                                </div>
                            </div>
                        ))
                    )}
                </div>
            )}
        </div>
    );
};

export default Donors;
