import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { toast } from 'react-toastify';
import './DonorDonations.css';

const DonorDonations = ({ url }) => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [donations, setDonations] = useState([]);
    const [donor, setDonor] = useState(null);
    const [loading, setLoading] = useState(true);
    const [filter, setFilter] = useState('all');

    const fetchData = async () => {
        try {
            // Fetch donor info
            const userRes = await axios.get(`${url}/api/user/donors`);
            if (userRes.data.success) {
                const found = userRes.data.donors.find(d => d._id === id);
                setDonor(found || null);
            }

            // Fetch donations by this donor
            const token = localStorage.getItem("adminToken");
            const donationRes = await axios.get(`${url}/api/donation/donor/${id}`, { headers: { token } });
            if (donationRes.data.success) {
                setDonations(donationRes.data.data);
            } else {
                toast.error("Failed to fetch donations");
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

    const getCategoryColor = (category) => {
        const colors = {
            'veg': '#00b894',
            'non-veg': '#d63031',
            'women': '#e17055',
            'men': '#0984e3',
            'boys': '#6c5ce7',
            'girls': '#fd79a8',
            'education': '#fdcb6e'
        };
        return colors[category?.toLowerCase()] || '#636e72';
    };

    const getCategoryIcon = (category) => {
        const icons = {
            'veg': '🥬',
            'non-veg': '🍗',
            'women': '👗',
            'men': '👔',
            'boys': '👦',
            'girls': '👧',
            'education': '📚'
        };
        return icons[category?.toLowerCase()] || '📦';
    };

    const categories = ['all', ...new Set(donations.map(d => d.category))];

    const filteredDonations = donations.filter(d => {
        if (filter === 'all') return true;
        return d.category === filter;
    });

    const stats = {
        total: donations.length,
        totalValue: donations.reduce((sum, d) => sum + (d.price || 0), 0),
        categories: new Set(donations.map(d => d.category)).size,
    };

    if (loading) {
        return (
            <div className="dd-loading">
                <div className="dd-spinner"></div>
                <p>Loading donations...</p>
            </div>
        );
    }

    return (
        <div className="dd-page">
            {/* Back Button */}
            <button className="dd-back-btn" onClick={() => navigate('/donors')}>
                <span className="dd-back-arrow">←</span> Back to Donors
            </button>

            {/* Donor Header */}
            {donor && (
                <div className="dd-header">
                    <div className="dd-header-left">
                        <div className="dd-avatar">
                            {donor.name ? donor.name.charAt(0).toUpperCase() : '?'}
                        </div>
                        <div className="dd-header-info">
                            <h2>{donor.name}</h2>
                            <p className="dd-email">{donor.email}</p>
                            {donor.phone && <p className="dd-phone">📞 {donor.phone}</p>}
                        </div>
                    </div>
                    <div className="dd-header-right">
                        <div className="dd-header-badge">
                            <span className="dd-badge-label">DONOR</span>
                        </div>
                    </div>
                </div>
            )}

            {/* Stats Cards */}
            <div className="dd-stats-row">
                <div className="dd-stat-card dd-stat-total">
                    <span className="dd-stat-icon">🎁</span>
                    <span className="dd-stat-number">{stats.total}</span>
                    <span className="dd-stat-label">Total Donations</span>
                </div>
                <div className="dd-stat-card dd-stat-value">
                    <span className="dd-stat-icon">💰</span>
                    <span className="dd-stat-number">₹{stats.totalValue.toLocaleString()}</span>
                    <span className="dd-stat-label">Total Value</span>
                </div>
                <div className="dd-stat-card dd-stat-categories">
                    <span className="dd-stat-icon">📂</span>
                    <span className="dd-stat-number">{stats.categories}</span>
                    <span className="dd-stat-label">Categories</span>
                </div>
            </div>

            {/* Filter Bar */}
            <div className="dd-filter-bar">
                <h3>
                    {filter === 'all' ? 'All Donations' : `${filter} Donations`}
                    <span className="dd-filter-count">({filteredDonations.length})</span>
                </h3>
                <div className="dd-filter-pills">
                    {categories.map(cat => (
                        <button
                            key={cat}
                            className={`dd-filter-pill ${filter === cat ? 'active' : ''}`}
                            onClick={() => setFilter(cat)}
                            style={filter === cat && cat !== 'all' ? { background: getCategoryColor(cat), color: '#fff' } : {}}
                        >
                            {cat === 'all' ? '📋 All' : `${getCategoryIcon(cat)} ${cat}`}
                        </button>
                    ))}
                </div>
            </div>

            {/* Donations Grid */}
            {filteredDonations.length === 0 ? (
                <div className="dd-empty">
                    <span className="dd-empty-icon">📭</span>
                    <p>No donations found{filter !== 'all' ? ` in "${filter}" category` : ' for this donor'}</p>
                </div>
            ) : (
                <div className="dd-donations-grid">
                    {filteredDonations.map((donation) => (
                        <div key={donation._id} className="dd-donation-card">
                            <div className="dd-donation-image">
                                <img
                                    src={`${url}/images/${donation.image}`}
                                    alt={donation.name}
                                    onError={(e) => { e.target.src = 'data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" width="100" height="100"><rect fill="%23f0f0f0" width="100" height="100"/><text fill="%23b2bec3" font-size="14" x="50%" y="50%" text-anchor="middle" dy=".3em">No Image</text></svg>'; }}
                                />
                                <span
                                    className="dd-category-badge"
                                    style={{ background: getCategoryColor(donation.category) }}
                                >
                                    {getCategoryIcon(donation.category)} {donation.category}
                                </span>
                            </div>
                            <div className="dd-donation-body">
                                <h4 className="dd-donation-name">{donation.name}</h4>
                                <p className="dd-donation-desc">{donation.description}</p>
                                <div className="dd-donation-footer">
                                    <span className="dd-donation-price">₹{donation.price?.toLocaleString()}</span>
                                    <span className="dd-donation-id">#{donation._id.slice(-6).toUpperCase()}</span>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default DonorDonations;
