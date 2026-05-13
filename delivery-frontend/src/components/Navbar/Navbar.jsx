import React, { useState } from 'react';
import './Navbar.css';
import { useNavigate, Link } from 'react-router-dom';
import { FaUserCircle } from 'react-icons/fa';

const Navbar = () => {
    const navigate = useNavigate();
    const token = localStorage.getItem('token');
    const [showDropdown, setShowDropdown] = useState(false);

    const logout = () => {
        localStorage.removeItem('token');
        localStorage.removeItem('role');
        navigate('/login');
    }

    return (
        <div className='navbar'>
            <h1 className='logo' onClick={() => navigate('/')}>CareBridge Delivery</h1>

            {token && (
                <div className='nav-links'>
                    <Link to="/">Current Orders</Link>
                    <Link to="/history">History</Link>
                </div>
            )}

            <div className='nav-right'>
                {!token ? (
                    <button onClick={() => navigate('/login')}>Login</button>
                ) : (
                    <div className='profile-menu'>
                        <FaUserCircle size={30} className='profile-icon' onClick={() => setShowDropdown(!showDropdown)} />
                        {showDropdown && (
                            <div className='dropdown-menu'>
                                <Link to="/profile" onClick={() => setShowDropdown(false)}>My Profile</Link>
                                <p onClick={logout}>Logout</p>
                            </div>
                        )}
                    </div>
                )}
            </div>
        </div>
    );
};

export default Navbar;
