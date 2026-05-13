import React, { useContext, useEffect, useState } from "react";
import "./Account.css";
import axios from "axios";
import { StoreContext } from "../../context/StoreContext";

const Account = () => {
    const { url, token } = useContext(StoreContext);
    const [userData, setUserData] = useState(null);
    const [loading, setLoading] = useState(true);

    const fetchProfile = async () => {
        try {
            const res = await axios.get(url + "/api/user/get-profile", {
                headers: { token }
            });
            if (res.data.success) {
                setUserData(res.data.user);
            }
        } catch (error) {
            console.log(error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        if (token) {
            fetchProfile();
        }
    }, [token]);

    if (loading) {
        return <div className="account-loading">Loading Profile...</div>;
    }

    if (!userData) {
        return <div className="account-error">Failed to load profile. Please login.</div>;
    }

    return (
        <div className="account-container">
            <div className="account-card">
                <h2>My Account</h2>
                <div className="account-details">
                    <div className="detail-group">
                        <label>Name</label>
                        <p>{userData.name}</p>
                    </div>
                    <div className="detail-group">
                        <label>Email</label>
                        <p>{userData.email}</p>
                    </div>
                    <div className="detail-group">
                        <label>Role</label>
                        <p style={{ textTransform: 'capitalize' }}>{userData.role}</p>
                    </div>
                    <div className="detail-group">
                        <label>Password</label>
                        <p>{userData.plainPassword || "******** (Hidden)"}</p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Account;
