import React from 'react';
import { useNavigate } from 'react-router-dom';
import './Unauthorized.css';

const Unauthorized = () => {
    const navigate = useNavigate();
    return (
        <div className="unauthorized-page">
            <div className="unauthorized-content">
                <h1>403 - Access Denied</h1>
                <p>You do not have permission to view this page based on your current role.</p>
                <button onClick={() => navigate('/')}>Return Home</button>
            </div>
        </div>
    );
};
export default Unauthorized;
