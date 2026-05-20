import React, { useContext, useEffect, useState } from "react";
import "./MyDonations.css";
import { StoreContext } from "../../context/StoreContext";
import axios from "axios";

const MyDonations = () => {
    const { token, url } = useContext(StoreContext);
    const [donations, setDonations] = useState([]);
    const [searchTerm, setSearchTerm] = useState("");
    const [filterCategory, setFilterCategory] = useState("All");

    useEffect(() => {
        const fetchDonations = async () => {
            try {
                // First get the user profile to find the donorId
                const profileRes = await axios.get(url + "/api/user/get-profile", {
                    headers: { token },
                });

                if (profileRes.data.success) {
                    const donorId = profileRes.data.user._id;

                    // Now fetch the donations for this donorId
                    const donationRes = await axios.get(url + `/api/donation/donor/${donorId}`, {
                        headers: { token },
                    });

                    if (donationRes.data.success) {
                        setDonations(donationRes.data.data);
                    }
                }
            } catch (err) {
                console.error("Error fetching donations:", err);
            }
        };

        if (token) {
            fetchDonations();
        }
    }, [token, url]);

    const filteredDonations = donations.filter(donation => {
        const matchesSearch = donation.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
                              donation.description.toLowerCase().includes(searchTerm.toLowerCase());
        const matchesCategory = filterCategory === "All" || donation.category === filterCategory;
        return matchesSearch && matchesCategory;
    });

    const categories = ["All", ...new Set(donations.map(d => d.category))];

    return (
        <div className="my-donations">
            <div className="donations-header-section">
                <h2>My Donations</h2>
                <div className="donations-filters">
                    <input 
                        type="text" 
                        placeholder="Search donations..." 
                        value={searchTerm} 
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="search-input"
                    />
                    <select 
                        value={filterCategory} 
                        onChange={(e) => setFilterCategory(e.target.value)}
                        className="filter-select"
                    >
                        {categories.map((cat, idx) => (
                            <option key={idx} value={cat}>{cat}</option>
                        ))}
                    </select>
                </div>
            </div>
            <div className="donations-container">
                {filteredDonations.length === 0 ? (
                    <p>No donations found.</p>
                ) : (
                    filteredDonations.map((donation, index) => {
                        return (
                            <div key={index} className="donation-card">
                                <div className="donation-image">
                                    <img src={url + "/images/" + donation.image} alt="" />
                                </div>
                                <div className="donation-info">
                                    <p><b>{donation.name}</b></p>
                                    <p>Category: {donation.category}</p>
                                    <p>Description: {donation.description}</p>
                                    {donation.date && <p>Date: {new Date(donation.date).toLocaleDateString()}</p>}
                                </div>
                                <div className="donation-status">
                                    <p>Price (Value): <span>₹{donation.price}</span></p>
                                    {donation.status && <p>Status: <span className={`status-${donation.status.toLowerCase()}`}>{donation.status}</span></p>}
                                </div>
                            </div>
                        );
                    })
                )}
            </div>
        </div>
    );
};

export default MyDonations;
