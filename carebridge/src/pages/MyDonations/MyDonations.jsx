import React, { useContext, useEffect, useState } from "react";
import "./MyDonations.css";
import { StoreContext } from "../../context/StoreContext";
import axios from "axios";

const MyDonations = () => {
    const { token, url } = useContext(StoreContext);
    const [donations, setDonations] = useState([]);

    useEffect(() => {
        const fetchDonations = async () => {
            try {
                const res = await axios.post(
                    url + "/api/donation/user",
                    {},
                    { headers: { token } }
                );
                if (res.data.success) {
                    setDonations(res.data.data);
                }
            } catch (err) {
                console.log(err);
            }
        };

        if (token) {
            fetchDonations();
        }
    }, [token, url]);

    return (
        <div className="my-donations">
            <h2>My Donations</h2>
            <div className="donations-container">
                {donations.length === 0 ? (
                    <p>No donations found.</p>
                ) : (
                    donations.map((donation, index) => {
                        return (
                            <div key={index} className="donation-card">
                                <div className="donation-image">
                                    <img src={url + "/images/" + donation.image} alt="" />
                                </div>
                                <div className="donation-info">
                                    <p><b>{donation.name}</b></p>
                                    <p>Category: {donation.category}</p>
                                    <p>Description: {donation.description}</p>
                                </div>
                                <div className="donation-status">
                                    <p>Price (Value): <span>₹{donation.price}</span></p>
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
