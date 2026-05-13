import React, { useState } from 'react';
import './Login.css';
import axios from 'axios';
import { toast } from 'react-toastify';
import { useNavigate } from 'react-router-dom';

const Login = ({ url }) => {
    const [data, setData] = useState({
        email: "",
        password: ""
    });
    const navigate = useNavigate();

    const onChangeHandler = (event) => {
        const name = event.target.name;
        const value = event.target.value;
        setData(data => ({ ...data, [name]: value }));
    }

    const onLogin = async (event) => {
        event.preventDefault();
        try {
            const response = await axios.post(`${url}/api/user/login`, data);
            if (response.data.success) {
                localStorage.setItem("token", response.data.token);
                localStorage.setItem("role", response.data.role); // Store role for checks
                toast.success("Login Successful");
                navigate('/');
            } else {
                toast.error(response.data.message);
            }
        } catch (error) {
            toast.error("Error Logging In");
            console.error(error);
        }
    }

    return (
        <div className='login-container'>
            <form onSubmit={onLogin} className="login-form">
                <h2>Delivery Login</h2>
                <div className="form-group">
                    <label>Email</label>
                    <input type="email" name='email' onChange={onChangeHandler} value={data.email} required placeholder='Enter your email' autoComplete="email" />
                </div>
                <div className="form-group">
                    <label>Password</label>
                    <input type="password" name='password' onChange={onChangeHandler} value={data.password} required placeholder='Enter your password' autoComplete="current-password" />
                </div>
                <button type="submit">Login</button>
                <p>Don't have an account? <span onClick={() => navigate('/register')}>Register here</span></p>
            </form>
        </div>
    )
}

export default Login;
