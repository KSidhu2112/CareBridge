import React, { useEffect, useState } from 'react';
import './Profile.css';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const Profile = ({ url }) => {
    const [profile, setProfile] = useState(null);
    const navigate = useNavigate();
    const token = localStorage.getItem('token');

    useEffect(() => {
        if (!token) {
            navigate('/login');
        } else {
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
    }

    const renderStars = (rating) => {
        return [1, 2, 3, 4, 5].map((star) => (
            <span key={star} className={`profile-star ${star <= Math.round(rating) ? 'profile-star-filled' : 'profile-star-empty'}`}>
                ★
            </span>
        ));
    };

    if (!profile) return <div className="loading">Loading Profile...</div>;

    const ratingPercentage = profile.averageRating ? (profile.averageRating / 5) * 100 : 0;

    return (
        <div className="profile-container">
            <div className="profile-card">
                <h2>Delivery Partner Profile</h2>
                <div className="profile-details">
                    <p><strong>Name:</strong> {profile.name}</p>
                    <p><strong>Email:</strong> {profile.email}</p>
                    <p><strong>Status:</strong> <span className="status-active">Active</span></p>
                </div>
                
                <div className="rating-stats">
                    <h3>Performance</h3>
                    <div className="rating-box">
                        <div className="rating-big-display">
                            <span className="star-icon">⭐</span>
                            <span className="avg-rating">
                                {profile.averageRating ? profile.averageRating.toFixed(1) : "0.0"}
                            </span>
                            <span className="rating-out-of">/5</span>
                        </div>
                        <div className="rating-stars-display">
                            {renderStars(profile.averageRating || 0)}
                        </div>
                        <div className="rating-progress-bar">
                            <div className="rating-progress-fill" style={{ width: `${ratingPercentage}%` }}></div>
                        </div>
                        <span className="rating-count">
                            Based on {profile.ratingCount || 0} review{(profile.ratingCount || 0) !== 1 ? 's' : ''}
                        </span>
                    </div>
                    {!profile.averageRating && (
                        <p className="no-ratings-msg">Complete deliveries and get rated to see your performance score!</p>
                    )}
                </div>
            </div>
        </div>
    );
};

export default Profile;

